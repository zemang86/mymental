/**
 * Intervention Module Service
 * Handles fetching and managing intervention modules with KB content
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-loaded Supabase client to avoid build-time errors
let _supabaseClient: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseClient) {
    _supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabaseClient;
}

export interface InterventionModule {
  id: string;
  slug: string;
  name: string;
  nameMs: string;
  description: string;
  descriptionMs: string;
  category: string;
  thumbnailUrl?: string;
  videoIntroUrl?: string;
  isPremium: boolean;
  isPublished: boolean;
  totalChapters: number;
  estimatedDuration?: number;
  chapters?: InterventionChapter[];
  userProgress?: UserInterventionProgress;
}

export interface InterventionChapter {
  id: string;
  interventionId: string;
  kbArticleId?: string;
  chapterOrder: number;
  title: string;
  titleMs: string;
  description?: string;
  descriptionMs?: string;
  isFreePreview: boolean;
  content?: string;
  exerciseSteps?: string[];
  estimatedDuration?: number;
  isCompleted?: boolean;
}

export interface UserInterventionProgress {
  interventionId: string;
  startedAt: string;
  lastActivityAt: string;
  completedChapters: number;
  totalTimeSpent: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface UserChapterProgress {
  chapterId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent: number;
  notes?: string;
}

// Database record types (internal use)
interface DbIntervention {
  id: string;
  slug: string;
  name: string;
  name_ms?: string;
  description?: string;
  description_ms?: string;
  category: string;
  thumbnail_url?: string;
  video_intro_url?: string;
  is_premium: boolean;
  is_published: boolean;
  total_chapters?: number;
  estimated_duration_minutes?: number;
}

interface DbChapter {
  id: string;
  intervention_id: string;
  kb_article_id?: string;
  chapter_order: number;
  title: string;
  title_ms?: string;
  description?: string;
  description_ms?: string;
  is_free_preview: boolean;
  kb_articles?: {
    content?: string;
    exercise_steps?: string[];
    estimated_duration_minutes?: number;
  };
}

/**
 * Get all published intervention modules
 */
export async function getInterventionModules(
  category?: string
): Promise<InterventionModule[]> {
  let query = getSupabaseAdmin()
    .from('interventions')
    .select('*')
    .eq('is_published', true)
    .order('category')
    .order('name');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching intervention modules:', error);
    return [];
  }

  return (data || []).map(transformIntervention);
}

/**
 * Get intervention modules grouped by category
 */
export async function getInterventionsByCategory(): Promise<
  Record<string, InterventionModule[]>
> {
  const modules = await getInterventionModules();

  return modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, InterventionModule[]>);
}

/**
 * Get a single intervention module by slug with chapters
 */
