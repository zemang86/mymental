'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Sparkles, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import type { InterventionModule } from '@/lib/interventions/modules';

// Category to color mapping
const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  anxiety: {
    bg: 'bg-lavender-100 dark:bg-lavender-900/30',
    text: 'text-lavender-700 dark:text-lavender-300',
    icon: 'bg-lavender-200 dark:bg-lavender-800/50',
  },
  depression: {
    bg: 'bg-ocean-100 dark:bg-ocean-900/30',
    text: 'text-ocean-700 dark:text-ocean-300',
    icon: 'bg-ocean-200 dark:bg-ocean-800/50',
  },
  stress: {
    bg: 'bg-warm-100 dark:bg-warm-900/30',
    text: 'text-warm-700 dark:text-warm-300',
    icon: 'bg-warm-200 dark:bg-warm-800/50',
  },
  insomnia: {
    bg: 'bg-sage-100 dark:bg-sage-900/30',
    text: 'text-sage-700 dark:text-sage-300',
    icon: 'bg-sage-200 dark:bg-sage-800/50',
  },
  sleep: {
    bg: 'bg-sage-100 dark:bg-sage-900/30',
    text: 'text-sage-700 dark:text-sage-300',
    icon: 'bg-sage-200 dark:bg-sage-800/50',
  },
  mindfulness: {
    bg: 'bg-sage-100 dark:bg-sage-900/30',
    text: 'text-sage-700 dark:text-sage-300',
    icon: 'bg-sage-200 dark:bg-sage-800/50',
  },
  ptsd: {
    bg: 'bg-warm-100 dark:bg-warm-900/30',
    text: 'text-warm-700 dark:text-warm-300',
    icon: 'bg-warm-200 dark:bg-warm-800/50',
  },
  ocd: {
    bg: 'bg-ocean-100 dark:bg-ocean-900/30',
    text: 'text-ocean-700 dark:text-ocean-300',
    icon: 'bg-ocean-200 dark:bg-ocean-800/50',
  },
  relationships: {
    bg: 'bg-lavender-100 dark:bg-lavender-900/30',
    text: 'text-lavender-700 dark:text-lavender-300',
    icon: 'bg-lavender-200 dark:bg-lavender-800/50',
  },
  default: {
    bg: 'bg-sage-100 dark:bg-sage-900/30',
    text: 'text-sage-700 dark:text-sage-300',
    icon: 'bg-sage-200 dark:bg-sage-800/50',
  },
};

// Category icons - simple geometric shapes that feel wellness-focused
const CategoryIcon = ({ category }: { category: string }) => {
  const colors = categoryColors[category] || categoryColors.default;

  return (
    <div
      className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center',
        colors.icon
      )}
    >
      <BreathingCircle size="sm" color="sage" />
    </div>
  );
};

interface WellnessCardProps {
  intervention: InterventionModule;
  progress?: { completed: number; total: number };
  isPremium?: boolean;
  isLocked?: boolean;
  locale?: 'en' | 'ms';
  onClick?: () => void;
}

