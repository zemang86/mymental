'use client';

import { motion } from 'framer-motion';
import { Sparkles, Lock, ArrowRight, Eye, Brain, Target } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface InsightsPreviewProps {
  assessmentType: string;
  severity: string;
  locale?: 'en' | 'ms';
}

export function InsightsPreview({ assessmentType, severity, locale = 'en' }: InsightsPreviewProps) {
  const router = useRouter();

  const previewItems = [
    {
      icon: Brain,
      title: locale === 'ms' ? 'Analisis Mendalam' : 'Deep Analysis',
      description: locale === 'ms'
        ? 'Fahami corak dan pencetus anda'
        : 'Understand your patterns and triggers',
    },
    {
      icon: Target,
      title: locale === 'ms' ? 'Saranan Peribadi' : 'Personalized Recommendations',
      description: locale === 'ms'
        ? 'Teknik khusus untuk keadaan anda'
        : 'Specific techniques for your condition',
    },
    {
      icon: Eye,
      title: locale === 'ms' ? 'Pandangan AI' : 'AI Insights',
      description: locale === 'ms'
        ? 'Analisis didorong AI berdasarkan penyelidikan'
        : 'Research-backed AI-driven analysis',
    },
  ];

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 dark:bg-neutral-900/30 z-10" />

      {/* Locked content indicator */}
      <div className="relative z-20 text-center py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 mb-4"
        >
          <Lock className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {locale === 'ms' ? 'Buka Kunci Pandangan AI' : 'Unlock AI Insights'}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm mx-auto">
          {locale === 'ms'
            ? 'Tingkatkan untuk mendapat analisis mendalam dan saranan peribadi berdasarkan keputusan anda.'
            : 'Upgrade to get deep analysis and personalized recommendations based on your results.'}
        </p>

        {/* Preview items */}
        <div className="grid gap-4 mb-6 text-left max-w-md mx-auto">
          {previewItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-neutral-800/50"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-white text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <GlassButton
          variant="primary"
          onClick={() => router.push('/pricing')}
          className="px-6"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {locale === 'ms' ? 'Tingkatkan Sekarang' : 'Upgrade Now'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </GlassButton>
      </div>

      {/* Background teaser content (blurred) */}
      <div className="absolute inset-0 p-6 opacity-30 pointer-events-none">
        <div className="space-y-4">
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-3/4" />
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-full" />
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-2/3" />
          <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded mt-6" />
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-5/6" />
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-full" />
        </div>
      </div>
    </GlassCard>
  );
}

interface InsightsSummaryPreviewProps {
  locale?: 'en' | 'ms';
}

export function InsightsSummaryPreview({ locale = 'en' }: InsightsSummaryPreviewProps) {
  const router = useRouter();

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-neutral-900 dark:text-white text-sm">
            {locale === 'ms' ? 'Pandangan AI Tersedia' : 'AI Insights Available'}
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {locale === 'ms'
              ? 'Tingkatkan untuk melihat analisis mendalam'
              : 'Upgrade to see deep analysis'}
          </p>
        </div>
        <GlassButton
          variant="primary"
          size="sm"
          onClick={() => router.push('/pricing')}
        >
          {locale === 'ms' ? 'Tingkat' : 'Upgrade'}
        </GlassButton>
      </div>
    </div>
  );
}
