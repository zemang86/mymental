import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      demographics,
      hasAcceptedTerms,
      hasAcceptedPrivacy,
    } = body;

    // Validate required fields
    if (!demographics || !hasAcceptedTerms || !hasAcceptedPrivacy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate demographics
    if (!demographics.age || demographics.age < 13 || demographics.age > 120) {
      return NextResponse.json(
        { error: 'Invalid age' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Generate or use provided session ID
    const finalSessionId = sessionId || nanoid();

    // Create demographic session record
    const { data: session, error: sessionError } = await supabase
      .from('demographic_sessions')
      .insert({
        id: finalSessionId,
        user_id: user?.id || null,
        age: demographics.age,
        gender: demographics.gender,
        marital_status: demographics.maritalStatus,
        nationality: demographics.nationality,
        religion: demographics.religion,
        education: demographics.education,
        occupation: demographics.occupation,
        has_mental_illness_diagnosis: demographics.hasMentalIllnessDiagnosis || false,
        accepted_terms: hasAcceptedTerms,
        accepted_privacy: hasAcceptedPrivacy,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: 'Assessment session started',
    });
  } catch (error) {
    console.error('Assessment start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
