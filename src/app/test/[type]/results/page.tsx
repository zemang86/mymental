'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowRight,
  Download,
  Share2,
  Calendar,
  Brain,
  Heart,
  MessageCircle,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Shield,
  Lightbulb,
  Target,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, SeverityBadge } from '@/components/ui';
import {
  getInstrument,
  ASSESSMENT_TYPE_INFO,
} from '@/lib/assessment/instruments';
import { SCREENING_DISCLAIMER } from '@/lib/constants/hotlines';
import { createClient } from '@/lib/supabase/client';
import type { AssessmentType } from '@/types/assessment';
import type { AssessmentInsights } from '@/types/insights';

function ResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('results');

  // Helper to get localized content (shows English for 'en', Malay for 'ms')
  const isMalay = locale === 'ms';

  const type = params.type as AssessmentType;
  const assessmentId = searchParams.get('id');
  const score = parseInt(searchParams.get('score') || '0');
  const severity = searchParams.get('severity') || 'Unknown';

  const instrument = getInstrument(type);
  const typeInfo = ASSESSMENT_TYPE_INFO[type];

  // Insights state
  const [insights, setInsights] = useState<AssessmentInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  // Fetch insights from saved assessment
  useEffect(() => {
    async function fetchInsights() {
      if (!assessmentId) {
        setIsLoadingInsights(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: assessment, error } = await supabase
          .from('assessments')
          .select('score_breakdown')
          .eq('id', assessmentId)
          .single();

        if (error) {
          console.error('Error fetching assessment:', error);
        } else if (assessment?.score_breakdown?.aiInsights) {
          setInsights(assessment.score_breakdown.aiInsights);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setIsLoadingInsights(false);
      }
    }

    fetchInsights();
  }, [assessmentId]);

  if (!instrument) {
    return null;
  }

  // Get severity level for badge
  const getSeverityLevel = (): 'mild' | 'moderate' | 'severe' | 'very_severe' => {
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity.includes('severe')) return 'severe';
    if (lowerSeverity.includes('moderate')) return 'moderate';
    return 'mild';
  };

  const scorePercentage = (score / instrument.scoring.maxScore) * 100;

  // Get icon component based on finding type
  const getFindingIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'concern':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    }
  };

  // Get urgency icon
  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'soon':
        return <TrendingUp className="w-4 h-4 text-amber-500" />;
      default:
        return <Calendar className="w-4 h-4 text-green-500" />;
    }
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
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Your {typeInfo?.name || type} Assessment Results
            </h1>
            <p className="text-neutral-500">
              {instrument.name}
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard variant="elevated" className="mb-6">
              <div className="text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  Your score indicates
                </p>
                <SeverityBadge severity={getSeverityLevel()} className="mb-4" />

                {/* Score visualization */}
                <div className="max-w-xs mx-auto mb-4">
                  <div className="flex justify-between text-sm text-neutral-500 mb-1">
                    <span>0</span>
                    <span>{instrument.scoring.maxScore}</span>
                  </div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        scorePercentage > 70
                          ? 'bg-red-500'
                          : scorePercentage > 40
                          ? 'bg-orange-500'
                          : 'bg-primary-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
                    {score} / {instrument.scoring.maxScore}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Insights Section */}
          {isLoadingInsights ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <GlassCard className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/30">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-3" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Loading insights...
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ) : insights ? (
            <>
              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-6"
              >
                <GlassCard className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-500 rounded-lg flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                        {isMalay ? 'Ringkasan' : 'Summary'}
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300">
                        {isMalay ? insights.summaryMs : insights.summary}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Key Findings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary-500" />
                  {isMalay ? 'Penemuan Utama' : 'Key Findings'}
                </h2>
                <div className="space-y-3">
                  {insights.keyFindings.map((finding, index) => (
                    <GlassCard key={index} className="py-3">
                      <div className="flex items-start gap-3">
                        {getFindingIcon(finding.type)}
                        <div className="flex-1">
                          <p className="text-neutral-800 dark:text-neutral-200">
                            {isMalay ? finding.textMs : finding.text}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-6"
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  {isMalay ? 'Cadangan' : 'Recommendations'}
                </h2>
                <div className="space-y-3">
                  {insights.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{isMalay ? rec.textMs : rec.text}</p>
                        </div>
                        <span className="text-xs font-medium uppercase px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                          {rec.priority === 'high' ? (isMalay ? 'tinggi' : 'high') :
                           rec.priority === 'medium' ? (isMalay ? 'sederhana' : 'medium') :
                           (isMalay ? 'rendah' : 'low')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Coping Strategies */}
              {insights.copingStrategies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    {isMalay ? 'Strategi Menangani' : 'Coping Strategies'}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {insights.copingStrategies.map((strategy, index) => (
                      <GlassCard key={index}>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                          {isMalay ? strategy.titleMs : strategy.title}
                        </h3>
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {isMalay ? strategy.descriptionMs : strategy.description}
                        </p>
                      </GlassCard>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Risk Factors */}
              {insights.riskFactors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-6"
                >
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    {isMalay ? 'Faktor Risiko untuk Dipantau' : 'Risk Factors to Monitor'}
                  </h2>
                  <GlassCard className="border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10">
                    <ul className="space-y-3">
                      {insights.riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                            risk.level === 'high' ? 'text-red-500' :
                            risk.level === 'moderate' ? 'text-amber-500' : 'text-yellow-500'
                          }`} />
                          <div>
                            <p className="text-neutral-800 dark:text-neutral-200">
                              {isMalay ? risk.textMs : risk.text}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              )}

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary-500" />
                  {isMalay ? 'Langkah Seterusnya' : 'Next Steps'}
                </h2>
                <div className="space-y-3">
                  {insights.nextSteps.map((step, index) => (
                    <GlassCard key={index} className="py-3">
                      <div className="flex items-start gap-3">
                        {getUrgencyIcon(step.urgency)}
                        <div className="flex-1">
                          <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                            {isMalay ? step.actionMs : step.action}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            </>
          ) : (
            // Fallback - no insights available
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <GlassCard className="text-center py-6">
                <Info className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  AI insights are not available for this assessment.
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Please see the general recommendations below.
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard
                className="hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => router.push('/chat')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {isMalay ? 'Sokongan Chat AI' : 'AI Chat Support'}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {isMalay ? 'Dapatkan panduan peribadi' : 'Get personalized guidance'}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard
                className="hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => router.push('/interventions')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <Brain className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {isMalay ? 'Kursus Bantu Diri' : 'Self-Help Courses'}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {isMalay ? 'Intervensi berasaskan bukti' : 'Evidence-based interventions'}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard variant="elevated" className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {isMalay ? 'Teruskan Perjalanan Penilaian Anda' : 'Continue Your Assessment Journey'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {isMalay
                  ? 'Ambil lebih banyak penilaian untuk mendapatkan gambaran menyeluruh tentang kesejahteraan mental anda.'
                  : 'Take more assessments to get a comprehensive view of your mental well-being.'}
              </p>
              <GlassButton
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push('/my-assessments')}
              >
                {isMalay ? 'Lihat Semua Penilaian' : 'View All Assessments'}
              </GlassButton>
            </GlassCard>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-xl"
          >
            <p className="text-xs text-neutral-500">
              {isMalay ? SCREENING_DISCLAIMER.ms : SCREENING_DISCLAIMER.en}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}

// Loading fallback for Suspense
function ResultsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          </div>
        </div>
      </main>
      <Footer showEmergencyBanner />
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}
