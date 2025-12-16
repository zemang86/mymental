'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
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
      <GlassCard className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Loading quiz...
          </p>
        </div>
      </GlassCard>
    );
  }

  if (!quiz || totalQuestions === 0) {
    return (
      <GlassCard className="p-8">
        <p className="text-center text-neutral-600 dark:text-neutral-400">
          Quiz not found
        </p>
      </GlassCard>
    );
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasAnswer = answers[currentQ.id] !== undefined && answers[currentQ.id] !== null &&
    (Array.isArray(answers[currentQ.id]) ? answers[currentQ.id].length > 0 : answers[currentQ.id] !== '');

  return (
    <GlassCard className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {quiz.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
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
      <div className="flex items-center justify-between">
        <GlassButton
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </GlassButton>

        {isLastQuestion ? (
          <GlassButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!hasAnswer || isSubmitting}
            rightIcon={<CheckCircle className="w-4 h-4" />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </GlassButton>
        ) : (
          <GlassButton
            variant="primary"
            onClick={handleNext}
            disabled={!hasAnswer}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next
          </GlassButton>
        )}
      </div>

      {/* Answer requirement hint */}
      {!hasAnswer && (
        <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mt-4">
          Please select an answer to continue
        </p>
      )}
    </GlassCard>
  );
}