export function WellnessCard({
  intervention,
  progress,
  isPremium = false,
  isLocked = false,
  locale = 'en',
  onClick,
}: WellnessCardProps) {
  const title = locale === 'ms' ? intervention.nameMs : intervention.name;
  const description = locale === 'ms' ? intervention.descriptionMs : intervention.description;
  const category = intervention.category || 'default';
  const colors = categoryColors[category] || categoryColors.default;

  const hasStarted = progress && progress.completed > 0;
  const isComplete = progress && progress.completed >= progress.total;
  const progressPercent = progress
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  // Format duration nicely
  const formatDuration = (minutes?: number) => {
    if (!minutes) return locale === 'ms' ? '~15 minit' : '~15 min';
    if (minutes < 60) return locale === 'ms' ? `${minutes} minit` : `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (locale === 'ms') {
      return mins > 0 ? `${hours} jam ${mins} min` : `${hours} jam`;
    }
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden cursor-pointer',
        'rounded-3xl border transition-all duration-300',
        'bg-white dark:bg-neutral-900',
        'border-warm-200/60 dark:border-neutral-800',
        'hover:border-sage-300 dark:hover:border-sage-700/50',
        isLocked && 'opacity-70'
      )}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Soft shadow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 wellness-shadow-lg pointer-events-none" />

      {/* Content */}
      <div className="relative p-5">
        {/* Top row: Icon + Premium badge */}
        <div className="flex items-start justify-between mb-4">
          <CategoryIcon category={category} />

          {isPremium && (
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
              'bg-lavender-100 text-lavender-700',
              'dark:bg-lavender-900/40 dark:text-lavender-300'
            )}>
              <Sparkles className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Progress arc (if started) */}
        {hasStarted && !isComplete && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
              <span>
                {progress?.completed} {locale === 'ms' ? 'daripada' : 'of'} {progress?.total}{' '}
                {locale === 'ms' ? 'langkah' : 'moments'}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-warm-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sage-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Completion badge */}
        {isComplete && (
          <div className="mb-4 flex items-center gap-2 text-sage-600 dark:text-sage-400">
            <div className="w-5 h-5 rounded-full bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm font-medium">
              {locale === 'ms' ? 'Selesai' : 'Completed'}
            </span>
          </div>
        )}

        {/* Footer: Duration + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatDuration(intervention.estimatedDuration)}</span>
          </div>

          <motion.div
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium transition-colors',
              hasStarted
                ? 'bg-sage-500 text-white'
                : 'bg-sage-100 text-sage-700 dark:bg-sage-900/50 dark:text-sage-300',
              'group-hover:bg-sage-500 group-hover:text-white'
            )}
            whileHover={{ scale: 1.02 }}
          >
            {isComplete ? (
              <>
                {locale === 'ms' ? 'Ulang' : 'Revisit'}
                <ArrowRight className="w-4 h-4" />
              </>
            ) : hasStarted ? (
              <>
                {locale === 'ms' ? 'Teruskan' : 'Continue'}
                <Play className="w-4 h-4 fill-current" />
              </>
            ) : (
              <>
                {locale === 'ms' ? 'Mulakan' : 'Begin'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Featured variant - larger, more prominent card
export function WellnessCardFeatured({
  intervention,
  progress,
  isPremium = false,
  locale = 'en',
  onClick,
}: WellnessCardProps) {
  const title = locale === 'ms' ? intervention.nameMs : intervention.name;
  const description = locale === 'ms' ? intervention.descriptionMs : intervention.description;
  const category = intervention.category || 'default';
  const colors = categoryColors[category] || categoryColors.default;

  const hasStarted = progress && progress.completed > 0;
  const progressPercent = progress
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden cursor-pointer',
        'rounded-3xl border transition-all duration-300',
        colors.bg,
        'border-transparent',
        'hover:wellness-shadow-lg'
      )}
      onClick={onClick}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative p-6 md:p-8">
        {/* Background decoration */}
        <div className="absolute top-4 right-4 w-32 h-32 opacity-20">
          <BreathingCircle size="xl" color="sage" />
        </div>

        <div className="relative z-10">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-black/30 text-neutral-700 dark:text-neutral-200">
                <Sparkles className="w-3 h-3" />
                Premium
              </span>
            )}
            <span className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium capitalize',
              'bg-white/60 dark:bg-black/30',
              colors.text
            )}>
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-neutral-700 dark:text-neutral-300 mb-6 max-w-xl">
            {description}
          </p>

          {/* Progress or CTA */}
          <div className="flex items-center gap-4">
            <motion.button
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-colors',
                'bg-white dark:bg-neutral-800',
                'text-sage-700 dark:text-sage-300',
                'hover:bg-sage-500 hover:text-white dark:hover:bg-sage-600'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {hasStarted ? (
                <>
                  {locale === 'ms' ? 'Teruskan Perjalanan' : 'Continue Journey'}
                  <Play className="w-5 h-5 fill-current" />
                </>
              ) : (
                <>
                  {locale === 'ms' ? 'Mulakan Perjalanan' : 'Begin Journey'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {hasStarted && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {progressPercent}% {locale === 'ms' ? 'selesai' : 'complete'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Compact variant - for lists or smaller spaces
export function WellnessCardCompact({
  intervention,
  progress,
  locale = 'en',
  onClick,
}: Omit<WellnessCardProps, 'isPremium' | 'isLocked'>) {
  const title = locale === 'ms' ? intervention.nameMs : intervention.name;
  const hasStarted = progress && progress.completed > 0;
  const isComplete = progress && progress.completed >= progress.total;
  const progressPercent = progress
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <motion.div
      className={cn(
        'group flex items-center gap-4 p-4 cursor-pointer',
        'rounded-2xl border transition-all duration-300',
        'bg-white dark:bg-neutral-900',
        'border-warm-200/60 dark:border-neutral-800',
        'hover:border-sage-300 dark:hover:border-sage-700/50',
        'hover:wellness-shadow'
      )}
      onClick={onClick}
      whileHover={{ x: 4 }}
    >
      {/* Progress indicator */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            className="progress-ring-bg"
            strokeWidth="3"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            className="progress-ring-fill"
            strokeWidth="3"
            strokeDasharray={`${progressPercent * 1.256} 125.6`}
          />
        </svg>
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-neutral-900 dark:text-white truncate">
          {title}
        </h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {hasStarted
            ? `${progress?.completed}/${progress?.total} ${locale === 'ms' ? 'langkah' : 'moments'}`
            : locale === 'ms'
            ? 'Belum dimulakan'
            : 'Not started'}
        </p>
      </div>

      {/* Arrow */}
      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-sage-500 transition-colors" />
    </motion.div>
  );
}
