'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { PRICING_PLANS, formatPrice, isSimulationMode } from '@/lib/payments';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const simulationMode = isSimulationMode();

  const filteredPlans = PRICING_PLANS.filter((plan) => {
    if (plan.id === 'free') return true;
    if (billingInterval === 'yearly') {
      return plan.interval === 'yearly' || plan.id === 'free';
    }
    return plan.interval === 'monthly' || plan.id === 'free';
  });

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      router.push('/register');
      return;
    }

    setSelectedPlan(planId);
    setIsLoading(true);

    // Redirect to checkout page with selected plan
    router.push(`/checkout?plan=${planId}`);
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'free':
        return <Star className="w-6 h-6" />;
      case 'basic':
        return <Zap className="w-6 h-6" />;
      case 'premium':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'from-neutral-500 to-neutral-600';
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'premium':
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-neutral-500 to-neutral-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Start your mental wellness journey today. All plans include access to our
              AI-powered support system.
            </p>

            {simulationMode && (
              <div className="mt-4 inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
                Simulation Mode: Payments are simulated - full access granted instantly
              </div>
            )}
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="glass-card p-1 rounded-full inline-flex">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingInterval === 'monthly'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingInterval === 'yearly'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Save 32%
                </span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <GlassCard
                  variant={plan.popular ? 'elevated' : 'default'}
                  className={`relative h-full ${
                    plan.popular ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(
                          plan.tier
                        )} flex items-center justify-center text-white`}
                      >
                        {getPlanIcon(plan.tier)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-neutral-500">{plan.nameMs}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                          {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-neutral-500">
                            /{plan.interval === 'yearly' ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {plan.interval === 'yearly' && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {formatPrice(Math.round(plan.price / 12))}/month billed yearly
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <GlassButton
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isLoading}
                      rightIcon={
                        isLoading && selectedPlan === plan.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )
                      }
                    >
                      {plan.price === 0
                        ? 'Get Started'
                        : isLoading && selectedPlan === plan.id
                        ? 'Processing...'
                        : 'Subscribe Now'}
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <GlassCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Questions About Our Plans?
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                  All subscriptions include access to our secure, confidential platform. Your
                  mental health data is encrypted and never shared. Cancel anytime.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Secure & confidential
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Cancel anytime
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Malaysian support
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
