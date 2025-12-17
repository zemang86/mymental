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
  Video,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;
import { GlassCard, GlassButton } from '@/components/ui';
import { QuizContainer } from './quiz';
import { ContentRenderer } from './content-renderer';
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
            <p className="text-sm text-sage-600 dark:text-sage-400 flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4" />
              {chapter.estimatedDuration} {locale === 'ms' ? 'minit' : 'min'}
            </p>
          )}
        </div>
        {chapter.isCompleted && (
          <span className="flex items-center gap-1 text-sage-600 dark:text-sage-400 text-sm font-medium bg-sage-50 dark:bg-sage-900/30 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-4 h-4" />
            {locale === 'ms' ? 'Selesai' : 'Completed'}
          </span>
        )}
      </div>

      {/* Video (if available) */}
      {chapter.videoUrl && (
        <GlassCard className="overflow-hidden p-0">
          <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden">
            <ReactPlayer
              url={chapter.videoUrl}
              width="100%"
              height="100%"
              controls
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                  },
                },
                vimeo: {
                  playerOptions: {
                    byline: false,
                    portrait: false,
                  },
                },
              } as any}
            />
          </div>
          {chapter.videoTitle && (
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Video className="w-4 h-4" />
                <span>{locale === 'ms' ? chapter.videoTitleMs || chapter.videoTitle : chapter.videoTitle}</span>
                {chapter.videoDurationSeconds && (
                  <span className="text-neutral-400">
                    ({Math.floor(chapter.videoDurationSeconds / 60)} min)
                  </span>
                )}
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Summary (if available from edited content) */}
      {chapter.summary && (
        <GlassCard className="bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800">
          <p className="text-sage-800 dark:text-sage-200 leading-relaxed">
            {locale === 'ms' ? chapter.summaryMs || chapter.summary : chapter.summary}
          </p>
        </GlassCard>
      )}

      {/* Content */}
      <GlassCard>
        {description && (
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-lg leading-relaxed">
            {description}
          </p>
        )}

        {chapter.content && (
          <ContentRenderer content={chapter.content} />
        )}
      </GlassCard>

      {/* Exercise Steps */}
      {steps.length > 0 && (
        <GlassCard>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sage-500" />
            {locale === 'ms' ? 'Langkah-langkah' : 'Steps'}
          </h3>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-2xl transition-colors ${
                  index === currentStep
                    ? 'bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700'
                    : index < currentStep
                    ? 'bg-sage-100/50 dark:bg-sage-900/10'
                    : 'bg-warm-50 dark:bg-neutral-800/50'
                }`}
              >
                <button
                  onClick={() => setCurrentStep(index)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-sage-500" />
                  ) : index === currentStep ? (
                    <div className="w-5 h-5 rounded-full border-2 border-sage-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-sage-500" />
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
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-200 dark:border-sage-800">
            <GlassButton
              variant="wellness-outline"
              size="sm"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Sebelum' : 'Previous'}
            </GlassButton>
            <span className="text-sm text-sage-600 dark:text-sage-400 font-medium">
              {currentStep + 1} / {steps.length}
            </span>
            <GlassButton
              variant="wellness-outline"
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
          <h3 className="text-sm font-medium text-sage-600 dark:text-sage-400 mb-2">
            {locale === 'ms' ? 'Pemasa Latihan' : 'Exercise Timer'}
          </h3>
          <div className="text-3xl font-mono font-bold text-sage-700 dark:text-sage-300 mb-4">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex items-center justify-center gap-3">
            <GlassButton
              variant={isTimerRunning ? 'wellness-outline' : 'wellness'}
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
              variant="wellness-outline"
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
        <h3 className="text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
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
          className="w-full p-3 rounded-2xl bg-warm-50 dark:bg-neutral-800 border border-sage-200 dark:border-sage-800 text-neutral-900 dark:text-white placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400"
          rows={3}
        />
      </GlassCard>
      )}

      {/* Action Buttons */}
      {!showQuiz && (
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {hasPrevious && (
            <GlassButton variant="wellness-outline" onClick={onPrevious}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Sebelumnya' : 'Previous'}
            </GlassButton>
          )}
        </div>

        <div className="flex gap-2">
          {/* Show Take Quiz button if chapter has quiz */}
          {quizId && (
            <GlassButton
              variant={chapter.isCompleted ? 'wellness-outline' : 'wellness'}
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
            <GlassButton variant="wellness" onClick={handleMarkComplete}>
              <CheckCircle className="w-4 h-4 mr-1" />
              {locale === 'ms' ? 'Tandakan Selesai' : 'Mark Complete'}
            </GlassButton>
          )}
          {hasNext && (
            <GlassButton variant={chapter.isCompleted ? 'wellness' : 'wellness-outline'} onClick={onNext}>
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
