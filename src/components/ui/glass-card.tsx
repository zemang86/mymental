'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'subtle' | 'wellness' | 'wellness-soft';
  blur?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  hover?: boolean;
  asChild?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      blur = 'lg',
      hover = true,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-2xl border transition-all duration-300',
          // Glass effect using CSS variables
          'bg-[var(--card-bg)] border-[var(--card-border)]',
          'shadow-lg shadow-[var(--glass-shadow)]',
          // Backdrop blur variants
          {
            'backdrop-blur-sm': blur === 'sm',
            'backdrop-blur-md': blur === 'md',
            'backdrop-blur-lg': blur === 'lg',
            'backdrop-blur-xl': blur === 'xl',
            'backdrop-blur-none': blur === 'none',
          },
          // Variant styles
          {
            // Default - subtle warm tint for wellness feel
            'p-6 bg-warm-50/50 dark:bg-neutral-900/80 border-warm-100 dark:border-neutral-800': variant === 'default',
            'p-8 shadow-xl rounded-3xl bg-warm-50 dark:bg-neutral-900 border-warm-200 dark:border-neutral-800': variant === 'elevated',
            'p-4 rounded-xl opacity-80': variant === 'subtle',
            // Wellness - Warm, soft card with rounded corners
            'p-6 rounded-3xl bg-warm-50 border-warm-200 dark:bg-neutral-900 dark:border-sage-800/30':
              variant === 'wellness',
            // Wellness Soft - Even softer with sage tint
            'p-5 rounded-2xl bg-sage-50/50 border-sage-200/50 dark:bg-sage-950/20 dark:border-sage-700/20':
              variant === 'wellness-soft',
          },
          // Hover effect
          hover && 'hover:shadow-xl hover:-translate-y-0.5',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
