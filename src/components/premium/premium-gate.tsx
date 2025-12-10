'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
import { useSubscription } from '@/hooks/use-subscription';

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  feature?: string;
  requireTier?: 'basic' | 'premium';
}

/**
 * Wraps content that requires premium access
 * Shows upgrade prompt if user doesn't have required tier
 */
export function PremiumGate({
  children,
  fallback,
  feature = 'this feature',
  requireTier = 'basic',
}: PremiumGateProps) {
  const router = useRouter();
  const { hasAccess, isPremium, isBasic, isLoading, isSimulated } = useSubscription();

  // Check if user meets tier requirement
  const meetsRequirement =
    requireTier === 'basic' ? hasAccess : isPremium;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // User has access - render children
  if (meetsRequirement) {
    return <>{children}</>;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="text-center max-w-md mx-auto">
        <div className="p-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>

          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Premium Feature
          </h3>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Upgrade to {requireTier === 'premium' ? 'Premium' : 'Basic'} to unlock{' '}
            {feature}.
          </p>

          <GlassButton
            variant="primary"
            onClick={() => router.push('/pricing')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade Now
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/**
 * Simple badge to show premium-only features
 */
export function PremiumBadge({ tier = 'premium' }: { tier?: 'basic' | 'premium' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        tier === 'premium'
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      }`}
    >
      <Crown className="w-3 h-3" />
      {tier === 'premium' ? 'Premium' : 'Basic'}
    </span>
  );
}

/**
 * Shows different content based on subscription status
 */
export function SubscriptionContent({
  free,
  basic,
  premium,
}: {
  free: React.ReactNode;
  basic?: React.ReactNode;
  premium?: React.ReactNode;
}) {
  const { isPremium, isBasic, isLoading } = useSubscription();

  if (isLoading) {
    return <>{free}</>;
  }

  if (isPremium && premium) {
    return <>{premium}</>;
  }

  if ((isBasic || isPremium) && basic) {
    return <>{basic}</>;
  }

  return <>{free}</>;
}
