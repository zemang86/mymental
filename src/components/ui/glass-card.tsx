'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'subtle';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
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
          // Glass effect
          'bg-white/70 dark:bg-neutral-900/70',
          'border-white/20 dark:border-neutral-700/30',
          'shadow-lg shadow-black/5 dark:shadow-black/20',
          // Backdrop blur variants
          {
            'backdrop-blur-sm': blur === 'sm',
            'backdrop-blur-md': blur === 'md',
            'backdrop-blur-lg': blur === 'lg',
            'backdrop-blur-xl': blur === 'xl',
          },
          // Variant styles
          {
            'p-6': variant === 'default',
            'p-8 shadow-xl rounded-3xl': variant === 'elevated',
            'p-4 bg-white/50 dark:bg-neutral-900/50 rounded-xl': variant === 'subtle',
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
