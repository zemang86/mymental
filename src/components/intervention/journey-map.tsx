'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { InterventionChapter } from '@/lib/interventions/modules';

interface JourneyMapProps {
  chapters: InterventionChapter[];
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
  locale?: 'en' | 'ms';
  variant?: 'horizontal' | 'vertical';
}

export function JourneyMap({
  chapters,
  currentChapterIndex,
  onChapterSelect,
  locale = 'en',
  variant = 'horizontal',
}: JourneyMapProps) {
  const isVertical = variant === 'vertical';

  return (
    <div
      className={cn(
        'relative',
        isVertical
          ? 'flex flex-col gap-2'
          : 'flex items-center gap-2 overflow-x-auto pb-4 px-2 scrollbar-hide'
      )}
    >
      {chapters.map((chapter, index) => {
        const isCompleted = chapter.isCompleted;
        const isCurrent = index === currentChapterIndex;
        const isLocked = !isCompleted && index > 0 && !chapters[index - 1]?.isCompleted && index !== currentChapterIndex;
        const isNext = index === currentChapterIndex + 1;

        return (
          <div
            key={chapter.id}
            className={cn(
              'relative flex items-center',
              isVertical ? 'flex-row' : 'flex-col',
              !isVertical && 'flex-shrink-0'
            )}
          >
            {/* Connecting line (before node) */}
            {index > 0 && (
              <div
                className={cn(
                  isVertical
                    ? 'absolute left-5 -top-2 w-0.5 h-4'
                    : 'absolute -left-2 top-5 h-0.5 w-4',
                  isCompleted || isCurrent
                    ? 'bg-sage-400 dark:bg-sage-500'
                    : 'bg-warm-200 dark:bg-neutral-700'
                )}
              />
            )}

            {/* Node */}
            <motion.button
              onClick={() => !isLocked && onChapterSelect(index)}
              disabled={isLocked}
              className={cn(
                'relative z-10 flex items-center justify-center rounded-full transition-all',
                isVertical ? 'w-10 h-10' : 'w-10 h-10',
                isCompleted
                  ? 'bg-sage-500 text-white wellness-glow-sage'
                  : isCurrent
                  ? 'bg-sage-200 dark:bg-sage-800 text-sage-700 dark:text-sage-200 ring-4 ring-sage-200/50 dark:ring-sage-700/30'
                  : isLocked
                  ? 'bg-warm-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                  : 'bg-warm-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-sage-100 dark:hover:bg-sage-900/50'
              )}
              whileHover={!isLocked ? { scale: 1.1 } : undefined}
              whileTap={!isLocked ? { scale: 0.95 } : undefined}
              initial={false}
              animate={isCurrent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={
                isCurrent
                  ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : isLocked ? (
                <Lock className="w-4 h-4" />
              ) : isCurrent ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </motion.button>

            {/* Label (for horizontal variant) */}
            {!isVertical && (
              <div className="mt-2 text-center max-w-[80px]">
                <p
                  className={cn(
                    'text-xs truncate',
                    isCompleted
                      ? 'text-sage-600 dark:text-sage-400 font-medium'
                      : isCurrent
                      ? 'text-neutral-900 dark:text-white font-medium'
                      : 'text-neutral-500 dark:text-neutral-400'
                  )}
                >
                  {locale === 'ms' ? chapter.titleMs || chapter.title : chapter.title}
                </p>
              </div>
            )}

            {/* Label (for vertical variant) */}
            {isVertical && (
              <div className="ml-4 flex-1">
                <p
                  className={cn(
                    'text-sm',
                    isCompleted
                      ? 'text-sage-600 dark:text-sage-400 font-medium'
                      : isCurrent
                      ? 'text-neutral-900 dark:text-white font-medium'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                >
                  {locale === 'ms' ? chapter.titleMs || chapter.title : chapter.title}
                </p>
                {chapter.estimatedDuration && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    ~{chapter.estimatedDuration} {locale === 'ms' ? 'min' : 'min'}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Curved path journey map - more visual, wellness-focused
export function JourneyPath({
  chapters,
  currentChapterIndex,
  onChapterSelect,
  locale = 'en',
}: Omit<JourneyMapProps, 'variant'>) {
  const totalChapters = chapters.length;

  // Generate positions for a gentle wave pattern
  const getPosition = (index: number) => {
    const progress = index / (totalChapters - 1);
    const x = 10 + progress * 80; // 10% to 90% of width
    const waveAmplitude = 15;
    const y = 50 + Math.sin(progress * Math.PI * 2) * waveAmplitude;
    return { x, y };
  };

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-3xl bg-warm-50 dark:bg-neutral-900/50 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 left-[10%] w-16 h-16 rounded-full bg-sage-200 dark:bg-sage-800 blur-xl" />
        <div className="absolute bottom-4 right-[20%] w-20 h-20 rounded-full bg-lavender-200 dark:bg-lavender-800 blur-xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-ocean-200 dark:bg-ocean-800 blur-2xl" />
      </div>

      {/* SVG Path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Path line */}
        <path
          d={`M ${getPosition(0).x} ${getPosition(0).y} ${chapters
            .slice(1)
            .map((_, i) => {
              const pos = getPosition(i + 1);
              return `L ${pos.x} ${pos.y}`;
            })
            .join(' ')}`}
          fill="none"
          className="stroke-warm-300 dark:stroke-neutral-700"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />

        {/* Completed path */}
        {currentChapterIndex > 0 && (
          <path
            d={`M ${getPosition(0).x} ${getPosition(0).y} ${chapters
              .slice(1, currentChapterIndex + 1)
              .map((_, i) => {
                const pos = getPosition(i + 1);
                return `L ${pos.x} ${pos.y}`;
              })
              .join(' ')}`}
            fill="none"
            className="stroke-sage-400 dark:stroke-sage-500"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Journey nodes */}
      {chapters.map((chapter, index) => {
        const pos = getPosition(index);
        const isCompleted = chapter.isCompleted;
        const isCurrent = index === currentChapterIndex;
        const isLocked = !isCompleted && index > 0 && !chapters[index - 1]?.isCompleted && index !== currentChapterIndex;

        return (
          <motion.button
            key={chapter.id}
            onClick={() => !isLocked && onChapterSelect(index)}
            disabled={isLocked}
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-1/2 z-10',
              'flex flex-col items-center gap-1'
            )}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Node */}
            <motion.div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                isCompleted
                  ? 'bg-sage-500 text-white shadow-lg'
                  : isCurrent
                  ? 'bg-white dark:bg-sage-800 text-sage-700 dark:text-sage-200 ring-4 ring-sage-300/50 dark:ring-sage-600/30 shadow-lg'
                  : isLocked
                  ? 'bg-warm-200/80 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
                  : 'bg-white/80 dark:bg-neutral-800 text-neutral-500 hover:bg-sage-100 dark:hover:bg-sage-900/50'
              )}
              whileHover={!isLocked ? { scale: 1.2 } : undefined}
              whileTap={!isLocked ? { scale: 0.9 } : undefined}
              animate={
                isCurrent
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 6px rgba(122, 138, 100, 0.2)',
                        '0 8px 12px rgba(122, 138, 100, 0.3)',
                        '0 4px 6px rgba(122, 138, 100, 0.2)',
                      ],
                    }
                  : {}
              }
              transition={
                isCurrent
                  ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : isCurrent ? (
                <Sparkles className="w-4 h-4" />
              ) : isLocked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </motion.div>

            {/* Label */}
            <span
              className={cn(
                'text-[10px] max-w-[60px] text-center truncate',
                isCompleted || isCurrent
                  ? 'text-sage-700 dark:text-sage-300 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              {locale === 'ms' ? chapter.titleMs || chapter.title : chapter.title}
            </span>
          </motion.button>
        );
      })}

      {/* Start label */}
      <div className="absolute bottom-2 left-4 text-xs text-sage-600 dark:text-sage-400 font-medium">
        {locale === 'ms' ? 'Mula' : 'Start'}
      </div>

      {/* End label */}
      <div className="absolute bottom-2 right-4 text-xs text-sage-600 dark:text-sage-400 font-medium flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        {locale === 'ms' ? 'Tamat' : 'Complete'}
      </div>
    </div>
  );
}
