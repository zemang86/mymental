'use client';

import { cn } from '@/lib/utils/cn';

interface GradientBackgroundProps {
  className?: string;
}

/**
 * Simple solid background for the entire app
 * Light mode: white, Dark mode: off-black
 */
export function GradientBackground({ className }: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 -z-10',
        'bg-white dark:bg-[#0a0a0a]',
        className
      )}
    />
  );
}
