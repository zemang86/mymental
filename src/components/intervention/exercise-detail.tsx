'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PlayCircle,
  PauseCircle,
  RotateCcw,
} from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
import { QuizContainer } from './quiz';
import type { InterventionChapter } from '@/lib/interventions/modules';

interface ExerciseDetailProps {
  chapter: InterventionChapter;
  onComplete: (notes?: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  locale?: 'en' | 'ms';
}

export function ExerciseDetail({
  chapter,
  onComplete,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  locale = 'en',
}: ExerciseDetailProps) {
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);

  // Always check if chapter has quiz (don't rely on hasQuiz flag)
  useEffect(() => {
    async function fetchQuizId() {
      if (!chapter.id) return;

      try {
        const response = await fetch(`/api/v1/intervention/chapter/${chapter.id}/quiz`);
        const data = await response.json();
        if (data.success && data.quizId) {
          setQuizId(data.quizId);
        } else {
          setQuizId(null);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setQuizId(null);
      }
    }

    // Reset quiz state when chapter changes
    setQuizId(null);
    setShowQuiz(false);
    setQuizPassed(false);
    fetchQuizId();
  }, [chapter.id]);

  const title = locale === 'ms' ? chapter.titleMs : chapter.title;
  const description = locale === 'ms' ? chapter.descriptionMs : chapter.description;
  const steps = chapter.exerciseSteps || [];

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleMarkComplete = () => {
    // If chapter has quiz and hasn't been passed yet, show quiz first
    if (quizId && !quizPassed && !showQuiz) {
      setShowQuiz(true);
      return;
    }

    // Complete the chapter
    onComplete(notes || undefined);
  };

  const handleQuizComplete = (passed: boolean, score: number) => {
    setQuizPassed(passed);
    if (passed) {
      // Auto-complete chapter after passing quiz
      setTimeout(() => {
        onComplete(notes || undefined);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h2>
          {chapter.estimatedDuration && (
            <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
              <Clock className="w-4 h-4" />
              {chapter.estimatedDuration} {locale === 'ms' ? 'minit' : 'min'}
            </p>
          )}
        </div>
        {chapter.isCompleted && (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
            <CheckCircle className="w-5 h-5" />
            {locale === 'ms' ? 'Selesai' : 'Completed'}
          </span>
        )}
      </div>

      {/* Content */}
      <GlassCard>
        <div className="prose dark:prose-invert max-w-none">
          {description && (
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              {description}
            </p>
          )}

          {chapter.content && (
            <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
              {chapter.content.slice(0, 2000)}
              {chapter.content.length > 2000 && '...'}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Exercise Steps */}
      {steps.length > 0 && (
        <GlassCard>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            {locale === 'ms' ? 'Langkah-langkah' : 'Steps'}
          </h3>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  index === currentStep
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700'
                    : index < currentStep
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-neutral-50 dark:bg-neutral-800/50'
                }`}
              >
                <button
                  onClick={() => setCurrentStep(index)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : index === currentStep ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-400" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`${
                    index === currentStep
                      ? 'text-neutral-900 dark:text-white font-medium'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {step}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Sebelum' : 'Previous'}
            </GlassButton>
            <span className="text-sm text-neutral-500">
              {currentStep + 1} / {steps.length}
            </span>
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
            >
              {locale === 'ms' ? 'Seterusnya' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Timer (for timed exercises) */}
      {chapter.estimatedDuration && (
        <GlassCard className="text-center">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            {locale === 'ms' ? 'Pemasa Latihan' : 'Exercise Timer'}
          </h3>
          <div className="text-3xl font-mono font-bold text-neutral-900 dark:text-white mb-4">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex items-center justify-center gap-3">
            <GlassButton
              variant={isTimerRunning ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? (
                <>
                  <PauseCircle className="w-4 h-4 mr-1" />
                  {locale === 'ms' ? 'Jeda' : 'Pause'}
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-1" />
                  {locale === 'ms' ? 'Mula' : 'Start'}
                </>
              )}
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => {
                setElapsedTime(0);
                setIsTimerRunning(false);
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Set Semula' : 'Reset'}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Quiz */}
      {showQuiz && quizId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <QuizContainer quizId={quizId} onComplete={handleQuizComplete} />
        </motion.div>
      )}

      {/* Notes */}
      {!showQuiz && (
        <GlassCard>
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {locale === 'ms' ? 'Nota Peribadi (Pilihan)' : 'Personal Notes (Optional)'}
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            locale === 'ms'
              ? 'Tulis refleksi atau nota anda di sini...'
              : 'Write your reflections or notes here...'
          }
          className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
      </GlassCard>
      )}

      {/* Action Buttons */}
      {!showQuiz && (
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {hasPrevious && (
            <GlassButton variant="ghost" onClick={onPrevious}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Sebelumnya' : 'Previous'}
            </GlassButton>
          )}
        </div>

        <div className="flex gap-2">
          {/* Show Take Quiz button if chapter has quiz */}
          {quizId && (
            <GlassButton
              variant={chapter.isCompleted ? 'secondary' : 'primary'}
              onClick={() => setShowQuiz(true)}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              {chapter.isCompleted
                ? (locale === 'ms' ? 'Ulang Kuiz' : 'Retake Quiz')
                : (locale === 'ms' ? 'Ambil Kuiz' : 'Take Quiz')
              }
            </GlassButton>
          )}
          {!chapter.isCompleted && !quizId && (
            <GlassButton variant="primary" onClick={handleMarkComplete}>
              <CheckCircle className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Tandakan Selesai' : 'Mark Complete'}
            </GlassButton>
          )}
          {hasNext && (
            <GlassButton variant={chapter.isCompleted ? 'primary' : 'secondary'} onClick={onNext}>
              {locale === 'ms' ? 'Seterusnya' : 'Next Chapter'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </GlassButton>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
