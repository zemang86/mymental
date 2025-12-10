'use client';

import { useState, useEffect, useCallback } from 'react';
import { SubscriptionTier, PricingPlan, PRICING_PLANS } from '@/lib/payments';

interface SubscriptionData {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null;
  plan: PricingPlan | null;
  hasAccess: boolean;
  isPremium: boolean;
  isBasic: boolean;
  isFree: boolean;
  isSimulated: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/v1/subscription');

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in - set to free tier
          const freePlan = PRICING_PLANS.find((p) => p.id === 'free') || null;
          setSubscription(null);
          setPlan(freePlan);
          setHasAccess(false);
          setIsSimulated(false);
          return;
        }
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();

      setSubscription(data.subscription);
      setPlan(data.plan);
      setHasAccess(data.hasAccess);
      setIsSimulated(data.isSimulated || false);
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Default to free tier on error
      const freePlan = PRICING_PLANS.find((p) => p.id === 'free') || null;
      setSubscription(null);
      setPlan(freePlan);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const tier = subscription?.tier || plan?.tier || 'free';

  return {
    subscription,
    plan,
    hasAccess,
    isPremium: tier === 'premium',
    isBasic: tier === 'basic',
    isFree: tier === 'free',
    isSimulated,
    isLoading,
    error,
    refresh: fetchSubscription,
  };
}

// Simpler hook just for checking access
export function useHasAccess(): {
  hasAccess: boolean;
  isLoading: boolean;
} {
  const { hasAccess, isLoading } = useSubscription();
  return { hasAccess, isLoading };
}
