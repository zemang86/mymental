/**
 * Intervention Progress API
 * Handles saving and retrieving user progress for interventions
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveChapterProgress, getUserInterventionProgress } from '@/lib/interventions/modules';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Retrieve user's progress for interventions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const interventionId = searchParams.get('interventionId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // If specific intervention requested, get detailed progress
    if (interventionId) {
      const { data: progress, error } = await supabaseAdmin
        .from('user_intervention_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('intervention_id', interventionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error;
      }

      // Get chapter-level progress
      const { data: chapterProgress } = await supabaseAdmin
        .from('user_exercise_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('intervention_id', interventionId);

      return NextResponse.json({
        progress: progress
          ? {
              interventionId: progress.intervention_id,
              startedAt: progress.started_at,
              lastActivityAt: progress.last_activity_at,
              completedChapters: progress.completed_chapters,
              totalTimeSpent: progress.total_time_spent_seconds,
              isCompleted: progress.is_completed,
              completedAt: progress.completed_at,
            }
          : null,
        chapterProgress: (chapterProgress || []).map((p) => ({
          chapterId: p.chapter_id,
          completed: p.completed,
          completedAt: p.completed_at,
          timeSpent: p.time_spent_seconds,
          notes: p.notes,
        })),
      });
    }

    // Get all intervention progress for user
    const allProgress = await getUserInterventionProgress(userId);

    return NextResponse.json({
      progress: allProgress,
    });
  } catch (error) {
    console.error('Error fetching intervention progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST: Save chapter progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      interventionId,
      chapterId,
      kbArticleId,
      completed,
      timeSpent,
      notes,
    } = body;

    if (!userId || !interventionId || !chapterId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, interventionId, chapterId' },
        { status: 400 }
      );
    }

    const result = await saveChapterProgress(
      userId,
      interventionId,
      chapterId,
      kbArticleId || null,
      completed ?? true,
      timeSpent,
      notes
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to save progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully',
    });
  } catch (error) {
    console.error('Error saving intervention progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

// PATCH: Update intervention enrollment (start tracking)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, interventionId, action } = body;

    if (!userId || !interventionId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, interventionId, action' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      // Start tracking this intervention
      const { error } = await supabaseAdmin
        .from('user_intervention_progress')
        .upsert(
          {
            user_id: userId,
            intervention_id: interventionId,
            started_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
            completed_chapters: 0,
            total_time_spent_seconds: 0,
            is_completed: false,
          },
          {
            onConflict: 'user_id,intervention_id',
            ignoreDuplicates: true, // Don't update if already exists
          }
        );

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: 'Intervention tracking started',
      });
    }

    if (action === 'update_time') {
      const { timeSpent } = body;

      if (typeof timeSpent !== 'number') {
        return NextResponse.json(
          { error: 'timeSpent is required for update_time action' },
          { status: 400 }
        );
      }

      const { error } = await supabaseAdmin
        .from('user_intervention_progress')
        .update({
          total_time_spent_seconds: timeSpent,
          last_activity_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('intervention_id', interventionId);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: 'Time updated',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: start, update_time' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating intervention progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
