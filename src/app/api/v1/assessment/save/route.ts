/**
 * Save Assessment Results API
 * Saves detailed assessment results to the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    // Map severity to risk_level
    const riskLevel = severity.toLowerCase().includes('severe')
      ? 'high'
      : severity.toLowerCase().includes('moderate')
        ? 'moderate'
        : 'low';

    // Save to assessments table
    const { data: assessment, error: insertError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        assessment_type: type,
        total_score: score,
        score_breakdown: { maxScore, severity },
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
        { error: 'Failed to save assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
    });
  } catch (error) {
    console.error('Assessment save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
