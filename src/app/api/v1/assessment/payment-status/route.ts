import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/assessment/payment-status
 * Check if user has paid for assessment results access
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          hasPaid: false,
          hasSubscription: false,
          error: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    // Check if user has results access using database function
    const { data: hasAccess, error: accessError } = await supabase.rpc(
      'has_results_access',
      {
        user_uuid: user.id,
      }
    );

    if (accessError) {
      console.error('Error checking results access:', accessError);
      return NextResponse.json(
        {
          hasPaid: false,
          hasSubscription: false,
          error: 'Failed to check payment status',
        },
        { status: 500 }
      );
    }

    // Also check for active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier, status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .single();

    const hasSubscription = !subError && subscription !== null;

    // Check for recent completed payments
    const { data: recentPayment, error: paymentError } = await supabase
      .from('payments')
      .select('id, plan_id, created_at, status')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const hasRecentPayment = !paymentError && recentPayment !== null;

    return NextResponse.json({
      hasPaid: hasAccess || false,
      hasSubscription,
      hasRecentPayment,
      subscription: hasSubscription ? {
        tier: subscription.tier,
        expiresAt: subscription.current_period_end,
      } : null,
      recentPayment: hasRecentPayment ? {
        planId: recentPayment.plan_id,
        paidAt: recentPayment.created_at,
      } : null,
    });
  } catch (error) {
    console.error('Error in payment-status:', error);
    return NextResponse.json(
      {
        hasPaid: false,
        hasSubscription: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
