'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronRight, ChevronLeft, AlertTriangle, FastForward } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, ProgressBar } from '@/components/ui';
import { YesNoToggle } from '@/components/assessment/yes-no-toggle';
import { EmergencyModal } from '@/components/emergency/emergency-modal';
import { useAssessmentStore } from '@/stores/assessment-store';
import { INITIAL_SCREENING_QUESTIONS, SOCIAL_FUNCTION_QUESTIONS } from '@/lib/assessment/questions';
import { evaluateSingleAnswer, evaluateTriage, detectConditions } from '@/lib/assessment/triage';

const isDev = process.env.NODE_ENV === 'development';

export default function ScreeningPage() {
  const router = useRouter();
  const t = useTranslations('screening');
  const {
    initialScreeningAnswers,
    setInitialScreeningAnswer,
    setDetectedConditions,
    setRiskLevel,
    setSuicidalIdeation,
    setPsychosisIndicators,
    setStep,
    isEmergency,
    triggerEmergency,
    setSocialFunctionAnswer,
    calculateSocialFunctionScore,
  } = useAssessmentStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [canCloseEmergency, setCanCloseEmergency] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = INITIAL_SCREENING_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const currentAnswer = initialScreeningAnswers[currentQuestion.id];

  // Check for emergency state on mount
  useEffect(() => {
    if (isEmergency) {
      // Defer state updates to avoid cascading renders
      queueMicrotask(() => {
        setShowEmergencyModal(true);
        setCanCloseEmergency(true);
      });
    }
  }, [isEmergency]);

  const handleAnswer = (answer: boolean) => {
    setInitialScreeningAnswer(currentQuestion.id, answer);

    // Real-time triage check
    const triageResult = evaluateSingleAnswer(currentQuestion.id, answer);

    if (triageResult) {
      if (triageResult.riskLevel === 'imminent') {
        // CRITICAL: Suicidal ideation detected
        setSuicidalIdeation(true);
        triggerEmergency();
        setShowEmergencyModal(true);
        setCanCloseEmergency(true);
        return; // Don't proceed
      }

      if (triageResult.riskLevel === 'high') {
        // Show warning but allow to continue
        setShowWarning(true);
        if (currentQuestion.category === 'psychosis') {
          setPsychosisIndicators(true);
        }
      }
    }
  };

  const handleNext = () => {
    setShowWarning(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setShowWarning(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    // Final triage evaluation
    const triageResult = evaluateTriage(initialScreeningAnswers);
    setRiskLevel(triageResult.riskLevel);

    // Detect conditions
    const conditions = detectConditions(initialScreeningAnswers);
    setDetectedConditions(conditions);

    // Check for emergency one more time
    if (triageResult.shouldShowEmergency) {
      setShowEmergencyModal(true);
      setCanCloseEmergency(true);
      if (triageResult.riskLevel === 'imminent') {
        setIsSubmitting(false);
        return;
      }
    }

    setStep('social');
    router.push('/social');
  };

  const canProceed = currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // DEV: Skip all screening with low risk prefilled answers
  const handleDevSkip = () => {
    // Fill all initial screening answers with "No" (low risk)
    INITIAL_SCREENING_QUESTIONS.forEach((q) => {
      setInitialScreeningAnswer(q.id, false);
    });

    // Fill all social function answers with "4" (high functioning)
    SOCIAL_FUNCTION_QUESTIONS.forEach((q) => {
      setSocialFunctionAnswer(q.id, 4);
    });

    // Set low risk results
    setRiskLevel('low');
    setDetectedConditions([]);
    setSuicidalIdeation(false);
    setPsychosisIndicators(false);
    calculateSocialFunctionScore();

    setStep('registration');
    router.push('/results/preliminary');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>{t('initialScreening')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} showPercentage={false} />
          </div>

          {/* Question counter */}
          <div className="text-center mb-6">
            <span className="text-sm text-neutral-500">
              {t('questionOf', { current: currentQuestionIndex + 1, total: questions.length })}
            </span>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard variant="elevated" className="mb-6">
                <div className="space-y-8">
                  {/* Question text */}
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                      {currentQuestion.text}
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      {currentQuestion.textMs}
                    </p>
                  </div>

                  {/* Answer options */}
                  <YesNoToggle
                    value={currentAnswer ?? null}
                    onChange={handleAnswer}
                  />
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Warning banner */}
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                      {t('warningTitle')}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                      {t('warningSubtitle')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentQuestionIndex > 0 && (
              <GlassButton
                variant="secondary"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-5 h-5" />}
              >
                {t('back')}
              </GlassButton>
            )}
            <GlassButton
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              loading={isSubmitting}
              rightIcon={<ChevronRight className="w-5 h-5" />}
              className="flex-1"
            >
              {isLastQuestion ? t('continueToSocial') : t('next')}
            </GlassButton>
          </div>

          {/* DEV: Skip button */}
          {isDev && (
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={handleDevSkip}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-colors"
              >
                <FastForward className="w-3 h-3" />
                DEV: Skip to Results (Low Risk)
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer showEmergencyBanner />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        canClose={canCloseEmergency}
      />
    </div>
  );
}
