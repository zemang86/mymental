/**
 * Payment Simulation Module
 * Simulates payment processing for development without real payment keys
 */

import { PaymentRecord, PaymentStatus, UserSubscription, SubscriptionTier } from './types';

// Simulated delay to mimic real payment processing
const SIMULATION_DELAY = 1500; // 1.5 seconds

/**
 * Simulate a payment transaction
 */
export async function simulatePayment(params: {
  userId: string;
  planId: string;
  amount: number;
  currency?: string;
}): Promise<{
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  message: string;
}> {
  const { userId, planId, amount, currency = 'MYR' } = params;

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, SIMULATION_DELAY));

  // Generate a fake payment ID
  const paymentId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // In simulation mode, payments always succeed
  // You can add logic here to test failure scenarios if needed
  const shouldSucceed = true;

  if (shouldSucceed) {
    return {
      success: true,
      paymentId,
      status: 'completed',
      message: 'Payment simulated successfully',
    };
  }

  return {
    success: false,
    paymentId,
    status: 'failed',
    message: 'Simulated payment failure',
  };
}

/**
 * Create a simulated payment record
 */
export function createSimulatedPaymentRecord(params: {
  userId: string;
  planId: string;
  amount: number;
  currency?: string;
}): PaymentRecord {
  const now = new Date();

  return {
    id: `sim_pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId: params.userId,
    planId: params.planId,
    amount: params.amount,
    currency: params.currency || 'MYR',
    provider: 'simulation',
    status: 'completed',
    metadata: {
      simulated: true,
      simulatedAt: now.toISOString(),
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a simulated subscription
 */
export function createSimulatedSubscription(params: {
  userId: string;
  tier: SubscriptionTier;
  planId: string;
  durationMonths?: number;
}): UserSubscription {
  const now = new Date();
  const durationMonths = params.durationMonths || (params.planId.includes('yearly') ? 12 : 1);

  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + durationMonths);

  return {
    id: `sim_sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId: params.userId,
    tier: params.tier,
    planId: params.planId,
    status: 'active',
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    createdAt: now,
  };
}

/**
 * Get simulated subscription status for a user
 * In simulation mode, this can be overridden via localStorage on the client
 */
export function getSimulatedSubscription(userId: string): UserSubscription | null {
  // For server-side, return premium by default in simulation mode
  // This allows full access during development
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setFullYear(periodEnd.getFullYear() + 1);

  return {
    id: `sim_sub_${userId}`,
    userId,
    tier: 'premium',
    planId: 'premium_monthly',
    status: 'active',
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    createdAt: now,
  };
}

/**
 * Check if user has premium access in simulation mode
 */
export function hasSimulatedPremiumAccess(userId: string): boolean {
  // In simulation mode, everyone gets premium access
  return true;
}

/**
 * Validate a simulated payment (for webhook simulation)
 */
export function validateSimulatedPayment(paymentId: string): boolean {
  // All simulation payments are valid if they start with 'sim_'
  return paymentId.startsWith('sim_');
}
