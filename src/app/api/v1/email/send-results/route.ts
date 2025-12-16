import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendAssessmentResults, isEmailConfigured } from '@/lib/email';

/**
 * POST /api/v1/email/send-results
 * Send assessment results to user's email
 */
export async function POST(request: NextRequest) {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const body = await request.json();
    const { detectedConditions, riskLevel, functionalLevel, socialFunctionScore } = body;

    // Send email
    await sendAssessmentResults({
      to: profile?.email || user.email!,
      userName: profile?.full_name,
      detectedConditions,
      riskLevel,
      functionalLevel,
      socialFunctionScore,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending results email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
