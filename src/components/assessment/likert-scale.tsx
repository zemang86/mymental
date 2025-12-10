'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export function LikertScale({
  value,
  onChange,
  disabled = false,
  min = 0,
  max = 4,
  minLabel = 'Strongly Disagree',
  maxLabel = 'Strongly Agree',
}: LikertScaleProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3">
      {/* Labels */}
      <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>

      {/* Scale buttons */}
      <div className="flex gap-2 sm:gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            type="button"
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={cn(
              'flex-1 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300',
              'border-2 text-sm sm:text-base',
              value === option
                ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30 text-neutral-700 dark:text-neutral-300',
              'hover:border-primary-400',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
