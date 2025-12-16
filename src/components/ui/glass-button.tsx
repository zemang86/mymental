'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'wellness' | 'wellness-outline';
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
            // Primary - Green gradient (same in both modes)
            'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-400/50':
              variant === 'primary',
            'hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500/50':
              variant === 'primary' && !isDisabled,

            // Secondary - Glass effect
            'bg-white/80 text-neutral-900 border-white/30':
              variant === 'secondary',
            'dark:bg-neutral-800/80 dark:text-white dark:border-neutral-600/30':
              variant === 'secondary',
            'hover:bg-white/95 dark:hover:bg-neutral-700/90 focus:ring-neutral-400/50':
              variant === 'secondary' && !isDisabled,

            // Outline
            'bg-transparent border-2 border-primary-500 text-primary-600':
              variant === 'outline',
            'dark:border-primary-400 dark:text-primary-400':
              variant === 'outline',
            'hover:bg-primary-50 dark:hover:bg-primary-950/50 focus:ring-primary-500/50':
              variant === 'outline' && !isDisabled,

            // Ghost
            'bg-transparent border-transparent text-neutral-700':
              variant === 'ghost',
            'dark:text-neutral-200':
              variant === 'ghost',
            'hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 focus:ring-neutral-400/50':
              variant === 'ghost' && !isDisabled,

            // Danger
            'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400/50':
              variant === 'danger',
            'hover:from-red-600 hover:to-red-700 focus:ring-red-500/50':
              variant === 'danger' && !isDisabled,

            // Wellness - Soft sage gradient, rounded, calm feel
            'bg-gradient-to-r from-sage-500 to-sage-600 text-white border-sage-400/50 rounded-2xl':
              variant === 'wellness',
            'hover:from-sage-600 hover:to-sage-700 focus:ring-sage-500/50':
              variant === 'wellness' && !isDisabled,

            // Wellness Outline - Soft bordered button
            'bg-transparent border-2 border-sage-400 text-sage-700 rounded-2xl':
              variant === 'wellness-outline',
            'dark:border-sage-500 dark:text-sage-300':
              variant === 'wellness-outline',
            'hover:bg-sage-50 dark:hover:bg-sage-950/50 focus:ring-sage-400/50':
              variant === 'wellness-outline' && !isDisabled,
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
