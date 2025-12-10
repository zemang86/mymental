/**
 * Payments Module
 * Central export for payment functionality
 */

export * from './types';
export * from './simulation';

// Re-export commonly used items
export {
  PRICING_PLANS,
  ASSESSMENT_PRICES,
  formatPrice,
  isSimulationMode,
  type PaymentProvider,
  type PaymentStatus,
  type SubscriptionTier,
  type PricingPlan,
  type PaymentRecord,
  type UserSubscription,
} from './types';

export {
  simulatePayment,
  createSimulatedPaymentRecord,
  createSimulatedSubscription,
  getSimulatedSubscription,
  hasSimulatedPremiumAccess,
} from './simulation';