export async function getInterventionBySlug(
  slug: string,
  userId?: string
): Promise<InterventionModule | null> {
  const { data: intervention, error } = await getSupabaseAdmin()
    .from('interventions')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !intervention) {
    console.error('Error fetching intervention:', error);
    return null;
  }

  // Fetch chapters
  const { data: chapters } = await getSupabaseAdmin()
    .from('intervention_chapters')
    .select(`
      *,
      kb_articles (
        id,
        title,
        content,
        exercise_steps,
        estimated_duration_minutes
      )
    `)
    .eq('intervention_id', intervention.id)
    .order('chapter_order');

  // Fetch user progress if userId provided
  let userProgress: UserInterventionProgress | undefined;
  let chapterProgress: Record<string, UserChapterProgress> = {};

  if (userId) {
    const { data: progress } = await getSupabaseAdmin()
      .from('user_intervention_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('intervention_id', intervention.id)
      .single();

    if (progress) {
      userProgress = {
        interventionId: progress.intervention_id,
        startedAt: progress.started_at,
        lastActivityAt: progress.last_activity_at,
        completedChapters: progress.completed_chapters,
        totalTimeSpent: progress.total_time_spent_seconds,
        isCompleted: progress.is_completed,
        completedAt: progress.completed_at,
      };
    }

    // Fetch chapter-level progress
    const { data: exerciseProgress } = await getSupabaseAdmin()
      .from('user_exercise_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('intervention_id', intervention.id);

    if (exerciseProgress) {
      chapterProgress = exerciseProgress.reduce((acc, p) => {
        acc[p.chapter_id] = {
          chapterId: p.chapter_id,
          completed: p.completed,
          completedAt: p.completed_at,
          timeSpent: p.time_spent_seconds,
          notes: p.notes,
        };
        return acc;
      }, {} as Record<string, UserChapterProgress>);
    }
  }

  const transformedChapters: InterventionChapter[] = (chapters || []).map(
    (ch: DbChapter) => ({
      id: ch.id,
      interventionId: ch.intervention_id,
      kbArticleId: ch.kb_article_id,
      chapterOrder: ch.chapter_order,
      title: ch.title,
      titleMs: ch.title_ms || ch.title,
      description: ch.description,
      descriptionMs: ch.description_ms || ch.description,
      isFreePreview: ch.is_free_preview,
      content: ch.kb_articles?.content,
      exerciseSteps: ch.kb_articles?.exercise_steps || [],
      estimatedDuration: ch.kb_articles?.estimated_duration_minutes,
      isCompleted: chapterProgress[ch.id]?.completed || false,
    })
  );

  return {
    ...transformIntervention(intervention),
    chapters: transformedChapters,
    userProgress,
  };
}

/**
 * Get intervention modules from KB articles by category
 * Creates virtual modules from KB content for categories without structured interventions
 */
export async function getKBInterventions(
  category: string
): Promise<InterventionModule | null> {
  const { data: articles, error } = await getSupabaseAdmin()
    .from('kb_articles')
    .select('*')
    .eq('category', category)
    .order('order_index')
    .order('title');

  if (error || !articles || articles.length === 0) {
    return null;
  }

  // Create virtual intervention from KB articles
  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const chapters: InterventionChapter[] = articles.map((article, index) => ({
    id: article.id,
    interventionId: `kb-${category}`,
    kbArticleId: article.id,
    chapterOrder: index + 1,
    title: article.title,
    titleMs: article.title,
    description: article.content.slice(0, 200),
    descriptionMs: article.content.slice(0, 200),
    isFreePreview: index < 2, // First 2 chapters free
    content: article.content,
    exerciseSteps: article.exercise_steps || [],
    estimatedDuration: article.estimated_duration_minutes,
  }));

  return {
    id: `kb-${category}`,
    slug: category,
    name: `${categoryName} Module`,
    nameMs: `Modul ${categoryName}`,
    description: `Complete intervention module for ${categoryName.toLowerCase()} with ${articles.length} exercises and techniques.`,
    descriptionMs: `Modul intervensi lengkap untuk ${categoryName.toLowerCase()} dengan ${articles.length} latihan dan teknik.`,
    category,
    isPremium: true,
    isPublished: true,
    totalChapters: articles.length,
    chapters,
  };
}

/**
 * Save user progress for a chapter
 */
export async function saveChapterProgress(
  userId: string,
  interventionId: string,
  chapterId: string,
  kbArticleId: string | null,
  completed: boolean,
  timeSpent?: number,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  // Upsert chapter progress
  const { error: chapterError } = await getSupabaseAdmin()
    .from('user_exercise_progress')
    .upsert(
      {
        user_id: userId,
        intervention_id: interventionId,
        chapter_id: chapterId,
        kb_article_id: kbArticleId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        time_spent_seconds: timeSpent || 0,
        notes,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,kb_article_id,intervention_id',
      }
    );

  if (chapterError) {
    console.error('Error saving chapter progress:', chapterError);
    return { success: false, error: chapterError.message };
  }

  // Update intervention progress summary
  const { data: completedCount } = await getSupabaseAdmin()
    .from('user_exercise_progress')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('intervention_id', interventionId)
    .eq('completed', true);

  const { data: intervention } = await getSupabaseAdmin()
    .from('interventions')
    .select('total_chapters')
    .eq('id', interventionId)
    .single();

  const completedChapters = completedCount?.length || 0;
  const totalChapters = intervention?.total_chapters || 0;
  const isCompleted = completedChapters >= totalChapters && totalChapters > 0;

  const { error: progressError } = await getSupabaseAdmin()
    .from('user_intervention_progress')
    .upsert(
      {
        user_id: userId,
        intervention_id: interventionId,
        completed_chapters: completedChapters,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        last_activity_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,intervention_id',
      }
    );

  if (progressError) {
    console.error('Error updating intervention progress:', progressError);
  }

  return { success: true };
}

/**
 * Get user's progress across all interventions
 */
export async function getUserInterventionProgress(
  userId: string
): Promise<UserInterventionProgress[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('user_intervention_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_activity_at', { ascending: false });

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return (data || []).map(p => ({
    interventionId: p.intervention_id,
    startedAt: p.started_at,
    lastActivityAt: p.last_activity_at,
    completedChapters: p.completed_chapters,
    totalTimeSpent: p.total_time_spent_seconds,
    isCompleted: p.is_completed,
    completedAt: p.completed_at,
  }));
}

/**
 * Transform database intervention to module type
 */
function transformIntervention(data: DbIntervention): InterventionModule {
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    nameMs: data.name_ms || data.name,
    description: data.description || '',
    descriptionMs: data.description_ms || data.description || '',
    category: data.category,
    thumbnailUrl: data.thumbnail_url,
    videoIntroUrl: data.video_intro_url,
    isPremium: data.is_premium,
    isPublished: data.is_published,
    totalChapters: data.total_chapters || 0,
    estimatedDuration: data.estimated_duration_minutes,
  };
}
