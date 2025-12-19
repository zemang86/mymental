'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Phone, Heart, ExternalLink, RotateCcw, X, FastForward } from 'lucide-react';
import { GlassButton } from '@/components/ui';
import { MALAYSIA_HOTLINES } from '@/lib/constants/hotlines';
import { useAssessmentStore } from '@/stores/assessment-store';

// TEMPORARY: Show testing controls in all environments for user testing
const showTestingControls = true;

interface EmergencyModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean; // For imminent risk, cannot close
  referralCreated?: boolean; // Show referral confirmation
}

export function EmergencyModal({
  isOpen,
  onClose,
  canClose = false,
  referralCreated = false,
}: EmergencyModalProps) {
  const t = useTranslations('emergencyModal');
  const resetStore = useAssessmentStore((state) => state.reset);

  // Dev reset function
  const handleDevReset = () => {
    resetStore();
    localStorage.removeItem('mymental-assessment');
    window.location.href = '/';
  };

  // Testing bypass - clears emergency state and forces continue
  const handleTestingBypass = () => {
    // Clear the emergency flag from the store
    const store = useAssessmentStore.getState();
    store.clearEmergency?.();
    // Close modal and continue
    onClose?.();
  };
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

  // Allow escape key to close during testing or when canClose is true
  useEffect(() => {
    if (!canClose && !showTestingControls) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [canClose, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - clickable during testing phase */}
          <motion.div
            className="fixed inset-0 z-50 bg-red-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(canClose || showTestingControls) ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border-2 border-red-300 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Red header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3 text-white">
                  <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{t('title')}</h2>
                    <p className="text-red-100 text-sm">
                      {t('subtitle')}
                    </p>
                  </div>
                  {/* Testing Controls - Reset, Bypass & Close buttons in header */}
                  {showTestingControls && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={handleDevReset}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Reset (Testing)"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleTestingBypass}
                        className="p-2 bg-green-500/50 hover:bg-green-500/70 rounded-lg transition-colors"
                        title="Force Continue (Bypass)"
                      >
                        <FastForward className="w-5 h-5" />
                      </button>
                      {onClose && (
                        <button
                          onClick={onClose}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                          title="Tutup / Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {t('message')}
                  </p>
                </div>

                {/* Referral Confirmation */}
                {referralCreated && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
                      <Heart className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                        {t('referralCreatedTitle', { defaultValue: 'Professional Support Requested' })}
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {t('referralCreatedMessage', {
                          defaultValue: 'Our team has been notified and will contact you within 24-48 hours to connect you with a mental health professional. You will also receive an email with additional resources.'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hotlines */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {t('callForHelp')}
                  </h3>

                  {MALAYSIA_HOTLINES.slice(0, 3).map((hotline) => (
                    <a
                      key={hotline.number}
                      href={`tel:${hotline.number.replace(/\s|-/g, '')}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 transition-colors group"
                    >
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:bg-primary-200 transition-colors">
                        <Phone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {hotline.name}
                        </div>
                        <div className="text-lg font-bold text-primary-600">
                          {hotline.number}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {hotline.available}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400" />
                    </a>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <a href="/emergency">
                    <GlassButton variant="danger" className="w-full">
                      <Phone className="w-4 h-4" />
                      {t('viewAllResources')}
                    </GlassButton>
                  </a>

                  {/* Show continue button if canClose OR during testing phase */}
                  {(canClose || showTestingControls) && onClose && (
                    <GlassButton
                      variant="secondary"
                      className="w-full"
                      onClick={onClose}
                    >
                      {t('continueButton')}
                    </GlassButton>
                  )}
                </div>

                {!canClose && !showTestingControls && (
                  <p className="text-center text-sm text-neutral-500">
                    {t('pleaseCall')}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
