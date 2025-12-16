import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * POST /api/v1/referral/create
 * Create a professional referral for a user
 */
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const {
      userId,
      riskLevel,
      detectedConditions,
      referralReason,
      contactPreference,
      preferredLanguages,
      notes,
    } = body;

    // Create referral
    const { data: referral, error: referralError } = await supabase
      .from('user_referrals')
      .insert({
        user_id: userId || user.id,
        risk_level: riskLevel,
        detected_conditions: detectedConditions,
        referral_reason: referralReason,
        contact_preference: contactPreference,
        preferred_languages: preferredLanguages,
        notes,
        status: 'pending',
      })
      .select()
      .single();

    if (referralError) {
      console.error('Error creating referral:', referralError);
      return NextResponse.json(
        { error: 'Failed to create referral' },
        { status: 500 }
      );
    }

    // Create admin alert for high/imminent risk
    let alertId = null;
    if (riskLevel === 'high' || riskLevel === 'imminent') {
      const { data: alert, error: alertError } = await supabase
        .from('referral_alerts')
        .insert({
          user_id: userId || user.id,
          referral_id: referral.id,
          alert_type: riskLevel === 'imminent' ? 'imminent_risk' : 'high_risk',
        })
        .select()
        .single();

      if (!alertError && alert) {
        alertId = alert.id;
      }
    }

    return NextResponse.json({
      success: true,
      referralId: referral.id,
      alertId,
    });
  } catch (error) {
    console.error('Error in referral creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
