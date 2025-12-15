'use client';

import { motion } from 'framer-motion';
import { BookOpen, Lock, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
import { useRouter } from 'next/navigation';
import type { RecommendedExercise } from '@/types/intervention-recommendations';

interface InterventionsTeaserProps {
  exercises?: RecommendedExercise[];
  category: string;
  locale?: 'en' | 'ms';
}

export function InterventionsTeaser({ exercises = [], category, locale = 'en' }: InterventionsTeaserProps) {
  const router = useRouter();

  // Show first 2 exercises as preview
  const previewExercises = exercises.slice(0, 2);
  const hiddenCount = Math.max(0, exercises.length - 2);

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {locale === 'ms' ? 'Latihan Yang Disyorkan' : 'Recommended Exercises'}
        </h3>
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Premium
        </span>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {locale === 'ms'
          ? `${exercises.length} latihan khusus untuk membantu anda menguruskan ${category}.`
          : `${exercises.length} exercises tailored to help you manage ${category}.`}
      </p>

      {/* Preview exercises */}
      <div className="space-y-3 mb-4">
        {previewExercises.map((exercise, index) => {
          const title = locale === 'ms' ? exercise.titleMs : exercise.title;
          const description = locale === 'ms' ? exercise.descriptionMs : exercise.description;

          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-neutral-900 dark:text-white text-sm truncate">
                  {title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {description}
                </p>
                {exercise.duration && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {exercise.duration}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Hidden exercises indicator */}
        {hiddenCount > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-neutral-900 z-10" />
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 opacity-50">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
              </div>
            </div>
            <p className="absolute inset-0 flex items-center justify-center z-20 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              +{hiddenCount} {locale === 'ms' ? 'lagi latihan' : 'more exercises'}
            </p>
          </div>
        )}
      </div>

      <GlassButton
        variant="primary"
        className="w-full"
        onClick={() => router.push('/pricing')}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {locale === 'ms' ? 'Buka Kunci Latihan' : 'Unlock Exercises'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </GlassButton>
    </GlassCard>
  );
}

interface InterventionBannerProps {
  count: number;
  locale?: 'en' | 'ms';
}

export function InterventionBanner({ count, locale = 'en' }: InterventionBannerProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">
            {locale === 'ms'
              ? `${count} Latihan Tersedia`
              : `${count} Exercises Available`}
          </h4>
          <p className="text-sm text-white/80">
            {locale === 'ms'
              ? 'Teknik berasaskan bukti untuk membantu anda'
              : 'Evidence-based techniques to help you'}
          </p>
        </div>
        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => router.push('/interventions')}
          className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
        >
          {locale === 'ms' ? 'Lihat' : 'View'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </GlassButton>
      </div>
    </motion.div>
  );
}
