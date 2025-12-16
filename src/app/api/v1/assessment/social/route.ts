import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateFunctionalLevel, getOverallRiskLevel, createReferralForHighRiskUser, type TriageResult } from '@/lib/assessment/triage';

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

    // Calculate total score (8 questions, 0-4 each = 0-32 max)
    const totalScore = Object.values(answers).reduce((sum: number, val) => sum + (val as number), 0);
    const functionalLevel = calculateFunctionalLevel(totalScore);

    // Get initial screening to combine risk levels
    const { data: initialScreening } = await supabase
      .from('initial_screenings')
      .select('risk_level, detected_conditions, has_suicidal_ideation, has_psychosis_indicators')
      .eq('session_id', sessionId)
      .single();

    const overallRisk = initialScreening
      ? getOverallRiskLevel(initialScreening.risk_level, functionalLevel)
      : functionalLevel === 'severe' ? 'high' : functionalLevel === 'low' ? 'moderate' : 'low';

    // Create social function screening record
    const { data: socialScreening, error: socialError } = await supabase
      .from('social_function_screenings')
      .insert({
        session_id: sessionId,
        user_id: session.user_id,
        answers,
        total_score: totalScore,
        functional_level: functionalLevel,
      })
      .select()
      .single();

    if (socialError) {
      console.error('Social screening save error:', socialError);
      return NextResponse.json(
        { error: 'Failed to save social screening' },
        { status: 500 }
      );
    }

    // Create automatic referral if overall risk is high/imminent AND user not yet referred
    if (session.user_id && (overallRisk === 'high' || overallRisk === 'imminent') && initialScreening) {
      // Check if referral already exists
      const { data: existingReferral } = await supabase
        .from('user_referrals')
        .select('id')
        .eq('user_id', session.user_id)
        .eq('risk_level', overallRisk)
        .single();

      if (!existingReferral) {
        const triageResult: TriageResult = {
          riskLevel: overallRisk,
          triggeredRules: [],
          actions: [],
          shouldBlockChat: false,
          shouldShowEmergency: overallRisk === 'imminent',
          shouldRedirectEmergency: overallRisk === 'imminent',
          highestRiskReason: `Severe functional impairment (${functionalLevel}) combined with ${initialScreening.risk_level} risk`,
          hasSuicidalIdeation: initialScreening.has_suicidal_ideation || false,
          hasPsychosisIndicators: initialScreening.has_psychosis_indicators || false,
          triggerQuestions: [],
        };

        createReferralForHighRiskUser(
          session.user_id,
          triageResult,
          initialScreening.detected_conditions || []
        ).catch((error) => {
          console.error('Failed to create automatic referral:', error);
        });
      }
    }

    return NextResponse.json({
      success: true,
      socialScreeningId: socialScreening.id,
      totalScore,
      functionalLevel,
      overallRisk,
    });
  } catch (error) {
    console.error('Social screening error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
