import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'checkbox' | 'reflection';
  question: string;
  questionMs?: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  explanationMs?: string;
  isGraded: boolean;
}

/**
 * POST /api/v1/intervention/quiz/submit
 * Submit quiz answers and calculate score
 */
export async function POST(request: NextRequest) {
  try {
    const { quizId, answers, startTime, endTime } = await request.json();

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: 'Quiz ID and answers are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch quiz with questions
    const { data: quiz, error: quizError } = await supabase
      .from('intervention_quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const questions = quiz.questions as QuizQuestion[];

    // Calculate score
    let correctAnswers = 0;
    let totalGradedQuestions = 0;
    const results = questions.map((question) => {
      const userAnswer = answers[question.id];

      if (!question.isGraded) {
        // Reflection questions are not graded
        return {
          questionId: question.id,
          userAnswer,
          isCorrect: null,
          explanation: question.explanation,
        };
      }

      totalGradedQuestions++;

      let isCorrect = false;

      if (question.type === 'checkbox') {
        // For checkboxes, compare arrays
        const correctSet = new Set(question.correctAnswer as string[]);
        const userSet = new Set(userAnswer as string[]);
        isCorrect = correctSet.size === userSet.size &&
          [...correctSet].every(item => userSet.has(item));
      } else {
        // For single answer questions
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionId: question.id,
        userAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    // Calculate percentage
    const score = totalGradedQuestions > 0
      ? Math.round((correctAnswers / totalGradedQuestions) * 100)
      : 0;

    const passed = score >= (quiz.passing_score || 70);

    // Calculate time taken
    const timeTakenSeconds = startTime && endTime
      ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)
      : null;

    // Save attempt to database
    const { error: saveError } = await supabase
      .from('user_quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        chapter_id: quiz.chapter_id,
        answers,
        score,
        passed,
        time_taken_seconds: timeTakenSeconds,
      });

    if (saveError) {
      console.error('Error saving quiz attempt:', saveError);
      // Don't fail the request if save fails
    }

    return NextResponse.json({
      success: true,
      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions: totalGradedQuestions,
        passingScore: quiz.passing_score || 70,
        timeTaken: timeTakenSeconds,
        questionResults: results,
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
