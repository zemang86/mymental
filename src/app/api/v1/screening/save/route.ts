/**
 * Save Initial Screening Results API
 * Saves the initial screening and social function assessment to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AssessmentType, RiskLevel } from '@/types/assessment';

interface SaveScreeningRequest {
  // Initial screening data
  initialScreeningAnswers: Record<string, boolean>;
  detectedConditions: AssessmentType[];
  riskLevel: RiskLevel;
  hasSuicidalIdeation: boolean;
  hasPsychosisIndicators: boolean;

  // Social function data
  socialFunctionAnswers: Record<string, number>;
  socialFunctionScore: number;
  functionalLevel: 'high' | 'moderate' | 'low' | 'severe';

  // Demographics (optional)
  demographics?: Record<string, unknown>;

  // Session ID for anonymous users
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current user (optional - can save anonymously)
    const { data: { user } } = await supabase.auth.getUser();

    const body: SaveScreeningRequest = await request.json();
    const {
      initialScreeningAnswers,
      detectedConditions,
      riskLevel,
      hasSuicidalIdeation,
      hasPsychosisIndicators,
      socialFunctionAnswers,
      socialFunctionScore,
      functionalLevel,
    } = body;

    // Validate required fields
    if (!initialScreeningAnswers || !detectedConditions || !riskLevel) {
      return NextResponse.json(
        { error: 'Missing required screening fields' },
        { status: 400 }
      );
    }

    // Check if user has a profile (user_id FK references profiles table)
    let profileExists = false;
    if (user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      profileExists = !!profile;
    }

    // For anonymous users, create a demographic session first
    let demographicSessionId: string | null = null;
    if (!profileExists) {
      const { data: session, error: sessionError } = await adminClient
        .from('demographic_sessions')
        .insert({
          session_token: crypto.randomUUID(),
          accepted_terms: true,
          accepted_privacy: true,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating demographic session:', sessionError);
        return NextResponse.json(
          { error: 'Failed to create session', details: sessionError.message },
          { status: 500 }
        );
      }
      demographicSessionId = session.id;
    }

    // 1. Save initial screening (use admin client to bypass RLS for anonymous users)
    const { data: initialScreening, error: initialError } = await adminClient
      .from('initial_screenings')
      .insert({
        user_id: profileExists ? user!.id : null,
        session_id: profileExists ? null : demographicSessionId,
        raw_answers: initialScreeningAnswers,
        detected_conditions: detectedConditions,
        has_suicidal_ideation: hasSuicidalIdeation,
        has_psychosis_indicators: hasPsychosisIndicators,
        overall_risk_level: riskLevel,
      })
      .select()
      .single();

    if (initialError) {
      console.error('Error saving initial screening:', initialError);
      return NextResponse.json(
        { error: 'Failed to save initial screening', details: initialError.message },
        { status: 500 }
      );
    }

    // 2. Save social function screening (if provided)
    let socialScreeningId = null;
    if (socialFunctionAnswers && Object.keys(socialFunctionAnswers).length > 0 && socialFunctionScore !== undefined) {
      const { data: socialScreening, error: socialError } = await adminClient
        .from('social_function_screenings')
        .insert({
          user_id: profileExists ? user!.id : null,
          session_id: profileExists ? null : demographicSessionId,
          initial_screening_id: initialScreening.id,
          raw_answers: socialFunctionAnswers,
          total_score: socialFunctionScore,
          functional_level: functionalLevel || 'moderate',
        })
        .select()
        .single();

      if (socialError) {
        console.error('Error saving social screening:', socialError);
        // Don't fail the whole request, just log the error
      } else {
        socialScreeningId = socialScreening.id;
      }
    }

    // 3. Log triage event if high risk
    if (riskLevel === 'imminent' || riskLevel === 'high') {
      await adminClient.from('triage_events').insert({
        initial_screening_id: initialScreening.id,
        user_id: profileExists ? user!.id : null,
        session_id: profileExists ? null : demographicSessionId,
        risk_level: riskLevel,
        trigger_reason: hasSuicidalIdeation
          ? 'Suicidal ideation detected'
          : hasPsychosisIndicators
            ? 'Psychosis indicators detected'
            : 'High risk detected in screening',
      });
    }

    return NextResponse.json({
      success: true,
      initialScreeningId: initialScreening.id,
      socialScreeningId,
    });
  } catch (error) {
    console.error('Screening save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
