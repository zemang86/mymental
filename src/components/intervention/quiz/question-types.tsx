'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BaseQuestionProps {
  question: string;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

// Multiple Choice Question - Wellness Style
interface MultipleChoiceProps extends BaseQuestionProps {
  options: string[];
}

export function MultipleChoiceQuestion({
  question,
  options,
  value,
  onChange,
  disabled,
}: MultipleChoiceProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed">
        {question}
      </p>
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = value === option;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: disabled ? 1 : 1.01 }}
              whileTap={{ scale: disabled ? 1 : 0.99 }}
              onClick={() => !disabled && onChange(option)}
              disabled={disabled}
              className={cn(
                'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/30 dark:border-sage-600 wellness-glow-sage'
                  : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-sage-300 dark:hover:border-sage-700',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'border-sage-500 bg-sage-500'
                      : 'border-warm-300 dark:border-neutral-600'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-white"
                    />
                  )}
                </div>
                <span className={cn(
                  'text-neutral-700 dark:text-neutral-200',
                  isSelected && 'text-sage-800 dark:text-sage-200 font-medium'
                )}>
                  {option}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// True/False Question - Wellness Style
export function TrueFalseQuestion({
  question,
  value,
  onChange,
  disabled,
}: BaseQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed">
        {question}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {['True', 'False'].map((option) => {
          const isSelected = value === option;
          return (
            <motion.button
              key={option}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              onClick={() => !disabled && onChange(option)}
              disabled={disabled}
              className={cn(
                'p-6 rounded-2xl border-2 font-medium transition-all duration-200 text-center',
                isSelected
                  ? option === 'True'
                    ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 wellness-glow-sage'
                    : 'border-warm-400 bg-warm-50 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300'
                  : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 hover:border-sage-300 dark:hover:border-sage-700',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Checkbox (Multiple Select) Question - Wellness Style
interface CheckboxProps extends BaseQuestionProps {
  options: string[];
  value: string[];
}

export function CheckboxQuestion({
  question,
  options,
  value = [],
  onChange,
  disabled,
}: CheckboxProps) {
  const handleToggle = (option: string) => {
    if (disabled) return;

    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];

    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed">
        {question}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Select all that apply
      </p>
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = value.includes(option);
          return (
            <motion.button
              key={index}
              whileHover={{ scale: disabled ? 1 : 1.01 }}
              whileTap={{ scale: disabled ? 1 : 0.99 }}
              onClick={() => handleToggle(option)}
              disabled={disabled}
              className={cn(
                'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/30 dark:border-sage-600'
                  : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-sage-300 dark:hover:border-sage-700',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'border-sage-500 bg-sage-500'
                      : 'border-warm-300 dark:border-neutral-600'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
                <span className={cn(
                  'text-neutral-700 dark:text-neutral-200',
                  isSelected && 'text-sage-800 dark:text-sage-200 font-medium'
                )}>
                  {option}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Reflection (Open-ended) Question - Wellness Style
export function ReflectionQuestion({
  question,
  value,
  onChange,
  disabled,
}: BaseQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed">
        {question}
      </p>
      <p className="text-sm text-sage-600 dark:text-sage-400">
        Take a moment to reflect and share your thoughts
      </p>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your reflection here..."
        rows={6}
        className={cn(
          'w-full p-4 rounded-2xl border-2 transition-all duration-200',
          'border-warm-200 dark:border-neutral-700',
          'bg-white dark:bg-neutral-800/50',
          'text-neutral-800 dark:text-neutral-100',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 dark:focus:ring-sage-800',
          'resize-none',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
        This is for your personal reflection and won't be graded
      </p>
    </div>
  );
}
