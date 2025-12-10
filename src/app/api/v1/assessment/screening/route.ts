import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { evaluateTriage, detectConditions } from '@/lib/assessment/triage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      answers,
    } = body;

    if (!sessionId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify session exists
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

    // Perform triage evaluation
    const triageResult = evaluateTriage(answers);
    const detectedConditions = detectConditions(answers);

    // Create initial screening record
    const { data: screening, error: screeningError } = await supabase
      .from('initial_screenings')
      .insert({
        session_id: sessionId,
        user_id: session.user_id,
        answers,
        risk_level: triageResult.riskLevel,
        detected_conditions: detectedConditions,
        has_suicidal_ideation: triageResult.hasSuicidalIdeation,
        has_psychosis_indicators: triageResult.hasPsychosisIndicators,
      })
      .select()
      .single();

    if (screeningError) {
      console.error('Screening save error:', screeningError);
      return NextResponse.json(
        { error: 'Failed to save screening' },
        { status: 500 }
      );
    }

    // Log triage event if risk detected
    if (triageResult.riskLevel !== 'low') {
      await supabase.from('triage_events').insert({
        session_id: sessionId,
        user_id: session.user_id,
        risk_level: triageResult.riskLevel,
        trigger_question: triageResult.triggerQuestions?.[0] || null,
        trigger_answer: true,
        action_taken: triageResult.actions,
      });
    }

    return NextResponse.json({
      success: true,
      screeningId: screening.id,
      riskLevel: triageResult.riskLevel,
      detectedConditions,
      shouldShowEmergency: triageResult.shouldShowEmergency,
      hasSuicidalIdeation: triageResult.hasSuicidalIdeation,
    });
  } catch (error) {
    console.error('Screening error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
