'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  ChevronRight,
  Plus,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Brain,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, SeverityBadge } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';
import { ASSESSMENT_TYPE_INFO } from '@/lib/assessment/instruments';
import type { AssessmentType } from '@/types/assessment';

// Mock assessment history data
const MOCK_ASSESSMENTS = [
  {
    id: '1',
    type: 'depression' as AssessmentType,
    score: 12,
    maxScore: 27,
    severity: 'Moderate',
    completedAt: '2024-01-08T10:30:00Z',
  },
  {
    id: '2',
    type: 'anxiety' as AssessmentType,
    score: 8,
    maxScore: 21,
    severity: 'Mild',
    completedAt: '2024-01-08T10:35:00Z',
  },
  {
    id: '3',
    type: 'insomnia' as AssessmentType,
    score: 15,
    maxScore: 28,
    severity: 'Moderate',
    completedAt: '2024-01-07T14:20:00Z',
  },
];

export default function MyAssessmentsPage() {
  const router = useRouter();
  const { userEmail, detectedConditions, riskLevel } = useAssessmentStore();

  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  // In production, fetch from API
  const assessments = MOCK_ASSESSMENTS;

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
    if (lower.includes('severe')) return 'severe';
    if (lower.includes('moderate')) return 'moderate';
    return 'mild';
  };

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
                {detectedConditions.length}
              </p>
              <p className="text-sm text-neutral-500">Areas Monitored</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit mx-auto mb-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {assessments.length > 0 ? formatDate(assessments[0].completedAt).split(',')[0] : 'N/A'}
              </p>
              <p className="text-sm text-neutral-500">Last Assessment</p>
            </GlassCard>
          </motion.div>

          {/* Recommended Assessments */}
          {detectedConditions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-500" />
                Recommended for You
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {detectedConditions.slice(0, 3).map((condition) => {
                  const info = ASSESSMENT_TYPE_INFO[condition];
                  return (
                    <motion.div
                      key={condition}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GlassCard
                        className="cursor-pointer hover:border-primary-400 transition-colors"
                        onClick={() => router.push(`/test/${condition}`)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{info.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-neutral-900 dark:text-white">
                              {info.name}
                            </h3>
                            <p className="text-xs text-neutral-500">{info.nameMs}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-neutral-400" />
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Assessment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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

            {assessments.length > 0 ? (
              <div className="space-y-3">
                {assessments.map((assessment, index) => {
                  const info = ASSESSMENT_TYPE_INFO[assessment.type];
                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <GlassCard
                        className="cursor-pointer hover:border-primary-400 transition-colors"
                        onClick={() =>
                          router.push(
                            `/test/${assessment.type}/results?score=${assessment.score}&severity=${assessment.severity}`
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
                                severity={getSeverityLevel(assessment.severity)}
                                size="sm"
                              />
                            </div>
                            <p className="text-sm text-neutral-500">
                              Score: {assessment.score}/{assessment.maxScore}
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">
                              {formatDate(assessment.completedAt)}
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

          {/* Take New Assessment CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
