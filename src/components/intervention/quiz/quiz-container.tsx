'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  CheckboxQuestion,
  ReflectionQuestion,
} from './question-types';
import { QuizResults } from './quiz-results';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'checkbox' | 'reflection';
  question: string;
  questionMs?: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  explanationMs?: string;
  isGraded: boolean;
}

interface QuizContainerProps {
  quizId: string;
  onComplete?: (passed: boolean, score: number) => void;
}

// Progress Dots Component
function ProgressDots({
  total,
  current,
  answered,
}: {
  total: number;
  current: number;
  answered: Record<string, any>;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isAnswered = Object.keys(answered).length > index;
        const isCurrent = index === current;

        return (
          <motion.div
            key={index}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              isCurrent
                ? 'w-8 bg-sage-500'
                : isAnswered
                ? 'bg-sage-400'
                : 'bg-warm-200 dark:bg-neutral-700'
            )}
            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
            transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
          />
        );
      })}
    </div>
  );
}

export function QuizContainer({ quizId, onComplete }: QuizContainerProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(new Date().toISOString());

  // Fetch quiz on mount
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/v1/intervention/quiz/${quizId}`);
        const data = await response.json();

        if (data.success) {
          setQuiz(data.quiz);
        } else {
          console.error('Failed to load quiz');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, [quizId]);

  const questions: QuizQuestion[] = quiz?.questions || [];
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];

  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [currentQ.id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/intervention/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          answers,
          startTime,
          endTime: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
        onComplete?.(data.result.passed, data.result.score);
      } else {
        console.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show results if quiz is completed
  if (result) {
    return <QuizResults result={result} quiz={quiz} answers={answers} />;
  }

  if (isLoading) {
    return (
      <div className="wellness-card p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <BreathingCircle size="lg" color="sage" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  if (!quiz || totalQuestions === 0) {
    return (
      <div className="wellness-card p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-warm-400" />
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Quiz not found
        </p>
      </div>
    );
  }

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasAnswer = answers[currentQ.id] !== undefined && answers[currentQ.id] !== null &&
    (Array.isArray(answers[currentQ.id]) ? answers[currentQ.id].length > 0 : answers[currentQ.id] !== '');

  return (
    <div className="wellness-card p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          {quiz.title}
        </h2>

        {/* Progress Dots */}
        <ProgressDots
          total={totalQuestions}
          current={currentQuestion}
          answered={answers}
        />

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
          {currentQuestion + 1} of {totalQuestions}
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {currentQ.type === 'multiple_choice' && (
            <MultipleChoiceQuestion
              question={currentQ.question}
              options={currentQ.options || []}
              value={answers[currentQ.id]}
              onChange={handleAnswerChange}
            />
          )}

          {currentQ.type === 'true_false' && (
            <TrueFalseQuestion
              question={currentQ.question}
              value={answers[currentQ.id]}
              onChange={handleAnswerChange}
            />
          )}

          {currentQ.type === 'checkbox' && (
            <CheckboxQuestion
              question={currentQ.question}
              options={currentQ.options || []}
              value={answers[currentQ.id] || []}
              onChange={handleAnswerChange}
            />
          )}

          {currentQ.type === 'reflection' && (
            <ReflectionQuestion
              question={currentQ.question}
              value={answers[currentQ.id]}
              onChange={handleAnswerChange}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <motion.button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all',
            'bg-warm-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
            'hover:bg-warm-200 dark:hover:bg-neutral-700',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: currentQuestion === 0 ? 1 : 1.02 }}
          whileTap={{ scale: currentQuestion === 0 ? 1 : 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {isLastQuestion ? (
          <motion.button
            onClick={handleSubmit}
            disabled={!hasAnswer || isSubmitting}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all',
              'bg-sage-500 text-white hover:bg-sage-600',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            whileHover={{ scale: !hasAnswer || isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: !hasAnswer || isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Complete
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all',
              'bg-sage-500 text-white hover:bg-sage-600',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            whileHover={{ scale: !hasAnswer ? 1 : 1.02 }}
            whileTap={{ scale: !hasAnswer ? 1 : 0.98 }}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Answer hint */}
      {!hasAnswer && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-center text-sage-600 dark:text-sage-400 mt-6"
        >
          Select an answer to continue
        </motion.p>
      )}
    </div>
  );
}
