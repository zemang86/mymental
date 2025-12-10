'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, SeverityBadge } from '@/components/ui';
import {
  getInstrument,
  ASSESSMENT_TYPE_INFO,
} from '@/lib/assessment/instruments';
import { SCREENING_DISCLAIMER } from '@/lib/constants/hotlines';
import type { AssessmentType } from '@/types/assessment';

// Recommendations based on severity
const RECOMMENDATIONS: Record<string, { title: string; titleMs: string; items: { text: string; textMs: string }[] }[]> = {
  Minimal: [
    {
      title: 'Self-Care Tips',
      titleMs: 'Tips Penjagaan Diri',
      items: [
        { text: 'Continue maintaining your current healthy habits', textMs: 'Teruskan mengekalkan tabiat sihat semasa anda' },
        { text: 'Practice regular exercise and good sleep hygiene', textMs: 'Amalkan senaman tetap dan kebersihan tidur yang baik' },
        { text: 'Stay connected with supportive friends and family', textMs: 'Kekal berhubung dengan rakan dan keluarga yang menyokong' },
      ],
    },
  ],
  Mild: [
    {
      title: 'Self-Help Strategies',
      titleMs: 'Strategi Bantuan Diri',
      items: [
        { text: 'Consider mindfulness or meditation practices', textMs: 'Pertimbangkan amalan kesedaran atau meditasi' },
        { text: 'Establish a regular routine for sleep and activities', textMs: 'Wujudkan rutin tetap untuk tidur dan aktiviti' },
        { text: 'Talk to someone you trust about how you feel', textMs: 'Bercakap dengan seseorang yang anda percayai tentang perasaan anda' },
      ],
    },
  ],
  Moderate: [
    {
      title: 'Professional Support Recommended',
      titleMs: 'Sokongan Profesional Disyorkan',
      items: [
        { text: 'Consider speaking with a mental health professional', textMs: 'Pertimbangkan untuk bercakap dengan profesional kesihatan mental' },
        { text: 'Explore therapy options like CBT or counseling', textMs: 'Teroka pilihan terapi seperti CBT atau kaunseling' },
        { text: 'Keep a mood journal to track your symptoms', textMs: 'Simpan jurnal mood untuk menjejaki gejala anda' },
      ],
    },
  ],
  'Moderately Severe': [
    {
      title: 'Seek Professional Help',
      titleMs: 'Dapatkan Bantuan Profesional',
      items: [
        { text: 'We strongly recommend consulting a mental health professional', textMs: 'Kami sangat mengesyorkan anda berunding dengan profesional kesihatan mental' },
        { text: 'Treatment options may include therapy and/or medication', textMs: 'Pilihan rawatan mungkin termasuk terapi dan/atau ubat' },
        { text: 'Reach out to trusted people for support', textMs: 'Hubungi orang yang dipercayai untuk sokongan' },
      ],
    },
  ],
  Severe: [
    {
      title: 'Urgent: Professional Help Needed',
      titleMs: 'Segera: Bantuan Profesional Diperlukan',
      items: [
        { text: 'Please seek professional help as soon as possible', textMs: 'Sila dapatkan bantuan profesional secepat mungkin' },
        { text: 'Call Talian Kasih at 15999 or Befrienders at 03-7956 8145', textMs: 'Hubungi Talian Kasih di 15999 atau Befrienders di 03-7956 8145' },
        { text: 'Consider visiting a psychiatrist or mental health clinic', textMs: 'Pertimbangkan untuk melawat pakar psikiatri atau klinik kesihatan mental' },
      ],
    },
  ],
};

function ResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = params.type as AssessmentType;
  const score = parseInt(searchParams.get('score') || '0');
  const severity = searchParams.get('severity') || 'Unknown';

  const instrument = getInstrument(type);
  const typeInfo = ASSESSMENT_TYPE_INFO[type];

  // AI Insights state
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // Fetch AI insights on mount
  useEffect(() => {
    async function fetchInsights() {
      if (!type || !severity) return;

      setIsLoadingInsights(true);
      setInsightsError(null);

      try {
        const response = await fetch('/api/v1/assessment/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentType: type,
            score,
            severity,
            riskLevel: severity.toLowerCase().includes('severe') ? 'high' : 'low',
            detectedConditions: [type],
          }),
        });

        const data = await response.json();

        if (data.success) {
          setAiInsights(data.insights);
        } else {
          setInsightsError('Unable to generate personalized insights');
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
        setInsightsError('Unable to generate personalized insights');
      } finally {
        setIsLoadingInsights(false);
      }
    }

    fetchInsights();
  }, [type, score, severity]);

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

  // Get recommendations based on severity
  const getRecommendations = () => {
    if (severity.toLowerCase().includes('severe')) {
      return RECOMMENDATIONS['Severe'];
    }
    if (severity.toLowerCase().includes('moderately')) {
      return RECOMMENDATIONS['Moderately Severe'];
    }
    if (severity.toLowerCase().includes('moderate')) {
      return RECOMMENDATIONS['Moderate'];
    }
    if (severity.toLowerCase().includes('mild')) {
      return RECOMMENDATIONS['Mild'];
    }
    return RECOMMENDATIONS['Minimal'];
  };

  const recommendations = getRecommendations();
  const scorePercentage = (score / instrument.scoring.maxScore) * 100;

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
            <span className="text-5xl mb-4 block">{typeInfo.icon}</span>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Your {typeInfo.name} Assessment Results
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
            <GlassCard variant="elevated" className="mb-8">
              <div className="text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  Your score indicates
                </p>
                <SeverityBadge severity={getSeverityLevel()} className="mb-4" />

                {/* Score visualization */}
                <div className="max-w-xs mx-auto mb-6">
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

                {/* Severity explanation */}
                <div className="text-left bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    What does this mean?
                  </h3>
                  <div className="space-y-2 text-sm">
                    {instrument.scoring.ranges.map((range) => (
                      <div
                        key={range.severity}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          severity === range.severity
                            ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700'
                            : ''
                        }`}
                      >
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {range.min}-{range.max}
                        </span>
                        <span
                          className={`font-medium ${
                            severity === range.severity
                              ? 'text-primary-700 dark:text-primary-300'
                              : 'text-neutral-500'
                          }`}
                        >
                          {range.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI-Powered Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              AI-Powered Insights
            </h2>
            <GlassCard className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/30">
              {isLoadingInsights ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-3" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Generating personalized insights...
                  </span>
                </div>
              ) : insightsError ? (
                <div className="text-center py-6">
                  <p className="text-neutral-500">{insightsError}</p>
                  <p className="text-sm text-neutral-400 mt-2">
                    See the recommendations below for general guidance.
                  </p>
                </div>
              ) : aiInsights ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {aiInsights}
                  </div>
                </div>
              ) : null}
            </GlassCard>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-500" />
              Recommendations
            </h2>
            {recommendations.map((rec, index) => (
              <GlassCard key={index} className="mb-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                  {rec.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-4">{rec.titleMs}</p>
                <ul className="space-y-3">
                  {rec.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {item.text}
                        </p>
                        <p className="text-sm text-neutral-500">{item.textMs}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-500" />
              Next Steps
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="hover:border-primary-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Talk to AI Assistant
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Get personalized guidance
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="hover:border-primary-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Book a Session
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Connect with a professional
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Share/Download Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mb-8"
          >
            <GlassButton variant="secondary" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </GlassButton>
            <GlassButton variant="secondary" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </GlassButton>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard variant="elevated" className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Continue Your Assessment Journey
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Take more assessments to get a comprehensive view of your mental well-being.
              </p>
              <GlassButton
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push('/results/preliminary')}
              >
                Back to Dashboard
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
            <p className="text-xs text-neutral-500">{SCREENING_DISCLAIMER.en}</p>
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
