import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/intervention/quiz/[quizId]
 * Fetch quiz questions for a specific quiz
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const supabase = await createClient();

    // Get quiz details with chapter info
    const { data: quiz, error: quizError } = await supabase
      .from('intervention_quizzes')
      .select(`
        *,
        intervention_chapters (
          id,
          title,
          title_ms,
          intervention_id
        )
      `)
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        chapterId: quiz.chapter_id,
        title: quiz.title,
        titleMs: quiz.title_ms,
        questions: quiz.questions,
        passingScore: quiz.passing_score,
        chapter: quiz.intervention_chapters,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
