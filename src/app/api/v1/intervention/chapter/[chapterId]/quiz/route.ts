import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/intervention/chapter/[chapterId]/quiz
 * Get quiz ID for a chapter
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;
    const supabase = await createClient();

    const { data: quiz, error } = await supabase
      .from('intervention_quizzes')
      .select('id')
      .eq('chapter_id', chapterId)
      .single();

    if (error || !quiz) {
      return NextResponse.json(
        { success: false, quizId: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      quizId: quiz.id,
    });
  } catch (error) {
    console.error('Error fetching chapter quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
