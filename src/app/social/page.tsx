'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, ProgressBar } from '@/components/ui';
import { LikertScale } from '@/components/assessment/likert-scale';
import { useAssessmentStore } from '@/stores/assessment-store';
import { SOCIAL_FUNCTION_QUESTIONS } from '@/lib/assessment/questions';

export default function SocialFunctionPage() {
  const router = useRouter();
  const {
    socialFunctionAnswers,
    setSocialFunctionAnswer,
    calculateSocialFunctionScore,
    setStep,
  } = useAssessmentStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = SOCIAL_FUNCTION_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const currentAnswer = socialFunctionAnswers[currentQuestion.id];

  const handleAnswer = (value: number) => {
    setSocialFunctionAnswer(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.push('/screening');
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    // Calculate final score
    calculateSocialFunctionScore();

    setStep('registration');

    // Navigate to results (which will show registration gate)
    router.push('/results/preliminary');
  };

  const canProceed = currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>Social Function Screening</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} showPercentage={false} />
          </div>

          {/* Question counter */}
          <div className="text-center mb-6">
            <span className="text-sm text-neutral-500">
              Question {currentQuestionIndex + 1} of {questions.length}
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
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      {currentQuestion.text}
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      {currentQuestion.textMs}
                    </p>
                  </div>

                  {/* Likert scale */}
                  <LikertScale
                    value={currentAnswer ?? null}
                    onChange={handleAnswer}
                    minLabel="Strongly Disagree"
                    maxLabel="Strongly Agree"
                  />
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4">
            <GlassButton
              variant="secondary"
              onClick={handleBack}
              leftIcon={<ChevronLeft className="w-5 h-5" />}
            >
              Back
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              loading={isSubmitting}
              rightIcon={<ChevronRight className="w-5 h-5" />}
              className="flex-1"
            >
              {isLastQuestion ? 'See Results' : 'Next'}
            </GlassButton>
          </div>
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
