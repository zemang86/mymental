'use client';

import { Fragment, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { GlassButton } from './glass-button';

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'emergency';
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'md',
  variant = 'default',
}: GlassModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={cn(
                // Base styles
                'relative w-full rounded-3xl',
                'backdrop-blur-xl border',
                'shadow-2xl',
                // Default variant
                variant === 'default' && [
                  'bg-white/95 dark:bg-neutral-900/95',
                  'border-white/30 dark:border-neutral-700/50',
                ],
                // Emergency variant
                variant === 'emergency' && [
                  'bg-red-50/95 dark:bg-red-950/95',
                  'border-red-300/50 dark:border-red-900/50',
                ],
                // Size variants
                {
                  'max-w-sm': size === 'sm',
                  'max-w-lg': size === 'md',
                  'max-w-2xl': size === 'lg',
                  'max-w-4xl': size === 'xl',
                  'max-w-full h-full rounded-none': size === 'full',
                }
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {showCloseButton && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 p-2 rounded-full"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </GlassButton>
              )}

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                {(title || description) && (
                  <div className="mb-6">
                    {title && (
                      <h2
                        className={cn(
                          'text-2xl font-bold',
                          variant === 'emergency'
                            ? 'text-red-700 dark:text-red-400'
                            : 'text-neutral-900 dark:text-white'
                        )}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        {description}
                      </p>
                    )}
                  </div>
                )}

                {/* Body */}
                {children}
              </div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
