'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              'w-full rounded-xl px-4 py-3 transition-all duration-300',
              // Input styling using CSS variables
              'bg-[var(--input-bg)] text-[var(--input-text)]',
              'border border-[var(--input-border)]',
              'backdrop-blur-lg',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
              'focus:border-primary-500',
              'focus:bg-white/90 dark:focus:bg-neutral-800',
              // Placeholder
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              // Error state
              error && 'border-red-400 focus:ring-red-500/50 focus:border-red-400',
              // Disabled state
              'disabled:opacity-50 disabled:cursor-not-allowed',
              // Icon padding
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-neutral-500">{hint}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export { GlassInput };
