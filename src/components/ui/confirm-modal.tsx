'use client';

import { GlassModal } from './glass-modal';
import { GlassButton } from './glass-button';
import { AlertTriangle, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ConfirmModalVariant = 'default' | 'danger' | 'warning' | 'success' | 'info';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmModalVariant;
  isLoading?: boolean;
}

const variantConfig: Record<ConfirmModalVariant, {
  icon: typeof AlertTriangle;
  iconClass: string;
  confirmButtonClass: string;
}> = {
  default: {
    icon: Info,
    iconClass: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
    confirmButtonClass: '',
  },
  danger: {
    icon: AlertTriangle,
    iconClass: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    confirmButtonClass: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
  },
  warning: {
    icon: AlertCircle,
    iconClass: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    confirmButtonClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    confirmButtonClass: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    confirmButtonClass: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="text-center">
        {/* Icon */}
        <div className={cn(
          'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4',
          config.iconClass
        )}>
          <IconComponent className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <GlassButton
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </GlassButton>
          <GlassButton
            variant="primary"
            className={cn('flex-1', config.confirmButtonClass)}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

/**
 * Alert Modal - for simple messages (replaces window.alert)
 */
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  variant?: ConfirmModalVariant;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  variant = 'info',
}: AlertModalProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icon */}
        <div className={cn(
          'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4',
          config.iconClass
        )}>
          <IconComponent className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {message}
        </p>

        {/* Button */}
        <GlassButton
          variant="primary"
          className="w-full"
          onClick={onClose}
        >
          {buttonText}
        </GlassButton>
      </div>
    </GlassModal>
  );
}
