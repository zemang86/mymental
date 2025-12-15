/**
 * Intervention Recommendations Service
 * Maps assessment results to relevant intervention content from KB
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  generateEmbedding,
  searchSimilarDocumentsByCategories,
  getKBCategoriesForAssessment,
} from '@/lib/ai/embeddings';
import type {
  RecommendedExercise,
  InterventionModule,
  InterventionRecommendations,
} from '@/types/intervention-recommendations';

// Lazy-loaded client to avoid build-time errors
let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

/**
 * Assessment type to intervention module mapping
 */
export const ASSESSMENT_TO_INTERVENTION: Record<string, string[]> = {
  depression: ['stress-management', 'mindfulness'],
  anxiety: ['anxiety-module', 'breathing-techniques', 'mindfulness'],
  ocd: ['ocd-module'],
  ptsd: ['ptsd-module'],
  insomnia: ['insomnia-module', 'sleep-hygiene'],
  suicidal: ['crisis-coping', 'suicide-prevention'],
  psychosis: [], // Professional referral only
  sexual_addiction: ['sexual-addiction-module'],
  marital_distress: ['marital-distress-module', 'relationship-skills'],
};

/**
 * Severity-based exercise count
 */
const EXERCISE_COUNT_BY_SEVERITY: Record<string, number> = {
  minimal: 2,
  mild: 3,
  moderate: 4,
  moderately_severe: 5,
  severe: 6,
};

/**
 * Extract exercise title from KB article content
 */
function extractExerciseInfo(content: string, title: string): {
  description: string;
  descriptionMs: string;
  steps: string[];
  stepsMs: string[];
  duration?: string;
} {
  // Try to extract description (first paragraph or first 200 chars)
  const lines = content.split('\n').filter(line => line.trim());
  const description = lines[0]?.slice(0, 200) || title;

  // Try to extract steps (look for numbered items or bullet points)
  const stepRegex = /^(?:\d+\.|[-•])\s*(.+)$/gm;
  const steps: string[] = [];
  let match;
  while ((match = stepRegex.exec(content)) !== null && steps.length < 5) {
    steps.push(match[1].trim());
  }

  // Estimate duration based on content length
  const wordCount = content.split(/\s+/).length;
  let duration: string | undefined;
  if (wordCount < 200) duration = '5 min';
  else if (wordCount < 500) duration = '10 min';
  else if (wordCount < 1000) duration = '15 min';
  else duration = '20 min';

  return {
    description,
    descriptionMs: description, // KB content is already bilingual
    steps,
    stepsMs: steps,
    duration,
  };
}

/**
 * Get recommended exercises based on assessment results
 */
export async function getRecommendedExercises(
  assessmentType: string,
  severity: string,
  limit?: number
): Promise<RecommendedExercise[]> {
  const exerciseCount = limit || EXERCISE_COUNT_BY_SEVERITY[severity.toLowerCase()] || 3;
  const categories = getKBCategoriesForAssessment(assessmentType);

  // Build search query for exercises/techniques
  const searchQuery = `${assessmentType} teknik latihan exercise strategy coping intervention`;

  try {
    const { embedding } = await generateEmbedding(searchQuery);
    const articles = await searchSimilarDocumentsByCategories(
      embedding,
      categories,
      Math.ceil(exerciseCount / categories.length) + 1,
      0.3 // Lower threshold for exercises
    );

    // Transform KB articles into exercise recommendations
    const exercises: RecommendedExercise[] = articles
      .slice(0, exerciseCount)
      .map((article, index) => {
        const info = extractExerciseInfo(article.content, article.title);

        return {
          id: article.id,
          title: article.title,
          titleMs: article.title, // KB titles are usually in Malay
          description: info.description,
          descriptionMs: info.descriptionMs,
          category: article.category,
          source: 'kb_article' as const,
          sourceId: article.id,
          sourceName: `${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} Module`,
          duration: info.duration,
          isPremium: index >= 2, // First 2 are free preview
          steps: info.steps,
          stepsMs: info.stepsMs,
        };
      });

    return exercises;
  } catch (error) {
    console.error('Error getting recommended exercises:', error);
    return [];
  }
}

/**
 * Get intervention modules related to assessment type
 */
export async function getRelatedModules(
  assessmentType: string
): Promise<InterventionModule[]> {
  const categories = getKBCategoriesForAssessment(assessmentType);

  // Get unique articles grouped by category to create "modules"
  const { data: articles, error } = await getSupabase()
    .from('kb_articles')
    .select('id, title, category, content')
    .in('category', categories)
    .limit(20);

  if (error || !articles) {
    console.error('Error fetching modules:', error);
    return [];
  }

  // Group by category to create module summaries
  const categoryGroups = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, typeof articles>);

  const modules: InterventionModule[] = Object.entries(categoryGroups).map(
    ([category, categoryArticles]) => {
      const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      return {
        id: category,
        name: `${categoryName} Intervention Module`,
        nameMs: `Modul Intervensi ${categoryName}`,
        category,
        description: `Complete intervention program for ${category.replace(/-/g, ' ')} with ${categoryArticles.length} exercises and techniques.`,
        descriptionMs: `Program intervensi lengkap untuk ${category.replace(/-/g, ' ')} dengan ${categoryArticles.length} latihan dan teknik.`,
        exerciseCount: categoryArticles.length,
        isPremium: true,
      };
    }
  );

  return modules;
}

/**
 * Get full intervention recommendations for an assessment
 */
export async function getInterventionRecommendations(
  assessmentType: string,
  severity: string
): Promise<InterventionRecommendations> {
  const [exercises, modules] = await Promise.all([
    getRecommendedExercises(assessmentType, severity),
    getRelatedModules(assessmentType),
  ]);

  return {
    exercises,
    modules,
    assessmentType,
    severity,
    generatedAt: new Date().toISOString(),
  };
}
