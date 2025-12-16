'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface BaseQuestionProps {
  question: string;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

// Multiple Choice Question
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
    <div className="space-y-3">
      <p className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
        {question}
      </p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={cn(
              'w-full text-left p-4 rounded-lg border-2 transition-all',
              'hover:shadow-md',
              value === option
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  value === option
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-neutral-300 dark:border-neutral-600'
                )}
              >
                {value === option && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-neutral-700 dark:text-neutral-200">
                {option}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// True/False Question
export function TrueFalseQuestion({
  question,
  value,
  onChange,
  disabled,
}: BaseQuestionProps) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
        {question}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {['True', 'False'].map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={cn(
              'p-6 rounded-lg border-2 font-medium transition-all',
              value === option
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Checkbox (Multiple Select) Question
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
    <div className="space-y-3">
      <p className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
        {question}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
        Select all that apply
      </p>
      <div className="space-y-2">
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
                'w-full text-left p-4 rounded-lg border-2 transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center',
                    isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-300 dark:border-neutral-600'
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-neutral-700 dark:text-neutral-200">
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

// Reflection (Open-ended) Question
export function ReflectionQuestion({
  question,
  value,
  onChange,
  disabled,
}: BaseQuestionProps) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
        {question}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
        Take a moment to reflect and share your thoughts
      </p>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your reflection here..."
        rows={6}
        className={cn(
          'w-full p-4 rounded-lg border-2',
          'border-neutral-200 dark:border-neutral-700',
          'bg-white dark:bg-neutral-800',
          'text-neutral-900 dark:text-white',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'resize-none',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        This is not graded - it's for your personal reflection
      </p>
    </div>
  );
}
