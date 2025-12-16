'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  ArrowRight,
  Brain,
  AlertTriangle,
  CheckCircle,
  Shield,
  Download,
  Sparkles,
  BookOpen,
  Phone,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, RiskBadge, SeverityBadge } from '@/components/ui';
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

export default function FullResultsPage() {
  const router = useRouter();
  const {
    detectedConditions,
    riskLevel,
    socialFunctionScore,
    socialFunctionAnswers,
    initialScreeningAnswers,
    hasSuicidalIdeation,
    hasPsychosisIndicators,
  } = useAssessmentStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const saveAttempted = useRef(false);

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

  // Save screening results to database on mount
  useEffect(() => {
    async function saveScreening() {
      if (saveAttempted.current || !initialScreeningAnswers || Object.keys(initialScreeningAnswers).length === 0) {
        return;
      }
      saveAttempted.current = true;

      try {
        const response = await fetch('/api/v1/screening/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initialScreeningAnswers,
            detectedConditions,
            riskLevel: riskLevel || 'low',
            hasSuicidalIdeation,
            hasPsychosisIndicators,
            socialFunctionAnswers,
            socialFunctionScore: socialFunctionScore || 0,
            functionalLevel,
          }),
        });

        if (response.ok) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error saving screening:', error);
      }
    }

    saveScreening();
  }, [
    initialScreeningAnswers,
    detectedConditions,
    riskLevel,
    hasSuicidalIdeation,
    hasPsychosisIndicators,
    socialFunctionAnswers,
    socialFunctionScore,
    functionalLevel,
  ]);

  const handleSendEmail = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/email/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          detectedConditions,
          riskLevel: overallRisk,
          functionalLevel,
          socialFunctionScore,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTakeTest = (type: string) => {
    router.push(`/test/${type}`);
  };

  const handleViewInterventions = () => {
    router.push('/interventions');
  };

  const handleRequestReferral = () => {
    router.push('/referrals/request');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
              Your Complete Mental Health Assessment
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Thank you for completing the assessment. Here are your detailed results.
            </p>
          </div>

          {/* High-risk warning banner */}
          {(overallRisk === 'high' || overallRisk === 'imminent') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <GlassCard variant="elevated" className="border-2 border-red-500/50 bg-red-50/80 dark:bg-red-950/30">
                <div className="flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                      Urgent Support Recommended
                    </h3>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                      Based on your responses, we strongly recommend seeking professional support.
                      Please consider contacting a mental health professional or using the crisis resources below.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <GlassButton
                        variant="danger"
                        size="sm"
                        onClick={handleRequestReferral}
                        leftIcon={<Phone className="w-4 h-4" />}
                      >
                        Request Professional Referral
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push('/emergency')}
                      >
                        View Crisis Hotlines
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Overall Assessment Summary */}
          <GlassCard variant="elevated" className="mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Overall Assessment
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Based on your screening and social function evaluation
                </p>
              </div>
              <SeverityBadge severity={getSeverity()} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Risk Level
                </div>
                <RiskBadge level={overallRisk} />
              </div>
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Functional Level
                </div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-white capitalize">
                  {functionalLevel}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Social Function Score
                </div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {socialFunctionScore !== null ? `${socialFunctionScore}/32` : 'N/A'}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Detected Conditions */}
          {detectedConditions && detectedConditions.length > 0 && (
            <GlassCard variant="elevated" className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sage-500" />
                Detected Concerns
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Your responses suggest you may be experiencing symptoms related to the following conditions.
                We recommend taking detailed assessments for a more comprehensive evaluation.
              </p>

              <div className="space-y-3">
                {detectedConditions.map((condition) => (
                  <div
                    key={condition}
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">
                        {CONDITION_NAMES[condition]?.name || condition}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {CONDITION_NAMES[condition]?.nameMs}
                      </p>
                    </div>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleTakeTest(condition)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Take Detailed Test
                    </GlassButton>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Email Results */}
            <GlassCard variant="elevated">
              <Mail className="w-8 h-8 text-sage-500 mb-3" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Email Your Results
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Receive a detailed copy of your assessment results in your inbox
              </p>
              {emailSent ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Email sent successfully!</span>
                </div>
              ) : (
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={handleSendEmail}
                  loading={isSubmitting}
                  leftIcon={<Mail className="w-4 h-4" />}
                  className="w-full"
                >
                  Send to Email
                </GlassButton>
              )}
            </GlassCard>

            {/* View Interventions */}
            <GlassCard variant="elevated">
              <BookOpen className="w-8 h-8 text-sage-500 mb-3" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Self-Help Interventions
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Access interactive courses, videos, and exercises tailored to your needs
              </p>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleViewInterventions}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                Browse Interventions
              </GlassButton>
            </GlassCard>
          </div>

          {/* Disclaimer */}
          <GlassCard variant="subtle" className="mb-6">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p className="font-medium text-neutral-900 dark:text-white mb-2">
                  Important Disclaimer
                </p>
                <p className="whitespace-pre-line">{SCREENING_DISCLAIMER.en}</p>
              </div>
            </div>
          </GlassCard>

          {/* Next Steps */}
          <div className="text-center">
            <GlassButton
              variant="primary"
              onClick={() => router.push('/interventions')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Explore Interventions
            </GlassButton>
          </div>
        </div>
      </main>

      <Footer showEmergencyBanner={overallRisk === 'high' || overallRisk === 'imminent'} />
    </div>
  );
}
