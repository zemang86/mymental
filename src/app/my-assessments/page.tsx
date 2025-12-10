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
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, SeverityBadge } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { ASSESSMENT_TYPE_INFO } from '@/lib/assessment/instruments';
import type { AssessmentType } from '@/types/assessment';

interface Assessment {
  id: string;
  assessment_type: AssessmentType;
  total_score: number;
  score_breakdown: { maxScore: number; severity: string } | null;
  risk_level: string;
  created_at: string;
}

export default function MyAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

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
      const { data, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching assessments:', fetchError);
        // If table doesn't exist yet, show empty state
        if (fetchError.code === '42P01') {
          setAssessments([]);
        } else {
          setError('Failed to load assessments');
        }
      } else {
        setAssessments(data || []);
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
            className="grid gap-4 sm:grid-cols-3 mb-8"
          >
            <GlassCard className="text-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl w-fit mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {assessments.length}
              </p>
              <p className="text-sm text-neutral-500">Total Assessments</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {uniqueTypes.size}
              </p>
              <p className="text-sm text-neutral-500">Areas Monitored</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit mx-auto mb-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {assessments.length > 0
                  ? formatDate(assessments[0].created_at).split(',')[0]
                  : 'N/A'}
              </p>
              <p className="text-sm text-neutral-500">Last Assessment</p>
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

          {/* Assessment History */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  Assessment History
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filter === 'all'
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('recent')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filter === 'recent'
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    Recent
                  </button>
                </div>
              </div>

              {filteredAssessments.length > 0 ? (
                <div className="space-y-3">
                  {filteredAssessments.map((assessment, index) => {
                    const info = ASSESSMENT_TYPE_INFO[assessment.assessment_type] || {
                      name: assessment.assessment_type,
                      icon: '',
                    };
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
                            <span className="text-3xl">{info.icon}</span>
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
                <GlassCard className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    No assessments yet
                  </h3>
                  <p className="text-neutral-500 mb-6">
                    Start your mental health journey by taking an assessment
                  </p>
                  <GlassButton
                    variant="primary"
                    onClick={() => router.push('/start')}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    Take Assessment
                  </GlassButton>
                </GlassCard>
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
              <GlassCard variant="elevated" className="text-center">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Ready for a new assessment?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Regular check-ins help you track your progress and well-being.
                </p>
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/start')}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  New Assessment
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
