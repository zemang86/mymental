'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          'bg-white/30 dark:bg-neutral-800/30',
          'backdrop-blur-sm border border-white/20 dark:border-neutral-700/20',
          {
            'h-1': size === 'sm',
            'h-2': size === 'md',
            'h-3': size === 'lg',
          }
        )}
      >
        {/* Progress fill */}
        <motion.div
          className={cn(
            'h-full rounded-full',
            // Gradient variants
            {
              'bg-gradient-to-r from-primary-400 to-primary-600': variant === 'default',
              'bg-gradient-to-r from-green-400 to-green-600': variant === 'success',
              'bg-gradient-to-r from-yellow-400 to-orange-500': variant === 'warning',
              'bg-gradient-to-r from-red-400 to-red-600': variant === 'danger',
            }
          )}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}

// Step-based progress indicator
export interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function ProgressSteps({
  currentStep,
  totalSteps,
  labels,
  className,
}: ProgressStepsProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center flex-1"
            >
              {/* Step indicator */}
              <div className="relative flex items-center w-full">
                {/* Line before (except first) */}
                {index > 0 && (
                  <div
                    className={cn(
                      'absolute left-0 right-1/2 h-0.5 -translate-y-1/2 top-1/2',
                      isCompleted || isCurrent
                        ? 'bg-primary-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                    )}
                  />
                )}

                {/* Circle */}
                <motion.div
                  className={cn(
                    'relative z-10 mx-auto flex items-center justify-center rounded-full',
                    'w-8 h-8 text-sm font-medium border-2',
                    'transition-colors duration-300',
                    {
                      // Completed
                      'bg-primary-500 border-primary-500 text-white': isCompleted,
                      // Current
                      'bg-white dark:bg-neutral-900 border-primary-500 text-primary-600':
                        isCurrent,
                      // Upcoming
                      'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-400':
                        !isCompleted && !isCurrent,
                    }
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Line after (except last) */}
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      'absolute left-1/2 right-0 h-0.5 -translate-y-1/2 top-1/2',
                      isCompleted
                        ? 'bg-primary-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                    )}
                  />
                )}
              </div>

              {/* Label */}
              {labels && labels[index] && (
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center',
                    isCurrent
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-500'
                  )}
                >
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
