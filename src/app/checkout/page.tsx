'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Building2,
  Check,
  Loader2,
  Shield,
  Lock,
  ArrowLeft,
  Crown,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { PRICING_PLANS, formatPrice } from '@/lib/payments';

// Malaysian banks for FPX
const FPX_BANKS = [
  { id: 'maybank', name: 'Maybank2u', logo: '🏦' },
  { id: 'cimb', name: 'CIMB Clicks', logo: '🏦' },
  { id: 'publicbank', name: 'PBe Bank', logo: '🏦' },
  { id: 'rhb', name: 'RHB Now', logo: '🏦' },
  { id: 'hongLeong', name: 'Hong Leong Connect', logo: '🏦' },
  { id: 'ambank', name: 'AmOnline', logo: '🏦' },
  { id: 'bankislam', name: 'Bank Islam', logo: '🏦' },
  { id: 'bsn', name: 'myBSN', logo: '🏦' },
];

type PaymentMethod = 'card' | 'fpx';
type CheckoutStep = 'select-method' | 'card-details' | 'fpx-bank' | 'processing' | 'success';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'premium_monthly';

  const [step, setStep] = useState<CheckoutStep>('select-method');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];

  const handleSelectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'card') {
      setStep('card-details');
    } else {
      setStep('fpx-bank');
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processPayment();
  };

  const handleFpxSubmit = async () => {
    if (!selectedBank) return;
    await processPayment();
  };

  const processPayment = async () => {
    setStep('processing');
    setIsProcessing(true);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const response = await fetch('/api/v1/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethod,
          ...(paymentMethod === 'fpx' && { bankId: selectedBank }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        // Redirect after showing success
        setTimeout(() => {
          router.push('/my-assessments');
        }, 2000);
      } else {
        // Handle error - for demo, still show success
        setStep('success');
        setTimeout(() => {
          router.push('/my-assessments');
        }, 2000);
      }
    } catch (error) {
      // For demo purposes, show success anyway
      setStep('success');
      setTimeout(() => {
        router.push('/my-assessments');
      }, 2000);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-xl px-4">
          {/* Back Button */}
          {step !== 'processing' && step !== 'success' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                if (step === 'select-method') {
                  router.push('/pricing');
                } else {
                  setStep('select-method');
                  setPaymentMethod(null);
                }
              }}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 'select-method' ? 'Back to Pricing' : 'Change Payment Method'}
            </motion.button>
          )}

          {/* Order Summary */}
          {step !== 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <GlassCard className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-500 rounded-xl">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-neutral-500">{plan.nameMs}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(plan.price)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      /{plan.interval === 'yearly' ? 'year' : 'month'}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Select Payment Method */}
            {step === 'select-method' && (
              <motion.div
                key="select-method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                    Select Payment Method
                  </h2>

                  <div className="space-y-3">
                    {/* Card Payment */}
                    <button
                      onClick={() => handleSelectMethod('card')}
                      className="w-full p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all flex items-center gap-4 text-left group"
                    >
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          Credit / Debit Card
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Visa, Mastercard, American Express
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">
                          VISA
                        </div>
                        <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] font-bold flex items-center justify-center">
                          MC
                        </div>
                      </div>
                    </button>

                    {/* FPX Payment */}
                    <button
                      onClick={() => handleSelectMethod('fpx')}
                      className="w-full p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all flex items-center gap-4 text-left group"
                    >
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          FPX Online Banking
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Direct bank transfer (Malaysia)
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400 text-xs font-semibold">
                        FPX
                      </div>
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Shield className="w-4 h-4" />
                      <span>Secure payment powered by simulation mode</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Step 2a: Card Details */}
            {step === 'card-details' && (
              <motion.div
                key="card-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Card Details
                    </h2>
                  </div>

                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: formatCardNumber(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Name on Card */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: formatExpiry(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={cardDetails.cvc}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvc: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <GlassButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Pay {formatPrice(plan.price)}
                      </GlassButton>
                    </div>
                  </form>

                  <p className="mt-4 text-xs text-center text-neutral-500">
                    Demo mode: Any card details will work
                  </p>
                </GlassCard>
              </motion.div>
            )}

            {/* Step 2b: FPX Bank Selection */}
            {step === 'fpx-bank' && (
              <motion.div
                key="fpx-bank"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Select Your Bank
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {FPX_BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          selectedBank === bank.id
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{bank.logo}</span>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {bank.name}
                          </span>
                        </div>
                        {selectedBank === bank.id && (
                          <Check className="w-4 h-4 text-green-500 absolute top-2 right-2" />
                        )}
                      </button>
                    ))}
                  </div>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={handleFpxSubmit}
                    disabled={!selectedBank}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Pay with FPX - {formatPrice(plan.price)}
                  </GlassButton>

                  <p className="mt-4 text-xs text-center text-neutral-500">
                    Demo mode: Select any bank to simulate payment
                  </p>
                </GlassCard>
              </motion.div>
            )}

            {/* Step 3: Processing */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <GlassCard>
                  <div className="py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 mx-auto mb-6"
                    >
                      <Loader2 className="w-16 h-16 text-primary-500" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      Processing Payment...
                    </h2>
                    <p className="text-neutral-500">
                      {paymentMethod === 'card'
                        ? 'Verifying card details...'
                        : 'Connecting to your bank...'}
                    </p>

                    {paymentMethod === 'fpx' && selectedBank && (
                      <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg inline-block">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Bank: {FPX_BANKS.find((b) => b.id === selectedBank)?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <GlassCard className="border-green-200 dark:border-green-800">
                  <div className="py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      Payment Successful!
                    </h2>
                    <p className="text-neutral-500 mb-4">
                      Welcome to {plan.name}
                    </p>
                    <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
                      {formatPrice(plan.price)} paid via{' '}
                      {paymentMethod === 'card' ? 'Card' : 'FPX'}
                    </div>
                    <p className="mt-6 text-sm text-neutral-500">
                      Redirecting to your dashboard...
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Loading fallback for Suspense
function CheckoutLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-xl px-4">
          <div className="animate-pulse">
            <div className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-6" />
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
