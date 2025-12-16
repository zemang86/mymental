/**
 * Payment Types and Constants
 */

export type PaymentProvider = 'stripe' | 'fpx' | 'billplz' | 'simulation';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface PricingPlan {
  id: string;
  name: string;
  nameMs: string;
  tier: SubscriptionTier;
  price: number; // in MYR cents (e.g., 2900 = RM29.00)
  currency: 'MYR';
  interval: 'one_time' | 'monthly' | '6_months' | 'yearly';
  features: string[];
  featuresMs: string[];
  popular?: boolean;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
}

// Pricing Plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameMs: 'Percuma',
    tier: 'free',
    price: 0,
    currency: 'MYR',
    interval: 'one_time',
    features: [
      'Initial mental health screening',
      'Basic results overview',
      'Emergency resources access',
      'Limited AI chat (5 messages/day)',
    ],
    featuresMs: [
      'Saringan kesihatan mental awal',
      'Gambaran keputusan asas',
      'Akses sumber kecemasan',
      'Sembang AI terhad (5 mesej/hari)',
    ],
  },
  {
    id: 'premium_6months',
    name: 'Premium - 6 Months',
    nameMs: 'Premium - 6 Bulan',
    tier: 'premium',
    price: 2900, // RM29.00
    currency: 'MYR',
    interval: '6_months',
    popular: true,
    features: [
      'All free features',
      'Unlimited detailed assessments',
      'All 9 screening instruments',
      'Personalized insights',
      'Unlimited AI chat',
      'Detailed PDF reports',
      'Video interventions access',
      'Professional referral support',
      '6 months access',
    ],
    featuresMs: [
      'Semua ciri percuma',
      'Penilaian terperinci tanpa had',
      'Semua 9 instrumen saringan',
      'Pandangan peribadi',
      'Sembang AI tanpa had',
      'Laporan PDF terperinci',
      'Akses intervensi video',
      'Sokongan rujukan profesional',
      'Akses 6 bulan',
    ],
  },
  {
    id: 'premium_yearly',
    name: 'Premium - Yearly',
    nameMs: 'Premium - Tahunan',
    tier: 'premium',
    price: 4500, // RM45.00
    currency: 'MYR',
    interval: 'yearly',
    features: [
      'All premium features',
      'Best value - Save 35%',
      '12 months access',
    ],
    featuresMs: [
      'Semua ciri premium',
      'Nilai terbaik - Jimat 35%',
      'Akses 12 bulan',
    ],
  },
];

// One-time assessment purchases
export const ASSESSMENT_PRICES: Record<string, number> = {
  depression: 900,    // RM9.00
  anxiety: 900,
  ocd: 1200,         // RM12.00
  ptsd: 1200,
  insomnia: 900,
  psychosis: 1500,   // RM15.00
  suicidal: 0,       // Always free - safety first
  sexual_addiction: 1200,
  marital_distress: 1200,
};

// Format price for display
export function formatPrice(cents: number, currency: string = 'MYR'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Check if simulation mode is enabled
export function isSimulationMode(): boolean {
  // Simulation mode when no real payment keys are configured
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  const hasBillplz = !!process.env.BILLPLZ_API_KEY;

  return !hasStripe && !hasBillplz;
}
