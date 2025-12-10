'use client';

import { cn } from '@/lib/utils/cn';
import type { RiskLevel } from '@/types/assessment';
import { AlertTriangle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    labelMs: 'Risiko Rendah',
    icon: CheckCircle,
    classes: 'bg-green-100/80 text-green-700 border-green-200',
    darkClasses: 'dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  },
  moderate: {
    label: 'Moderate',
    labelMs: 'Sederhana',
    icon: AlertCircle,
    classes: 'bg-yellow-100/80 text-yellow-700 border-yellow-200',
    darkClasses: 'dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  },
  high: {
    label: 'High Risk',
    labelMs: 'Risiko Tinggi',
    icon: AlertTriangle,
    classes: 'bg-orange-100/80 text-orange-700 border-orange-200',
    darkClasses: 'dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  },
  imminent: {
    label: 'Needs Attention',
    labelMs: 'Perlu Perhatian',
    icon: XCircle,
    classes: 'bg-red-100/80 text-red-700 border-red-200',
    darkClasses: 'dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  },
};

export function RiskBadge({
  level,
  showIcon = true,
  showLabel = true,
  size = 'md',
  className,
}: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        'backdrop-blur-sm border',
        config.classes,
        config.darkClasses,
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-4 py-1.5 text-base': size === 'lg',
        },
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn({
            'w-3 h-3': size === 'sm',
            'w-4 h-4': size === 'md',
            'w-5 h-5': size === 'lg',
          })}
        />
      )}
      {showLabel && config.label}
    </span>
  );
}

// Severity indicator for conditions (used in results page)
export interface SeverityBadgeProps {
  severity: 'mild' | 'moderate' | 'severe' | 'very_severe';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const severityConfig = {
  mild: {
    label: 'Mild',
    classes: 'bg-green-100/80 text-green-700 border-green-200',
    darkClasses: 'dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  },
  moderate: {
    label: 'Moderate',
    classes: 'bg-yellow-100/80 text-yellow-700 border-yellow-200',
    darkClasses: 'dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  },
  severe: {
    label: 'Severe',
    classes: 'bg-orange-100/80 text-orange-700 border-orange-200',
    darkClasses: 'dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  },
  very_severe: {
    label: 'Severely affected',
    classes: 'bg-red-100/80 text-red-700 border-red-200',
    darkClasses: 'dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  },
};

export function SeverityBadge({ severity, size = 'md', className }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        'backdrop-blur-sm border',
        config.classes,
        config.darkClasses,
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-4 py-1.5 text-base': size === 'lg',
        },
        className
      )}
    >
      {config.label}
    </span>
  );
}
