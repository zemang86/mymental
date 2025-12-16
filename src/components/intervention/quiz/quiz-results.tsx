'use client';

import { motion } from 'framer-motion';
import { Check, RefreshCw, Clock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SuccessAnimation, ConfettiAnimation } from '@/components/ui/lottie-animation';

interface QuizResultsProps {
  result: {
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    passingScore: number;
    timeTaken: number | null;
    questionResults: Array<{
      questionId: string;
      userAnswer: any;
      isCorrect: boolean | null;
      correctAnswer?: any;
      explanation?: string;
    }>;
  };
  quiz: any;
  answers: Record<string, any>;
}

// Circular Score Ring
function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
        {/* Background ring */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          className="stroke-warm-200 dark:stroke-neutral-700"
          strokeWidth="8"
        />
        {/* Progress ring */}
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          className={passed ? 'stroke-sage-500' : 'stroke-warm-400'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn(
            'text-3xl font-bold',
            passed ? 'text-sage-600 dark:text-sage-400' : 'text-warm-600 dark:text-warm-400'
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Score</span>
      </div>
    </div>
  );
}

export function QuizResults({ result, quiz, answers }: QuizResultsProps) {
  const { score, passed, correctAnswers, totalQuestions, passingScore, timeTaken } = result;

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Result */}
      <div className="wellness-card p-8">
        <div className="text-center">
          {/* Success/Encourage Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="mb-6 relative"
          >
            {passed ? (
              <>
                {/* Confetti background */}
                <div className="absolute inset-0 -top-8 flex items-center justify-center pointer-events-none">
                  <ConfettiAnimation size="xl" />
                </div>
                {/* Success checkmark */}
                <div className="relative z-10 mx-auto wellness-glow-sage rounded-full">
                  <SuccessAnimation size="lg" />
                </div>
              </>
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center">
                <Heart className="w-12 h-12 text-warm-500 dark:text-warm-400 animate-pulse" />
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'text-2xl font-bold mb-2',
              passed ? 'text-sage-700 dark:text-sage-300' : 'text-warm-700 dark:text-warm-300'
            )}
          >
            {passed ? 'Well Done!' : 'Keep Going!'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto"
          >
            {passed
              ? "You've shown great understanding. Take a moment to appreciate your progress."
              : `You're on the right path. A ${passingScore}% is needed to pass. Take your time and try again when ready.`}
          </motion.p>

          {/* Score Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ScoreRing score={score} passed={passed} />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-4 mt-8 max-w-xs mx-auto"
          >
            <div className="p-4 rounded-2xl bg-warm-50 dark:bg-neutral-800/50">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Correct
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-warm-50 dark:bg-neutral-800/50">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1">
                <Clock className="w-5 h-5 text-neutral-400" />
                {formatTime(timeTaken)}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Time
              </div>
            </div>
          </motion.div>

          {/* Retry Button */}
          {!passed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <motion.button
                onClick={() => window.location.reload()}
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all',
                  'bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300',
                  'hover:bg-warm-200 dark:hover:bg-warm-900/50'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Question Review */}
      <div className="wellness-card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 text-center">
          Review Your Answers
        </h3>

        <div className="space-y-4">
          {quiz.questions.map((question: any, index: number) => {
            const questionResult = result.questionResults.find(
              (r) => r.questionId === question.id
            );

            if (!questionResult) return null;

            const isCorrect = questionResult.isCorrect;
            const isReflection = question.type === 'reflection';

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  'p-5 rounded-2xl border-2 transition-all',
                  isReflection
                    ? 'border-lavender-200 dark:border-lavender-800/50 bg-lavender-50/50 dark:bg-lavender-900/10'
                    : isCorrect
                    ? 'border-sage-200 dark:border-sage-800/50 bg-sage-50/50 dark:bg-sage-900/10'
                    : 'border-warm-200 dark:border-warm-800/50 bg-warm-50/50 dark:bg-warm-900/10'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  {!isReflection && (
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        isCorrect
                          ? 'bg-sage-200 dark:bg-sage-800'
                          : 'bg-warm-200 dark:bg-warm-800'
                      )}
                    >
                      {isCorrect ? (
                        <Check className="w-4 h-4 text-sage-700 dark:text-sage-300" />
                      ) : (
                        <span className="text-sm font-medium text-warm-700 dark:text-warm-300">!</span>
                      )}
                    </div>
                  )}

                  {isReflection && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lavender-200 dark:bg-lavender-800 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-lavender-700 dark:text-lavender-300" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-800 dark:text-neutral-100 mb-3">
                      {index + 1}. {question.question}
                    </p>

                    {!isReflection && (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            Your answer:{' '}
                          </span>
                          <span className={cn(
                            'font-medium',
                            isCorrect
                              ? 'text-sage-700 dark:text-sage-300'
                              : 'text-warm-700 dark:text-warm-300'
                          )}>
                            {Array.isArray(questionResult.userAnswer)
                              ? questionResult.userAnswer.join(', ')
                              : questionResult.userAnswer}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div className="text-sm">
                            <span className="text-neutral-500 dark:text-neutral-400">
                              Correct answer:{' '}
                            </span>
                            <span className="font-medium text-sage-700 dark:text-sage-300">
                              {Array.isArray(questionResult.correctAnswer)
                                ? questionResult.correctAnswer.join(', ')
                                : questionResult.correctAnswer}
                            </span>
                          </div>
                        )}

                        {questionResult.explanation && (
                          <div className="mt-3 p-3 rounded-xl bg-white/60 dark:bg-neutral-800/60">
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                              <span className="font-medium text-sage-700 dark:text-sage-400">Insight:</span>{' '}
                              {questionResult.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {isReflection && (
                      <p className="text-sm text-lavender-600 dark:text-lavender-400 italic">
                        Personal reflection — thank you for sharing
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Encouraging footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-4"
      >
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {passed
            ? "Every step forward is progress. You're doing great."
            : "Learning takes time. Be gentle with yourself."}
        </p>
      </motion.div>
    </div>
  );
}
