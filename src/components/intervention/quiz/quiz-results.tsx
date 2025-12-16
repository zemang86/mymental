'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, Clock, RotateCcw } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

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
      <GlassCard className="p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {passed ? (
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Award className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <RotateCcw className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
            )}
          </motion.div>

          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {passed ? 'Congratulations!' : 'Good Effort!'}
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {passed
              ? 'You passed the quiz! Great job understanding the material.'
              : `You need ${passingScore}% to pass. Review the material and try again.`}
          </p>

          {/* Score Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {score}%
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Your Score
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Correct Answers
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
                <Clock className="w-6 h-6" />
                {formatTime(timeTaken)}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Time Taken
              </div>
            </div>
          </div>

          {!passed && (
            <GlassButton
              variant="primary"
              onClick={() => window.location.reload()}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retake Quiz
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* Question Review */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Answer Review
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
              <div
                key={question.id}
                className={cn(
                  'p-4 rounded-lg border-2',
                  isReflection
                    ? 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50'
                    : isCorrect
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                )}
              >
                <div className="flex items-start gap-3">
                  {!isReflection && (
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-white mb-2">
                      {index + 1}. {question.question}
                    </p>

                    {!isReflection && (
                      <>
                        <div className="text-sm mb-1">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Your answer:{' '}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {Array.isArray(questionResult.userAnswer)
                              ? questionResult.userAnswer.join(', ')
                              : questionResult.userAnswer}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div className="text-sm mb-2">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Correct answer:{' '}
                            </span>
                            <span className="font-medium text-green-700 dark:text-green-400">
                              {Array.isArray(questionResult.correctAnswer)
                                ? questionResult.correctAnswer.join(', ')
                                : questionResult.correctAnswer}
                            </span>
                          </div>
                        )}

                        {questionResult.explanation && (
                          <div className="mt-2 p-3 rounded bg-neutral-100 dark:bg-neutral-700/50">
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                              <strong>Explanation:</strong> {questionResult.explanation}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {isReflection && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                        Reflection question - not graded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
