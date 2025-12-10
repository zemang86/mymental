'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  ArrowRight,
  Brain,
  AlertTriangle,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput, GlassModal, RiskBadge, SeverityBadge } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';
import { calculateFunctionalLevel, getOverallRiskLevel } from '@/lib/assessment/triage';
import { SCREENING_DISCLAIMER } from '@/lib/constants/hotlines';

// Condition display names
const CONDITION_NAMES: Record<string, { name: string; nameMs: string }> = {
  depression: { name: 'Depression', nameMs: 'Kemurungan' },
  anxiety: { name: 'Anxiety', nameMs: 'Kebimbangan' },
  ocd: { name: 'Obsessive Compulsive Disorder (OCD)', nameMs: 'Gangguan Obsesif Kompulsif (OCD)' },
  ptsd: { name: 'PTSD', nameMs: 'PTSD' },
  insomnia: { name: 'Insomnia', nameMs: 'Insomnia' },
  suicidal: { name: 'Suicidal Ideation', nameMs: 'Pemikiran Bunuh Diri' },
  psychosis: { name: 'Psychosis', nameMs: 'Psikosis' },
  sexual_addiction: { name: 'Sexual Addiction', nameMs: 'Ketagihan Seksual' },
  marital_distress: { name: 'Marital Distress', nameMs: 'Tekanan Perkahwinan' },
};

export default function PreliminaryResultsPage() {
  const router = useRouter();
  const {
    detectedConditions,
    riskLevel,
    socialFunctionScore,
    hasSuicidalIdeation,
    setUser,
  } = useAssessmentStore();

  const [showRegistrationModal, setShowRegistrationModal] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculate functional level
  const functionalLevel = socialFunctionScore !== null
    ? calculateFunctionalLevel(socialFunctionScore)
    : 'moderate';

  // Get overall risk
  const overallRisk = riskLevel
    ? getOverallRiskLevel(riskLevel, functionalLevel)
    : 'low';

  // Determine severity for display
  const getSeverity = (): 'mild' | 'moderate' | 'severe' | 'very_severe' => {
    if (overallRisk === 'imminent') return 'very_severe';
    if (overallRisk === 'high') return 'severe';
    if (overallRisk === 'moderate') return 'moderate';
    return 'mild';
  };

  const handleRegister = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate registration (in production, this would call Supabase auth)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set user in store (mock)
    setUser('mock-user-id', email);

    setShowRegistrationModal(false);
    setIsSubmitting(false);
  };

  const handleSkipRegistration = () => {
    setShowRegistrationModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Preliminary Insights Into Your Mental Well-Being
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Based on your screening responses
            </p>
          </motion.div>

          {/* Overall Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard
              variant="elevated"
              className={`mb-8 ${
                overallRisk === 'imminent' || overallRisk === 'high'
                  ? 'border-red-300 dark:border-red-800'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Image placeholder - in production use actual image */}
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    You&apos;ve shown indications of
                  </p>
                  <SeverityBadge severity={getSeverity()} className="mb-4" />

                  {(overallRisk === 'high' || overallRisk === 'imminent') ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      You are advised to stay calm and are encouraged to reach out to
                      family, friends, or trusted people to talk. If you feel the need
                      for professional help, you can continue using the MyMental
                      platform for guidance in managing your situation.
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Your responses suggest some areas that may benefit from attention.
                      Consider exploring the detailed assessments below to better
                      understand your mental well-being.
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Warning for high risk */}
          {(overallRisk === 'high' || overallRisk === 'imminent' || hasSuicidalIdeation) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Important: Please seek professional support
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Based on your responses, we strongly recommend speaking with a mental
                    health professional. Call Talian Kasih at 15999 or Befrienders at
                    03-7956 8145 for immediate support.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Detected Conditions */}
          {detectedConditions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Areas that may need attention:
              </h2>
              <div className="grid gap-3">
                {detectedConditions.map((condition, index) => (
                  <motion.div
                    key={condition}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <GlassCard className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <div>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {CONDITION_NAMES[condition]?.name || condition}
                          </span>
                          {CONDITION_NAMES[condition]?.nameMs && (
                            <span className="text-sm text-neutral-500 ml-2">
                              ({CONDITION_NAMES[condition].nameMs})
                            </span>
                          )}
                        </div>
                      </div>
                      <GlassButton variant="outline" size="sm">
                        Take a Test
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </GlassButton>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No conditions detected */}
          {detectedConditions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <GlassCard className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  No immediate concerns detected
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  Based on your initial screening, no significant concerns were identified.
                  You can still take detailed assessments for a more comprehensive understanding.
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard variant="elevated" className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Want a deeper insight into your mental health?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Take additional tests to better understand the depth of your mental state.
              </p>
              <GlassButton
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                See My Assessment
              </GlassButton>
            </GlassCard>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-500">
                {SCREENING_DISCLAIMER.en}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer showEmergencyBanner />

      {/* Registration Modal */}
      <GlassModal
        isOpen={showRegistrationModal}
        onClose={handleSkipRegistration}
        title="You're One Step Away from Your Results!"
        showCloseButton
        closeOnOverlayClick
      >
        <div className="space-y-6">
          <p className="text-neutral-600 dark:text-neutral-400">
            Just enter your email to receive an activation code. Once registered,
            you&apos;ll be able to view your assessment results right away.
          </p>

          <GlassInput
            type="email"
            label="Email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leftIcon={<Mail className="w-5 h-5" />}
          />

          <GlassButton
            variant="primary"
            className="w-full"
            onClick={handleRegister}
            loading={isSubmitting}
          >
            Get My Result
          </GlassButton>

          <p className="text-xs text-neutral-500 text-center">
            By clicking &quot;Get my result&quot; you agree to our{' '}
            <a href="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          <button
            onClick={handleSkipRegistration}
            className="w-full text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Skip for now
          </button>
        </div>
      </GlassModal>
    </div>
  );
}
