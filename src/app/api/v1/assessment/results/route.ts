import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get demographic session
    const { data: session, error: sessionError } = await supabase
      .from('demographic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Get initial screening
    const { data: initialScreening } = await supabase
      .from('initial_screenings')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    // Get social function screening
    const { data: socialScreening } = await supabase
      .from('social_function_screenings')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    // Compile results
    const results = {
      sessionId,
      demographics: {
        age: session.age,
        gender: session.gender,
        maritalStatus: session.marital_status,
        occupation: session.occupation,
      },
      initialScreening: initialScreening ? {
        riskLevel: initialScreening.risk_level,
        detectedConditions: initialScreening.detected_conditions,
        hasSuicidalIdeation: initialScreening.has_suicidal_ideation,
        hasPsychosisIndicators: initialScreening.has_psychosis_indicators,
        completedAt: initialScreening.created_at,
      } : null,
      socialFunction: socialScreening ? {
        totalScore: socialScreening.total_score,
        functionalLevel: socialScreening.functional_level,
        completedAt: socialScreening.created_at,
      } : null,
      isComplete: !!(initialScreening && socialScreening),
      createdAt: session.created_at,
    };

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Results fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
