/**
 * Create Referral API Endpoint
 * Automatically creates referrals for high-risk users detected by triage
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Validate required fields
    if (!userId || !riskLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only allow users to create referrals for themselves
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const admin = getSupabaseAdmin();

    // Create referral record
    const { data: referral, error: referralError } = await admin
      .from('user_referrals')
      // @ts-expect-error - Supabase type inference issue with dynamic inserts
      .insert({
        user_id: userId,
        risk_level: riskLevel,
        detected_conditions: detectedConditions || [],
        referral_reason: referralReason,
        status: 'pending',
        contact_preference: contactPreference || ['phone'],
        preferred_languages: preferredLanguages || ['English'],
        notes: notes || null,
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
      const { data: alert, error: alertError } = await admin
        .from('referral_alerts')
        // @ts-expect-error - Supabase type inference issue with dynamic inserts
        .insert({
          user_id: userId,
          referral_id: (referral as any)?.id,
          alert_type: riskLevel === 'imminent' ? 'imminent_risk' : 'high_risk',
          is_read: false,
          is_actioned: false,
        })
        .select()
        .single();

      if (alertError) {
        console.error('Error creating alert:', alertError);
      } else {
        alertId = (alert as any)?.id;
      }
    }

    // Send email with crisis resources (async, don't block response)
    if (riskLevel === 'high' || riskLevel === 'imminent') {
      fetch('/api/v1/email/send-crisis-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          riskLevel,
          referralId: (referral as any)?.id,
        }),
      }).catch((error) => {
        console.error('Error sending crisis email:', error);
      });
    }

    return NextResponse.json({
      success: true,
      referralId: (referral as any)?.id,
      alertId,
      message: 'Referral created successfully',
    });
  } catch (error) {
    console.error('Error in create referral API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
