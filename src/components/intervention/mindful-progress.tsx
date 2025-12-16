'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Calendar, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ConfettiAnimation } from '@/components/ui/lottie-animation';
import type { InterventionChapter, UserInterventionProgress } from '@/lib/interventions/modules';

interface MindfulProgressProps {
  chapters: InterventionChapter[];
  progress?: UserInterventionProgress;
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
  locale?: 'en' | 'ms';
}

// Circular progress ring component
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-warm-200 dark:stroke-neutral-700"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-sage-500 dark:stroke-sage-400"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// Weekly activity dots (like a simplified GitHub contribution graph)
function WeeklyActivity({
  daysActive = [],
  locale = 'en',
}: {
  daysActive: boolean[];
  locale?: 'en' | 'ms';
}) {
  const dayLabels = locale === 'ms'
    ? ['I', 'S', 'S', 'R', 'K', 'J', 'S']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Ensure we have 7 days
  const days = [...daysActive, ...Array(7 - daysActive.length).fill(false)].slice(0, 7);

  return (
    <div className="flex items-center gap-1.5">
      {days.map((active, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
            {dayLabels[i]}
          </span>
          <div
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              active
                ? 'bg-sage-400 dark:bg-sage-500'
                : 'bg-warm-200 dark:bg-neutral-700'
            )}
          />
        </div>
      ))}
    </div>
  );
}

export function MindfulProgress({
  chapters,
  progress,
  currentChapterIndex,
  onChapterSelect,
  locale = 'en',
}: MindfulProgressProps) {
  const completedCount = chapters.filter(ch => ch.isCompleted).length;
  const progressPercent = chapters.length > 0
    ? Math.round((completedCount / chapters.length) * 100)
    : 0;
  const isComplete = progressPercent === 100;

  const totalDuration = chapters.reduce((acc, ch) => acc + (ch.estimatedDuration || 5), 0);

  // Mock weekly activity - in real app, this would come from user data
  const weeklyActivity = [true, true, false, true, false, false, false];
  const streakDays = weeklyActivity.filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <div className="wellness-card p-6 relative overflow-hidden">
        {/* Completion celebration */}
        {isComplete && (
          <div className="absolute -top-4 -right-4 w-32 h-32 pointer-events-none">
            <ConfettiAnimation size="xl" loop={false} />
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Progress Ring */}
          <ProgressRing progress={progressPercent} size={140} strokeWidth={10}>
            <div className="text-center">
              {isComplete ? (
                <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-sage-600 dark:text-sage-400" />
                </div>
              ) : (
                <>
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {completedCount}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 block">
                    {locale === 'ms' ? `daripada ${chapters.length}` : `of ${chapters.length}`}
                  </span>
                </>
              )}
            </div>
          </ProgressRing>

          {/* Encouraging message */}
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            {isComplete
              ? locale === 'ms'
                ? 'Tahniah! Anda telah menyelesaikan perjalanan ini'
                : 'Amazing! You completed this journey'
              : completedCount === 0
              ? locale === 'ms'
                ? 'Mulakan perjalanan kesejahteraan anda'
                : 'Begin your wellness journey'
              : locale === 'ms'
              ? `${chapters.length - completedCount} langkah lagi untuk selesai`
              : `${chapters.length - completedCount} more moments to go`}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-warm-200 dark:border-neutral-700 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-sage-600 dark:text-sage-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {locale === 'ms' ? 'Anggaran' : 'Est. Time'}
              </span>
            </div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              {totalDuration} {locale === 'ms' ? 'min' : 'min'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-sage-600 dark:text-sage-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {locale === 'ms' ? 'Streak' : 'Streak'}
              </span>
            </div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              {streakDays} {locale === 'ms' ? 'hari' : 'days'}
            </p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="mt-4 flex justify-center">
          <WeeklyActivity daysActive={weeklyActivity} locale={locale} />
        </div>
      </div>

      {/* Chapter List */}
      <div className="wellness-card p-4">
        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3 px-2">
          {locale === 'ms' ? 'Langkah-langkah' : 'Mindful Moments'}
        </h4>
        <div className="space-y-1">
          {chapters.map((chapter, index) => {
            const isCompleted = chapter.isCompleted;
            const isCurrent = index === currentChapterIndex;
            const isLocked = index > currentChapterIndex && !isCompleted && index !== 0;

            return (
              <motion.button
                key={chapter.id}
                onClick={() => !isLocked && onChapterSelect(index)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all',
                  isCurrent
                    ? 'bg-sage-100 dark:bg-sage-900/30 border border-sage-200 dark:border-sage-700/50'
                    : 'hover:bg-warm-100 dark:hover:bg-neutral-800/50',
                  isLocked && 'opacity-50 cursor-not-allowed'
                )}
                whileHover={!isLocked ? { x: 4 } : undefined}
                disabled={isLocked}
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                    isCompleted
                      ? 'bg-sage-500 text-white'
                      : isCurrent
                      ? 'bg-sage-200 dark:bg-sage-800 text-sage-700 dark:text-sage-300 animate-gentle-pulse'
                      : 'bg-warm-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Chapter info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      isCompleted
                        ? 'text-sage-700 dark:text-sage-300'
                        : isCurrent
                        ? 'text-neutral-900 dark:text-white'
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

                {/* Current indicator */}
                {isCurrent && !isCompleted && (
                  <div className="w-2 h-2 rounded-full bg-sage-500 animate-gentle-pulse" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Simpler progress badge for cards
export function ProgressBadge({
  completed,
  total,
  size = 'md',
}: {
  completed: number;
  total: number;
  size?: 'sm' | 'md';
}) {
  const percent = Math.round((completed / total) * 100);
  const sizeConfig = size === 'sm' ? { ring: 32, stroke: 3 } : { ring: 48, stroke: 4 };

  return (
    <ProgressRing progress={percent} size={sizeConfig.ring} strokeWidth={sizeConfig.stroke}>
      <span className={cn(
        'font-semibold text-neutral-700 dark:text-neutral-300',
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      )}>
        {percent}%
      </span>
    </ProgressRing>
  );
}
