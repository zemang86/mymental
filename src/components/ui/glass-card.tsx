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
          // Glass effect using CSS variables
          'bg-[var(--card-bg)] border-[var(--card-border)]',
          'shadow-lg shadow-[var(--glass-shadow)]',
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
            'p-4 rounded-xl opacity-80': variant === 'subtle',
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
