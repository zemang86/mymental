'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNoToggle({
  value,
  onChange,
  disabled = false,
  yesLabel = 'Yes',
  noLabel = 'No',
}: YesNoToggleProps) {
  return (
    <div className="flex gap-4">
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(true)}
        disabled={disabled}
        className={cn(
          'flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300',
          'border-2',
          value === true
            ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
            : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30 text-neutral-700 dark:text-neutral-300',
          'hover:border-primary-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
      >
        {yesLabel}
      </motion.button>

      <motion.button
        type="button"
        onClick={() => !disabled && onChange(false)}
        disabled={disabled}
        className={cn(
          'flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300',
          'border-2',
          value === false
            ? 'bg-neutral-500 border-neutral-500 text-white shadow-lg shadow-neutral-500/30'
            : 'bg-white/50 dark:bg-neutral-800/50 border-white/20 dark:border-neutral-700/30 text-neutral-700 dark:text-neutral-300',
          'hover:border-neutral-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
      >
        {noLabel}
      </motion.button>
    </div>
  );
}
