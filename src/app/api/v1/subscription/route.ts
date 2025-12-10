/**
 * Subscription API Routes
 * Check and manage user subscription status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSimulationMode, getSimulatedSubscription, PRICING_PLANS } from '@/lib/payments';

/**
 * GET /api/v1/subscription
 * Get current user's subscription status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In simulation mode, return simulated premium access
    if (isSimulationMode()) {
      const simSubscription = getSimulatedSubscription(user.id);
      const plan = PRICING_PLANS.find((p) => p.id === simSubscription?.planId);

      return NextResponse.json({
        subscription: simSubscription,
        plan,
        hasAccess: true,
        isSimulated: true,
        message: 'Simulation mode: Full premium access granted',
      });
    }

    // Real mode - check database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching subscription:', error);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    if (!subscription) {
      // No active subscription - return free tier
      const freePlan = PRICING_PLANS.find((p) => p.id === 'free');
      return NextResponse.json({
        subscription: null,
        plan: freePlan,
        hasAccess: false,
        isSimulated: false,
      });
    }

    // Check if subscription is expired
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);

    if (periodEnd < now) {
      // Subscription expired
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscription.id);

      const freePlan = PRICING_PLANS.find((p) => p.id === 'free');
      return NextResponse.json({
        subscription: null,
        plan: freePlan,
        hasAccess: false,
        isSimulated: false,
        message: 'Subscription expired',
      });
    }

    const plan = PRICING_PLANS.find((p) => p.id === subscription.plan_id);

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        tier: subscription.tier,
        planId: subscription.plan_id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        createdAt: subscription.created_at,
      },
      plan,
      hasAccess: subscription.tier !== 'free',
      isSimulated: false,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/subscription
 * Cancel subscription
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In simulation mode, just return success
    if (isSimulationMode()) {
      return NextResponse.json({
        success: true,
        message: 'Subscription cancelled (simulation mode)',
      });
    }

    // Real mode - cancel in database
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (error) {
      console.error('Error cancelling subscription:', error);
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
