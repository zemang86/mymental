'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  Trophy,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { GlassCard } from '@/components/ui';
import type { InterventionChapter, UserInterventionProgress } from '@/lib/interventions/modules';

interface ProgressTrackerProps {
  chapters: InterventionChapter[];
  progress?: UserInterventionProgress;
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
  locale?: 'en' | 'ms';
}

export function ProgressTracker({
  chapters,
  progress,
  currentChapterIndex,
  onChapterSelect,
  locale = 'en',
}: ProgressTrackerProps) {
  const completedCount = chapters.filter(ch => ch.isCompleted).length;
  const progressPercentage = chapters.length > 0
    ? Math.round((completedCount / chapters.length) * 100)
    : 0;

  const totalDuration = chapters.reduce((acc, ch) => acc + (ch.estimatedDuration || 0), 0);
  const completedDuration = chapters
    .filter(ch => ch.isCompleted)
    .reduce((acc, ch) => acc + (ch.estimatedDuration || 0), 0);

  return (
    <div className="space-y-4">
      {/* Progress Summary Card */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            {locale === 'ms' ? 'Kemajuan Anda' : 'Your Progress'}
          </h3>
          {progressPercentage === 100 && (
            <Trophy className="w-6 h-6 text-yellow-500" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            <span>{completedCount} / {chapters.length} {locale === 'ms' ? 'selesai' : 'completed'}</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                progressPercentage === 100
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-primary-500 to-primary-400'
              }`}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <Clock className="w-4 h-4 mx-auto text-primary-500 mb-1" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {locale === 'ms' ? 'Masa' : 'Time'}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {completedDuration} / {totalDuration} {locale === 'ms' ? 'min' : 'min'}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <BookOpen className="w-4 h-4 mx-auto text-primary-500 mb-1" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {locale === 'ms' ? 'Bab' : 'Chapters'}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {completedCount} / {chapters.length}
            </p>
          </div>
        </div>

        {progress?.totalTimeSpent && progress.totalTimeSpent > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
              {locale === 'ms' ? 'Jumlah masa dihabiskan' : 'Total time spent'}: {' '}
              <span className="font-medium">
                {Math.round(progress.totalTimeSpent / 60)} {locale === 'ms' ? 'minit' : 'minutes'}
              </span>
            </p>
          </div>
        )}
      </GlassCard>

      {/* Chapter List */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          {locale === 'ms' ? 'Senarai Bab' : 'Chapter List'}
        </h3>
        <div className="space-y-2">
          {chapters.map((chapter, index) => {
            const title = locale === 'ms' ? chapter.titleMs : chapter.title;
            const isActive = index === currentChapterIndex;
            const isCompleted = chapter.isCompleted;
            const isLocked = !chapter.isFreePreview && index > 0 && !chapters[index - 1]?.isCompleted;

            return (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isLocked && onChapterSelect(index)}
                disabled={isLocked}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700'
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    : isLocked
                    ? 'bg-neutral-100 dark:bg-neutral-800/50 opacity-50 cursor-not-allowed'
                    : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    </div>
                  ) : (
                    <Circle className={`w-5 h-5 ${isLocked ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-300'
                      : isCompleted
                      ? 'text-green-700 dark:text-green-300'
                      : isLocked
                      ? 'text-neutral-400 dark:text-neutral-500'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {index + 1}. {title}
                  </p>
                  {chapter.estimatedDuration && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {chapter.estimatedDuration} {locale === 'ms' ? 'min' : 'min'}
                    </p>
                  )}
                </div>
                {chapter.isFreePreview && !isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                    {locale === 'ms' ? 'Percuma' : 'Free'}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

interface ProgressBadgeProps {
  completed: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBadge({ completed, total, size = 'md' }: ProgressBadgeProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="8%"
          className="text-neutral-200 dark:text-neutral-700"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="8%"
          strokeDasharray={`${percentage * 2.83} 283`}
          className={percentage === 100 ? 'text-green-500' : 'text-primary-500'}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-neutral-900 dark:text-white">
        {percentage}%
      </span>
    </div>
  );
}

interface CompletionBannerProps {
  moduleName: string;
  locale?: 'en' | 'ms';
}

export function CompletionBanner({ moduleName, locale = 'en' }: CompletionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white text-center"
    >
      <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
      <h2 className="text-xl font-bold mb-2">
        {locale === 'ms' ? 'Tahniah!' : 'Congratulations!'}
      </h2>
      <p className="text-green-100">
        {locale === 'ms'
          ? `Anda telah menyelesaikan modul ${moduleName}!`
          : `You have completed the ${moduleName} module!`}
      </p>
    </motion.div>
  );
}
