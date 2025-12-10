'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'font-medium rounded-xl transition-colors duration-300',
          'backdrop-blur-lg border',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Size variants
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          // Variant styles
          {
            // Primary - Green gradient
            'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-400':
              variant === 'primary',
            'hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500':
              variant === 'primary' && !isDisabled,
            // Secondary - Glass
            'bg-white/70 dark:bg-neutral-900/70 text-neutral-900 dark:text-white border-white/20 dark:border-neutral-700/30':
              variant === 'secondary',
            'hover:bg-white/90 dark:hover:bg-neutral-800/90 focus:ring-neutral-400':
              variant === 'secondary' && !isDisabled,
            // Outline
            'bg-transparent border-primary-500 text-primary-600 dark:text-primary-400':
              variant === 'outline',
            'hover:bg-primary-50 dark:hover:bg-primary-950 focus:ring-primary-500':
              variant === 'outline' && !isDisabled,
            // Ghost
            'bg-transparent border-transparent text-neutral-700 dark:text-neutral-300':
              variant === 'ghost',
            'hover:bg-white/50 dark:hover:bg-neutral-800/50 focus:ring-neutral-400':
              variant === 'ghost' && !isDisabled,
            // Danger
            'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400':
              variant === 'danger',
            'hover:from-red-600 hover:to-red-700 focus:ring-red-500':
              variant === 'danger' && !isDisabled,
          },
          className
        )}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
