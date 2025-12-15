'use client';

import { motion } from 'framer-motion';
import { Clock, Lock, ChevronRight, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { PremiumBadge } from '@/components/premium/premium-gate';
import type { RecommendedExercise } from '@/types/intervention-recommendations';

interface ExerciseCardProps {
  exercise: RecommendedExercise;
  isPremiumLocked?: boolean;
  onStart?: () => void;
  locale?: 'en' | 'ms';
}

export function ExerciseCard({
  exercise,
  isPremiumLocked = false,
  onStart,
  locale = 'en',
}: ExerciseCardProps) {
  const title = locale === 'ms' ? exercise.titleMs : exercise.title;
  const description = locale === 'ms' ? exercise.descriptionMs : exercise.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard
        className={`relative overflow-hidden ${
          isPremiumLocked ? 'opacity-75' : ''
        }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm line-clamp-2">
                {title}
              </h4>
              {exercise.sourceName && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {exercise.sourceName}
                </p>
              )}
            </div>
            {exercise.isPremium && <PremiumBadge tier="premium" />}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            {exercise.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {exercise.duration}
              </span>
            )}
            {exercise.steps && exercise.steps.length > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {exercise.steps.length} steps
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onStart}
            disabled={isPremiumLocked}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              isPremiumLocked
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'
            }`}
          >
            {isPremiumLocked ? (
              <>
                <Lock className="w-4 h-4" />
                {locale === 'ms' ? 'Naik Taraf untuk Akses' : 'Upgrade to Access'}
              </>
            ) : (
              <>
                {locale === 'ms' ? 'Mula Latihan' : 'Start Exercise'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Premium Lock Overlay */}
        {isPremiumLocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-neutral-900/80 to-transparent pointer-events-none" />
        )}
      </GlassCard>
    </motion.div>
  );
}

/**
 * Grid of exercise cards
 */
interface ExerciseGridProps {
  exercises: RecommendedExercise[];
  hasAccess?: boolean;
  onExerciseStart?: (exercise: RecommendedExercise) => void;
  locale?: 'en' | 'ms';
}

export function ExerciseGrid({
  exercises,
  hasAccess = false,
  onExerciseStart,
  locale = 'en',
}: ExerciseGridProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        {locale === 'ms'
          ? 'Tiada latihan yang disyorkan tersedia.'
          : 'No recommended exercises available.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          isPremiumLocked={exercise.isPremium && !hasAccess}
          onStart={() => onExerciseStart?.(exercise)}
          locale={locale}
        />
      ))}
    </div>
  );
}
