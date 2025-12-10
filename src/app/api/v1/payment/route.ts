/**
 * Payment API Routes
 * Handles payment processing (simulation mode or real providers)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  isSimulationMode,
  simulatePayment,
  createSimulatedSubscription,
  PRICING_PLANS,
  ASSESSMENT_PRICES,
} from '@/lib/payments';

/**
 * POST /api/v1/payment
 * Process a payment
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, assessmentType } = body;

    // Determine what's being purchased
    let amount = 0;
    let purchaseType: 'subscription' | 'assessment' = 'subscription';

    if (planId) {
      const plan = PRICING_PLANS.find((p) => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
      }
      amount = plan.price;
      purchaseType = 'subscription';
    } else if (assessmentType) {
      const assessmentPrice = ASSESSMENT_PRICES[assessmentType];
      if (assessmentPrice === undefined) {
        return NextResponse.json({ error: 'Invalid assessment type' }, { status: 400 });
      }
      amount = assessmentPrice;
      purchaseType = 'assessment';
    } else {
      return NextResponse.json({ error: 'No plan or assessment specified' }, { status: 400 });
    }

    // Process payment
    if (isSimulationMode()) {
      // Simulation mode - instant success
      const result = await simulatePayment({
        userId: user.id,
        planId: planId || assessmentType,
        amount,
      });

      if (result.success) {
        // Record the payment
        const { error: paymentError } = await supabase.from('payments').insert({
          user_id: user.id,
          plan_id: planId || null,
          assessment_type: assessmentType || null,
          amount,
          currency: 'MYR',
          provider: 'simulation',
          status: 'completed',
          provider_payment_id: result.paymentId,
          metadata: { simulated: true },
        });

        if (paymentError) {
          console.error('Error recording payment:', paymentError);
        }

        // If subscription, update user's subscription
        if (purchaseType === 'subscription' && planId) {
          const plan = PRICING_PLANS.find((p) => p.id === planId)!;
          const subscription = createSimulatedSubscription({
            userId: user.id,
            tier: plan.tier,
            planId,
            durationMonths: plan.interval === 'yearly' ? 12 : 1,
          });

          // Upsert subscription
          const { error: subError } = await supabase.from('subscriptions').upsert(
            {
              user_id: user.id,
              tier: subscription.tier,
              plan_id: subscription.planId,
              status: subscription.status,
              current_period_start: subscription.currentPeriodStart.toISOString(),
              current_period_end: subscription.currentPeriodEnd.toISOString(),
            },
            { onConflict: 'user_id' }
          );

          if (subError) {
            console.error('Error updating subscription:', subError);
          }
        }

        // If assessment purchase, grant access
        if (purchaseType === 'assessment' && assessmentType) {
          const { error: accessError } = await supabase.from('assessment_access').insert({
            user_id: user.id,
            assessment_type: assessmentType,
            granted_at: new Date().toISOString(),
            payment_id: result.paymentId,
          });

          if (accessError) {
            console.error('Error granting assessment access:', accessError);
          }
        }

        return NextResponse.json({
          success: true,
          paymentId: result.paymentId,
          message: 'Payment successful (simulation mode)',
          redirectUrl: purchaseType === 'subscription' ? '/my-assessments' : `/test/${assessmentType}`,
        });
      }

      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Real payment mode - redirect to payment provider
    // TODO: Implement Stripe/Billplz integration when keys are available
    return NextResponse.json(
      { error: 'Real payment providers not configured. Enable simulation mode.' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

/**
 * GET /api/v1/payment
 * Get user's payment history
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

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
