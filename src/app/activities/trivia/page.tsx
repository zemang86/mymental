'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, Check, X, Sparkles, RotateCcw, Home } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface TriviaQuestion {
  id: string;
  question: string;
  questionMs?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationMs?: string;
}

// Sample trivia questions - in production these could come from DB
const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: '1',
    question: 'What hormone is often called the "feel-good" hormone?',
    questionMs: 'Hormon apa yang sering dipanggil hormon "rasa gembira"?',
    options: ['Cortisol', 'Serotonin', 'Adrenaline', 'Insulin'],
    correctIndex: 1,
    explanation: 'Serotonin helps regulate mood, sleep, and appetite. Low levels are associated with depression.',
    explanationMs: 'Serotonin membantu mengawal mood, tidur, dan selera makan. Tahap rendah dikaitkan dengan kemurungan.',
  },
  {
    id: '2',
    question: 'How many hours of sleep do most adults need per night?',
    questionMs: 'Berapa jam tidur yang diperlukan oleh kebanyakan orang dewasa setiap malam?',
    options: ['4-5 hours', '5-6 hours', '7-9 hours', '10-12 hours'],
    correctIndex: 2,
    explanation: 'Most adults need 7-9 hours of quality sleep for optimal mental and physical health.',
    explanationMs: 'Kebanyakan orang dewasa memerlukan 7-9 jam tidur berkualiti untuk kesihatan mental dan fizikal yang optimum.',
  },
  {
    id: '3',
    question: 'Which activity has been shown to reduce anxiety?',
    questionMs: 'Aktiviti mana yang telah terbukti mengurangkan kebimbangan?',
    options: ['Scrolling social media', 'Deep breathing', 'Skipping meals', 'Staying indoors'],
    correctIndex: 1,
    explanation: 'Deep breathing activates the parasympathetic nervous system, helping to calm the body and mind.',
    explanationMs: 'Pernafasan dalam mengaktifkan sistem saraf parasimpatetik, membantu menenangkan badan dan minda.',
  },
  {
    id: '4',
    question: 'What percentage of mental health conditions begin before age 24?',
    questionMs: 'Berapa peratus keadaan kesihatan mental bermula sebelum umur 24 tahun?',
    options: ['25%', '50%', '75%', '90%'],
    correctIndex: 2,
    explanation: '75% of mental health conditions develop by age 24, highlighting the importance of early intervention.',
    explanationMs: '75% keadaan kesihatan mental berkembang sebelum umur 24, menekankan kepentingan intervensi awal.',
  },
  {
    id: '5',
    question: 'Which of these is a healthy coping mechanism?',
    questionMs: 'Yang mana satu adalah mekanisme mengatasi yang sihat?',
    options: ['Isolating yourself', 'Substance use', 'Talking to someone you trust', 'Suppressing emotions'],
    correctIndex: 2,
    explanation: 'Social support is one of the most effective ways to cope with stress and difficult emotions.',
    explanationMs: 'Sokongan sosial adalah salah satu cara paling berkesan untuk mengatasi tekanan dan emosi sukar.',
  },
  {
    id: '6',
    question: 'How long does it take for exercise to start improving mood?',
    questionMs: 'Berapa lama senaman mula memperbaiki mood?',
    options: ['Immediately after', '1 week', '1 month', '3 months'],
    correctIndex: 0,
    explanation: 'Exercise releases endorphins almost immediately, which can improve mood right after a workout.',
    explanationMs: 'Senaman melepaskan endorfin hampir serta-merta, yang boleh memperbaiki mood sejurus selepas bersenam.',
  },
  {
    id: '7',
    question: 'What is mindfulness?',
    questionMs: 'Apa itu kesedaran penuh (mindfulness)?',
    options: ['Thinking about the future', 'Analyzing past events', 'Being present in the moment', 'Multitasking'],
    correctIndex: 2,
    explanation: 'Mindfulness is the practice of being fully present and engaged in the current moment.',
    explanationMs: 'Kesedaran penuh adalah amalan hadir sepenuhnya dan terlibat dalam momen semasa.',
  },
  {
    id: '8',
    question: 'Which vitamin deficiency is linked to depression?',
    questionMs: 'Kekurangan vitamin mana yang dikaitkan dengan kemurungan?',
    options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'],
    correctIndex: 2,
    explanation: 'Vitamin D deficiency has been linked to depression. Sunlight exposure helps the body produce it.',
    explanationMs: 'Kekurangan Vitamin D telah dikaitkan dengan kemurungan. Pendedahan cahaya matahari membantu badan menghasilkannya.',
  },
];

