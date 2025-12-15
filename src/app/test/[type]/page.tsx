'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Lock,
  Info,
  CloudRain,
  HeartPulse,
  RefreshCw,
  ShieldAlert,
  Moon,
  Brain,
  type LucideIcon,
} from 'lucide-react';

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  'cloud-rain': CloudRain,
  'heart-pulse': HeartPulse,
  'refresh-cw': RefreshCw,
  'shield-alert': ShieldAlert,
  'moon': Moon,
  'brain': Brain,
};
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, ProgressBar } from '@/components/ui';
import { EmergencyModal } from '@/components/emergency/emergency-modal';
import { useAssessmentStore } from '@/stores/assessment-store';
import {
  ASSESSMENT_INSTRUMENTS,
  getInstrument,
  calculateAssessmentScore,
  ASSESSMENT_TYPE_INFO,
} from '@/lib/assessment/instruments';
import { createClient } from '@/lib/supabase/client';
import type { AssessmentType } from '@/types/assessment';
import type { User } from '@supabase/supabase-js';

export default function DetailedAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as AssessmentType;

  const {
    hasSuicidalIdeation,
    isEmergency,
  } = useAssessmentStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const instrument = getInstrument(type);
  const supabase = createClient();

  // Get user from Supabase Auth
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoadingUser(false);
    }
    getUser();
  }, []);

  // Redirect if invalid type
  useEffect(() => {
    if (!instrument) {
      router.push('/results/preliminary');
    }
  }, [instrument, router]);

  // Check for emergency state
  useEffect(() => {
    if (isEmergency) {
      setShowEmergencyModal(true);
    }
  }, [isEmergency]);

  // Check if user needs to pay for premium assessments
  useEffect(() => {
    if (!isLoadingUser && instrument?.isPremium && !user) {
      setShowPaymentGate(true);
    }
  }, [instrument, user, isLoadingUser]);

  if (!instrument) {
    return null;
  }

  const questions = instrument.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQuestion.id];
  const typeInfo = ASSESSMENT_TYPE_INFO[type];

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Check for suicidal ideation question (PHQ-9 Q9)
    if (currentQuestion.id === 'phq9_9' && value >= 1) {
      setShowEmergencyModal(true);
    }
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
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    // Calculate score
    const result = calculateAssessmentScore(type, answers);

    // Save to database if user is logged in
    if (user) {
      try {
        console.log('Saving assessment for user:', user.id);
        const response = await fetch('/api/v1/assessment/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            score: result.score,
            maxScore: instrument.scoring.maxScore,
            severity: result.severity,
            answers,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Assessment saved successfully:', data.assessmentId);
          // Navigate to results with assessment ID for retrieval
          router.push(`/test/${type}/results?id=${data.assessmentId}&score=${result.score}&severity=${result.severity}`);
          return;
        } else {
          const errorData = await response.json();
          console.error('Error saving assessment:', errorData);
        }
      } catch (error) {
        console.error('Error saving assessment:', error);
        // Continue to show results even if save fails
      }
    } else {
      console.log('No user logged in, skipping assessment save');
    }

    // Navigate to results (for non-logged in users or if save fails)
    router.push(`/test/${type}/results?score=${result.score}&severity=${result.severity}`);
  };

  const canProceed = currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Payment gate for premium assessments
  if (showPaymentGate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="mx-auto max-w-2xl px-4">
            <GlassCard variant="elevated" className="text-center py-12">
              <Lock className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Premium Assessment
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                The {instrument.name} is a premium assessment. Register or log in to access
                detailed assessments and personalized insights.
              </p>
              <div className="flex gap-4 justify-center">
                <GlassButton variant="secondary" onClick={() => router.back()}>
                  Go Back
                </GlassButton>
                <GlassButton variant="primary" onClick={() => router.push('/login')}>
                  Login / Register
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Assessment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            {(() => {
              const IconComponent = ICON_MAP[typeInfo.icon] || Brain;
              return <IconComponent className="w-12 h-12 mx-auto mb-2 text-primary-500" />;
            })()}
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {instrument.name}
            </h1>
            <p className="text-sm text-neutral-500">{instrument.nameMs}</p>
          </motion.div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} showPercentage={false} />
          </div>

          {/* Timeframe instruction */}
          {currentQuestionIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-primary-800 dark:text-primary-200">
                    {instrument.timeframe}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-300 mt-1">
                    {instrument.timeframeMs}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
                <div className="space-y-6">
                  {/* Question text */}
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      {currentQuestion.text}
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      {currentQuestion.textMs}
                    </p>
                  </div>

                  {/* Scale options */}
                  <div className="grid gap-2">
                    {instrument.scaleOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => handleAnswer(option.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                          currentAnswer === option.value
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30 text-neutral-700 dark:text-neutral-300 hover:border-primary-400'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                              currentAnswer === option.value
                                ? 'bg-white/20 text-white'
                                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                            }`}
                          >
                            {option.value}
                          </div>
                          <div>
                            <span className="font-medium">{option.label}</span>
                            {option.labelMs !== option.label && (
                              <span className="text-sm opacity-70 ml-2">
                                ({option.labelMs})
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Warning for suicidal assessment */}
          {type === 'suicidal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    If you are having thoughts of harming yourself, please reach out
                    immediately. Call Talian Kasih at 15999 or Befrienders at 03-7956 8145.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <GlassButton
              variant="secondary"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
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

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        canClose={!isEmergency}
      />
    </div>
  );
}
