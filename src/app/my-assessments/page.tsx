'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  ChevronRight,
  Plus,
  TrendingUp,
  Calendar,
  Crown,
  Loader2,
  RefreshCw,
  CloudRain,
  HeartPulse,
  Moon,
  Brain,
  ShieldAlert,
  ClipboardList,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  'cloud-rain': CloudRain,
  'heart-pulse': HeartPulse,
  'refresh-cw': RefreshCw,
  'shield-alert': ShieldAlert,
  'moon': Moon,
  'alert-triangle': ShieldAlert,
  'brain': Brain,
  'flame': HeartPulse, // fallback
  'heart-crack': HeartPulse, // fallback
};
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, SeverityBadge } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { ASSESSMENT_TYPE_INFO, ASSESSMENT_INSTRUMENTS } from '@/lib/assessment/instruments';
import type { AssessmentType } from '@/types/assessment';

// Available assessments for direct access
const AVAILABLE_ASSESSMENTS: AssessmentType[] = ['depression', 'anxiety', 'insomnia', 'ocd', 'ptsd'];

interface Assessment {
  id: string;
  assessment_type: AssessmentType;
  total_score: number;
  score_breakdown: { maxScore: number; severity: string } | null;
  risk_level: string;
  created_at: string;
}

interface InitialScreening {
  id: string;
  detected_conditions: AssessmentType[];
  overall_risk_level: string;
  created_at: string;
}