export default function TriviaPage() {
  const router = useRouter();
  const [locale] = useState<'en' | 'ms'>('en');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle and pick 5 random questions on mount
  useEffect(() => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (showResult) return;

    setSelectedAnswer(index);
    setShowResult(true);

    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete - log activity
      setIsComplete(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          await supabase.from('user_activity_logs').insert({
            user_id: user.id,
            activity_type: 'trivia',
            completed_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    }
  };

  const handleRestart = () => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <BreathingCircle size="lg" color="sage" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/activities')}
            className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            {locale === 'ms' ? 'Kembali' : 'Back'}
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-sage-600 dark:text-sage-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {locale === 'ms' ? 'Trivia Pengetahuan' : 'Knowledge Trivia'}
            </h1>
          </motion.div>

          {/* Quiz Content */}
          {!isComplete ? (
            <div className="wellness-card p-6 md:p-8">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {questions.map((_, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      index === currentIndex
                        ? 'w-8 bg-sage-500'
                        : index < currentIndex
                        ? 'bg-sage-400'
                        : 'bg-warm-200 dark:bg-neutral-700'
                    )}
                    animate={index === currentIndex ? { scale: [1, 1.1, 1] } : {}}
                    transition={index === currentIndex ? { repeat: Infinity, duration: 2 } : {}}
                  />
                ))}
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-6 text-center">
                    {locale === 'ms' ? currentQuestion.questionMs || currentQuestion.question : currentQuestion.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuestion.correctIndex;
                      const showCorrect = showResult && isCorrect;
                      const showWrong = showResult && isSelected && !isCorrect;

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={showResult}
                          className={cn(
                            'w-full text-left p-4 rounded-2xl border-2 transition-all',
                            showCorrect
                              ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/30'
                              : showWrong
                              ? 'border-warm-400 bg-warm-50 dark:bg-warm-900/30'
                              : isSelected
                              ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/30'
                              : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-sage-300 dark:hover:border-sage-700',
                            showResult && 'cursor-default'
                          )}
                          whileHover={!showResult ? { scale: 1.01 } : {}}
                          whileTap={!showResult ? { scale: 0.99 } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              showCorrect
                                ? 'bg-sage-500 text-white'
                                : showWrong
                                ? 'bg-warm-500 text-white'
                                : 'bg-warm-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                            )}>
                              {showCorrect ? (
                                <Check className="w-4 h-4" />
                              ) : showWrong ? (
                                <X className="w-4 h-4" />
                              ) : (
                                String.fromCharCode(65 + index)
                              )}
                            </div>
                            <span className={cn(
                              'text-neutral-700 dark:text-neutral-200',
                              (showCorrect || isSelected) && 'font-medium'
                            )}>
                              {option}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-2xl bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800/50"
                    >
                      <p className="text-sm text-sage-800 dark:text-sage-200">
                        <span className="font-medium">
                          {locale === 'ms' ? 'Penjelasan: ' : 'Explanation: '}
                        </span>
                        {locale === 'ms' ? currentQuestion.explanationMs || currentQuestion.explanation : currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next Button */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex justify-center"
                >
                  <motion.button
                    onClick={handleNext}
                    className={cn(
                      'inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium',
                      'bg-sage-500 text-white hover:bg-sage-600 transition-colors'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentIndex < questions.length - 1
                      ? (locale === 'ms' ? 'Seterusnya' : 'Next')
                      : (locale === 'ms' ? 'Lihat Keputusan' : 'See Results')}
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="wellness-card p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-sage-600 dark:text-sage-400" />
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {score >= 4
                  ? (locale === 'ms' ? 'Hebat!' : 'Excellent!')
                  : score >= 3
                  ? (locale === 'ms' ? 'Bagus!' : 'Good Job!')
                  : (locale === 'ms' ? 'Teruskan Belajar!' : 'Keep Learning!')}
              </h2>

              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {locale === 'ms'
                  ? `Anda mendapat ${score} daripada ${questions.length} soalan betul`
                  : `You got ${score} out of ${questions.length} questions correct`}
              </p>

              {/* Score visualization */}
              <div className="flex justify-center gap-2 mb-8">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-4 h-4 rounded-full',
                      index < score
                        ? 'bg-sage-500'
                        : 'bg-warm-200 dark:bg-neutral-700'
                    )}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={handleRestart}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium',
                    'bg-sage-500 text-white hover:bg-sage-600 transition-colors'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  {locale === 'ms' ? 'Main Lagi' : 'Play Again'}
                </motion.button>

                <motion.button
                  onClick={() => router.push('/activities')}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium',
                    'bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300',
                    'hover:bg-warm-200 dark:hover:bg-warm-900/50 transition-colors'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-4 h-4" />
                  {locale === 'ms' ? 'Aktiviti Lain' : 'More Activities'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
