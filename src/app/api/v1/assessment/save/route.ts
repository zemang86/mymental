/**
 * Save Assessment Results API
 * Saves detailed assessment results to the database
 * Also generates AI insights and stores them
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateStructuredInsights } from '@/lib/ai/rag';
import type { AssessmentType } from '@/types/assessment';

interface SaveAssessmentRequest {
  type: AssessmentType;
  score: number;
  maxScore: number;
  severity: string;
  answers: Record<string, number>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: SaveAssessmentRequest = await request.json();
    const { type, score, maxScore, severity, answers } = body;

    // Validate required fields
    if (!type || score === undefined || !maxScore || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    const profileExists = !!profile;

    // For users without profile, create a demographic session
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

    // Map severity to risk_level
    const riskLevel = severity.toLowerCase().includes('severe')
      ? 'high'
      : severity.toLowerCase().includes('moderate')
        ? 'moderate'
        : 'low';

    // Generate AI insights (don't block save if this fails)
    let aiInsights = null;
    try {
      aiInsights = await generateStructuredInsights(type, score, maxScore, severity, riskLevel);
    } catch (insightError) {
      console.error('Failed to generate AI insights:', insightError);
      // Continue with save even if insights generation fails
    }

    // Save to assessments table (use admin client to bypass RLS)
    const { data: assessment, error: insertError } = await adminClient
      .from('assessments')
      .insert({
        user_id: profileExists ? user.id : null,
        session_id: profileExists ? null : demographicSessionId,
        assessment_type: type,
        total_score: score,
        score_breakdown: { maxScore, severity, aiInsights },
        raw_answers: answers,
        risk_level: riskLevel,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving assessment:', insertError);
      return NextResponse.json(
        { error: 'Failed to save assessment', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      insights: aiInsights,
    });
  } catch (error) {
    console.error('Assessment save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