export default function MyAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [screenings, setScreenings] = useState<InitialScreening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent'>('all');
  const [activeTab, setActiveTab] = useState<'assessments' | 'screenings'>('assessments');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/my-assessments');
        return;
      }

      // Fetch assessments from database
      const { data: assessmentData, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching assessments:', fetchError);
        if (fetchError.code !== '42P01') {
          setError('Failed to load assessments');
        }
      } else {
        setAssessments(assessmentData || []);
      }

      // Fetch initial screenings from database
      const { data: screeningData, error: screeningError } = await supabase
        .from('initial_screenings')
        .select('id, detected_conditions, overall_risk_level, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (screeningError) {
        console.error('Error fetching screenings:', screeningError);
      } else {
        setScreenings(screeningData || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityLevel = (severity: string): 'mild' | 'moderate' | 'severe' | 'very_severe' => {
    const lower = severity.toLowerCase();
    if (lower.includes('very') || lower.includes('extreme')) return 'very_severe';
    if (lower.includes('severe')) return 'severe';
    if (lower.includes('moderate')) return 'moderate';
    return 'mild';
  };

  const filteredAssessments = filter === 'recent'
    ? assessments.slice(0, 5)
    : assessments;

  // Get unique assessment types for stats
  const uniqueTypes = new Set(assessments.map((a) => a.assessment_type));

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
              My Assessments
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your mental health journey
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-8"
          >
            <GlassCard className="text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-3">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {screenings.length}
              </p>
              <p className="text-sm text-neutral-500">Screenings</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl w-fit mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {assessments.length}
              </p>
              <p className="text-sm text-neutral-500">Assessments</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {uniqueTypes.size}
              </p>
              <p className="text-sm text-neutral-500">Areas Tracked</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit mx-auto mb-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {screenings.length > 0 || assessments.length > 0
                  ? formatDate(
                      screenings[0]?.created_at || assessments[0]?.created_at
                    ).split(',')[0]
                  : 'N/A'}
              </p>
              <p className="text-sm text-neutral-500">Last Activity</p>
            </GlassCard>
          </motion.div>

          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <GlassCard className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                    <Crown className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        Free Plan
                      </h3>
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        Demo Mode
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      Upgrade to unlock all assessments & AI insights
                    </p>
                  </div>
                </div>
                <GlassButton
                  variant="primary"
                  onClick={() => router.push('/pricing')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Test Subscribe
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlassCard className="text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <GlassButton variant="secondary" onClick={fetchAssessments}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}

          {/* History Tabs */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Tab Switcher */}
              <div className="flex items-center gap-4 mb-4 border-b border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setActiveTab('screenings')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'screenings'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  Screenings ({screenings.length})
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'assessments'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Assessments ({assessments.length})
                </button>
              </div>

              {/* Screenings Tab */}
              {activeTab === 'screenings' && (
                <>
                  {screenings.length > 0 ? (
                    <div className="space-y-3">
                      {screenings.map((screening, index) => (
                        <motion.div
                          key={screening.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <GlassCard>
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${
                                screening.overall_risk_level === 'high' || screening.overall_risk_level === 'imminent'
                                  ? 'bg-red-100 dark:bg-red-900/30'
                                  : screening.overall_risk_level === 'moderate'
                                    ? 'bg-orange-100 dark:bg-orange-900/30'
                                    : 'bg-green-100 dark:bg-green-900/30'
                              }`}>
                                <ClipboardList className={`w-6 h-6 ${
                                  screening.overall_risk_level === 'high' || screening.overall_risk_level === 'imminent'
                                    ? 'text-red-600'
                                    : screening.overall_risk_level === 'moderate'
                                      ? 'text-orange-600'
                                      : 'text-green-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                                    Initial Screening
                                  </h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    screening.overall_risk_level === 'high' || screening.overall_risk_level === 'imminent'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                      : screening.overall_risk_level === 'moderate'
                                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  }`}>
                                    {screening.overall_risk_level}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-500">
                                  {screening.detected_conditions.length > 0
                                    ? `Detected: ${screening.detected_conditions.map(c => ASSESSMENT_TYPE_INFO[c]?.name || c).join(', ')}`
                                    : 'No conditions detected'}
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
                                  {formatDate(screening.created_at)}
                                </p>
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <GlassCard className="text-center py-8">
                      <ClipboardList className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                        No screenings yet
                      </h3>
                      <p className="text-neutral-500 mb-4">
                        Take an initial mental health screening
                      </p>
                      <GlassButton
                        variant="primary"
                        onClick={() => router.push('/start')}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                      >
                        Start Screening
                      </GlassButton>
                    </GlassCard>
                  )}
                </>
              )}

              {/* Assessments Tab */}
              {activeTab === 'assessments' && (
                <>

              {filteredAssessments.length > 0 ? (
                <div className="space-y-3">
                  {filteredAssessments.map((assessment, index) => {
                    const info = ASSESSMENT_TYPE_INFO[assessment.assessment_type] || {
                      name: assessment.assessment_type,
                      icon: 'file-text',
                    };
                    const IconComponent = ICON_MAP[info.icon] || FileText;
                    const severity = assessment.score_breakdown?.severity || assessment.risk_level || 'Unknown';
                    const maxScore = assessment.score_breakdown?.maxScore || 0;
                    return (
                      <motion.div
                        key={assessment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <GlassCard
                          className="cursor-pointer hover:border-primary-400 transition-colors"
                          onClick={() =>
                            router.push(
                              `/test/${assessment.assessment_type}/results?id=${assessment.id}&score=${assessment.total_score}&severity=${severity}`
                            )
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                              <IconComponent className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-neutral-900 dark:text-white">
                                  {info.name}
                                </h3>
                                <SeverityBadge
                                  severity={getSeverityLevel(severity)}
                                  size="sm"
                                />
                              </div>
                              <p className="text-sm text-neutral-500">
                                Score: {assessment.total_score}{maxScore ? `/${maxScore}` : ''}
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                {formatDate(assessment.created_at)}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-400" />
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <GlassCard className="py-8">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 text-center">
                    No assessments yet
                  </h3>
                  <p className="text-neutral-500 mb-6 text-center">
                    Choose an assessment to start your mental health journey
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {AVAILABLE_ASSESSMENTS.map((type) => {
                      const info = ASSESSMENT_TYPE_INFO[type];
                      const IconComponent = ICON_MAP[info.icon] || FileText;
                      return (
                        <button
                          key={type}
                          onClick={() => router.push(`/test/${type}`)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 transition-colors text-left"
                        >
                          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <IconComponent className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900 dark:text-white text-sm">
                              {info.name}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
              )}
              </>
              )}
            </motion.div>
          )}

          {/* Take New Assessment CTA */}
          {!isLoading && assessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <GlassCard variant="elevated">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 text-center">
                  Take Another Assessment
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-center">
                  Regular check-ins help you track your progress and well-being.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {AVAILABLE_ASSESSMENTS.map((type) => {
                    const info = ASSESSMENT_TYPE_INFO[type];
                    const IconComponent = ICON_MAP[info.icon] || FileText;
                    return (
                      <button
                        key={type}
                        onClick={() => router.push(`/test/${type}`)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 transition-colors text-left"
                      >
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900 dark:text-white text-sm">
                            {info.name}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center">
                  <button
                    onClick={() => router.push('/start')}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Or take the full screening again →
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
