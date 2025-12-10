'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Clock, CheckSquare } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput, ProgressBar } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_OPTIONS,
  RELIGION_OPTIONS,
} from '@/lib/assessment/questions';
import { nanoid } from 'nanoid';

export default function StartPage() {
  const router = useRouter();
  const {
    sessionId,
    setSessionId,
    demographics,
    setDemographics,
    hasAcceptedTerms,
    hasAcceptedPrivacy,
    setTermsAccepted,
    setPrivacyAccepted,
    setStep,
  } = useAssessmentStore();

  const [currentField, setCurrentField] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(nanoid());
    }
  }, [sessionId, setSessionId]);

  const fields = [
    { key: 'age', label: 'What is your age?', labelMs: 'Berapakah umur anda?', type: 'number' },
    { key: 'gender', label: 'What is your gender?', labelMs: 'Apakah jantina anda?', type: 'select', options: GENDER_OPTIONS },
    { key: 'maritalStatus', label: 'What is your marital status?', labelMs: 'Apakah status perkahwinan anda?', type: 'select', options: MARITAL_STATUS_OPTIONS },
    { key: 'nationality', label: 'What is your nationality?', labelMs: 'Apakah kewarganegaraan anda?', type: 'text', placeholder: 'e.g., Malaysian' },
    { key: 'religion', label: 'What is your religion?', labelMs: 'Apakah agama anda?', type: 'select', options: RELIGION_OPTIONS },
    { key: 'education', label: 'What is your highest education level?', labelMs: 'Apakah tahap pendidikan tertinggi anda?', type: 'select', options: EDUCATION_OPTIONS },
    { key: 'occupation', label: 'What is your occupation?', labelMs: 'Apakah pekerjaan anda?', type: 'text', placeholder: 'e.g., Teacher, Engineer' },
    { key: 'hasMentalIllnessDiagnosis', label: 'Have you been diagnosed with any mental illness?', labelMs: 'Adakah anda pernah didiagnosis dengan sebarang penyakit mental?', type: 'boolean' },
  ];

  const progress = ((currentField + 1) / (fields.length + 1)) * 100; // +1 for consent step

  const currentFieldData = fields[currentField];
  const isLastField = currentField === fields.length - 1;
  const isConsentStep = currentField === fields.length;

  const handleNext = () => {
    if (isLastField) {
      setCurrentField(currentField + 1); // Move to consent step
    } else if (isConsentStep) {
      handleSubmit();
    } else {
      setCurrentField(currentField + 1);
    }
  };

  const handleBack = () => {
    if (currentField > 0) {
      setCurrentField(currentField - 1);
    }
  };

  const handleSubmit = async () => {
    if (!hasAcceptedTerms || !hasAcceptedPrivacy) return;

    setIsSubmitting(true);
    setStep('screening');

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    router.push('/screening');
  };

  const canProceed = () => {
    if (isConsentStep) {
      return hasAcceptedTerms && hasAcceptedPrivacy;
    }

    const field = fields[currentField];
    const value = demographics[field.key as keyof typeof demographics];

    if (field.key === 'age') {
      return typeof value === 'number' && value >= 13 && value <= 120;
    }

    return value !== undefined && value !== null && value !== '';
  };

  const renderField = () => {
    if (isConsentStep) {
      return (
        <motion.div
          key="consent"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Terms & Conditions
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Please review and accept our terms to continue
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-neutral-700/30 cursor-pointer hover:bg-white/70 dark:hover:bg-neutral-800/70 transition-colors">
              <input
                type="checkbox"
                checked={hasAcceptedTerms}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-neutral-900 dark:text-white">
                  I accept the Terms of Service
                </span>
                <p className="text-sm text-neutral-500 mt-1">
                  I have read and agree to the{' '}
                  <a href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-neutral-700/30 cursor-pointer hover:bg-white/70 dark:hover:bg-neutral-800/70 transition-colors">
              <input
                type="checkbox"
                checked={hasAcceptedPrivacy}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-neutral-900 dark:text-white">
                  I accept the Privacy Policy
                </span>
                <p className="text-sm text-neutral-500 mt-1">
                  I have read and agree to the{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </label>
          </div>

          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              <strong>Disclaimer:</strong> This screening is not a diagnosis. Only a
              licensed professional can provide a complete assessment. This is simply
              an initial step to help you understand your mental well-being better.
            </p>
          </div>
        </motion.div>
      );
    }

    const field = currentFieldData;

    return (
      <motion.div
        key={field.key}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {field.label}
          </h2>
          <p className="text-neutral-500 text-sm">{field.labelMs}</p>
        </div>

        {field.type === 'number' && (
          <GlassInput
            type="number"
            value={demographics[field.key as keyof typeof demographics] as number || ''}
            onChange={(e) =>
              setDemographics({ [field.key]: parseInt(e.target.value) || undefined })
            }
            placeholder="Enter your age"
            min={13}
            max={120}
            className="text-center text-2xl"
          />
        )}

        {field.type === 'text' && (
          <GlassInput
            type="text"
            value={(demographics[field.key as keyof typeof demographics] as string) || ''}
            onChange={(e) => setDemographics({ [field.key]: e.target.value })}
            placeholder={field.placeholder}
          />
        )}

        {field.type === 'select' && field.options && (
          <div className="grid grid-cols-2 gap-3">
            {field.options.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setDemographics({ [field.key]: option.value })}
                className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                  demographics[field.key as keyof typeof demographics] === option.value
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30 text-neutral-700 dark:text-neutral-300 hover:border-primary-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">{option.label}</span>
                {option.labelMs !== option.label && (
                  <span className="block text-xs opacity-70 mt-1">{option.labelMs}</span>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {field.type === 'boolean' && (
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => setDemographics({ [field.key]: true })}
              className={`flex-1 p-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                demographics[field.key as keyof typeof demographics] === true
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yes
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setDemographics({ [field.key]: false })}
              className={`flex-1 p-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                demographics[field.key as keyof typeof demographics] === false
                  ? 'bg-neutral-500 border-neutral-500 text-white'
                  : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              No
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>Demographic Profile</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} showPercentage={false} />
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-neutral-800/50 text-sm text-neutral-600 dark:text-neutral-400">
              <Shield className="w-4 h-4 text-primary-500" />
              Private & Secure
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-neutral-800/50 text-sm text-neutral-600 dark:text-neutral-400">
              <Clock className="w-4 h-4 text-primary-500" />
              ~2 minutes
            </div>
          </div>

          {/* Form Card */}
          <GlassCard variant="elevated" className="mb-8">
            {renderField()}
          </GlassCard>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentField > 0 && (
              <GlassButton variant="secondary" onClick={handleBack} className="flex-1">
                Back
              </GlassButton>
            )}
            <GlassButton
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              loading={isSubmitting}
              rightIcon={<ChevronRight className="w-5 h-5" />}
              className="flex-1"
            >
              {isConsentStep ? 'Start Screening' : 'Next'}
            </GlassButton>
          </div>
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
