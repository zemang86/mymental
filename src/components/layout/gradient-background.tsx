'use client';

import { cn } from '@/lib/utils/cn';

interface GradientBackgroundProps {
  className?: string;
}

/**
 * Animated gradient background with floating orbs
 * Used as the base background for the entire app
 */
export function GradientBackground({ className }: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 overflow-hidden',
        'bg-gradient-to-br from-primary-50 via-primary-100/50 to-teal-50',
        'dark:from-neutral-950 dark:via-primary-950/30 dark:to-neutral-950',
        className
      )}
    >
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-300/40 dark:bg-primary-800/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-primary-400/30 dark:bg-primary-700/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-300/30 dark:bg-teal-800/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
