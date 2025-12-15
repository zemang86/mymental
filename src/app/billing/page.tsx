'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Crown,
  Check,
  Calendar,
  Download,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, ConfirmModal } from '@/components/ui';
import { useSubscription } from '@/hooks/use-subscription';
import { PRICING_PLANS, formatPrice } from '@/lib/payments';

interface Payment {
  id: string;
  created_at: string;
  plan_id?: string;
  assessment_type?: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export default function BillingPage() {
  const router = useRouter();
  const {
    subscription,
    plan,
    hasAccess,
    isSimulated,
    isLoading,
  } = useSubscription();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/v1/payment');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handleCancelSubscription = async () => {
    setShowCancelConfirm(false);
    setIsCancelling(true);
    try {
      const response = await fetch('/api/v1/subscription', {
        method: 'DELETE',
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Billing & Subscription
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your subscription and view payment history
            </p>
          </motion.div>

          {/* Simulation Mode Banner */}
          {isSimulated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Simulation Mode Active
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Payments are simulated. You have full premium access for development.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard variant="elevated">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    Current Plan
                  </h2>
                  <p className="text-neutral-500 text-sm mt-1">
                    {subscription?.status === 'active'
                      ? 'Your subscription is active'
                      : 'You are on the free plan'}
                  </p>
                </div>
                {!hasAccess && (
                  <GlassButton
                    variant="primary"
                    onClick={() => router.push('/pricing')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Upgrade
                  </GlassButton>
                )}
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {plan?.name || 'Free'}
                    </h3>
                    <p className="text-neutral-500 text-sm">{plan?.nameMs}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {plan?.price ? formatPrice(plan.price) : 'Free'}
                    </p>
                    {plan?.interval && plan.interval !== 'one_time' && (
                      <p className="text-neutral-500 text-sm">
                        per {plan.interval === 'yearly' ? 'year' : 'month'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {plan?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription Details */}
              {subscription && hasAccess && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Billing period</span>
                    <span className="text-neutral-900 dark:text-white">
                      {subscription.currentPeriodStart &&
                        formatDate(subscription.currentPeriodStart)}{' '}
                      -{' '}
                      {subscription.currentPeriodEnd &&
                        formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Next billing date</span>
                    <span className="text-neutral-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {subscription.currentPeriodEnd &&
                        formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Cancel button */}
              {hasAccess && !isSimulated && (
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={isCancelling}
                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel subscription'}
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary-500" />
                Payment History
              </h2>

              {isLoadingPayments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
              ) : payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                          Status
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                        >
                          <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                            {formatDate(payment.created_at)}
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                            {payment.plan_id
                              ? PRICING_PLANS.find((p) => p.id === payment.plan_id)?.name ||
                                payment.plan_id
                              : payment.assessment_type || 'Payment'}
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                            {formatPrice(payment.amount)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === 'completed'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : payment.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-primary-600 hover:text-primary-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">No payment history yet</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Upgrade CTA for free users */}
          {!hasAccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <GlassCard
                variant="elevated"
                className="text-center bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20"
              >
                <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                  Get unlimited assessments, detailed reports, and priority AI support
                  with our premium plans.
                </p>
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/pricing')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  View Plans
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Cancel Subscription Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period."
        confirmText="Cancel Subscription"
        cancelText="Keep Subscription"
        variant="warning"
        isLoading={isCancelling}
      />
    </div>
  );
}
