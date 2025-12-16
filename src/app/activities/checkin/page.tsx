'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Sun, Cloud, CloudRain, Zap, Moon, Home, RotateCcw } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface CheckinQuestion {
  id: string;
  question: string;
  questionMs?: string;
  type: 'mood' | 'scale' | 'choice';
  options?: { label: string; labelMs?: string; value: string; icon?: any; color?: string }[];
}

const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: 'mood',
    question: 'How are you feeling right now?',
    questionMs: 'Bagaimana perasaan anda sekarang?',
    type: 'mood',
    options: [
      { label: 'Great', labelMs: 'Hebat', value: 'great', icon: Sun, color: 'sage' },
      { label: 'Good', labelMs: 'Baik', value: 'good', icon: Cloud, color: 'ocean' },
      { label: 'Okay', labelMs: 'Okay', value: 'okay', icon: Cloud, color: 'warm' },
      { label: 'Low', labelMs: 'Rendah', value: 'low', icon: CloudRain, color: 'lavender' },
      { label: 'Struggling', labelMs: 'Sukar', value: 'struggling', icon: Moon, color: 'neutral' },
    ],
  },
  {
    id: 'energy',
    question: 'How is your energy level today?',
    questionMs: 'Bagaimana tahap tenaga anda hari ini?',
    type: 'scale',
    options: [
      { label: 'Very Low', labelMs: 'Sangat Rendah', value: '1' },
      { label: 'Low', labelMs: 'Rendah', value: '2' },
      { label: 'Medium', labelMs: 'Sederhana', value: '3' },
      { label: 'High', labelMs: 'Tinggi', value: '4' },
      { label: 'Very High', labelMs: 'Sangat Tinggi', value: '5' },
    ],
  },
  {
    id: 'sleep',
    question: 'How did you sleep last night?',
    questionMs: 'Bagaimana tidur anda semalam?',
    type: 'choice',
    options: [
      { label: 'Very well', labelMs: 'Sangat baik', value: 'very_well' },
      { label: 'Pretty good', labelMs: 'Agak baik', value: 'good' },
      { label: 'Not great', labelMs: 'Kurang baik', value: 'not_great' },
      { label: 'Poorly', labelMs: 'Teruk', value: 'poorly' },
    ],
  },
  {
    id: 'stress',
    question: 'What is your stress level right now?',
    questionMs: 'Apakah tahap tekanan anda sekarang?',
    type: 'scale',
    options: [
      { label: 'Very Low', labelMs: 'Sangat Rendah', value: '1' },
      { label: 'Low', labelMs: 'Rendah', value: '2' },
      { label: 'Medium', labelMs: 'Sederhana', value: '3' },
      { label: 'High', labelMs: 'Tinggi', value: '4' },
      { label: 'Very High', labelMs: 'Sangat Tinggi', value: '5' },
    ],
  },
  {
    id: 'gratitude',
    question: 'What is one thing you are grateful for today?',
    questionMs: 'Apakah satu perkara yang anda syukuri hari ini?',
    type: 'choice',
    options: [
      { label: 'Family/Friends', labelMs: 'Keluarga/Kawan', value: 'relationships' },
      { label: 'Health', labelMs: 'Kesihatan', value: 'health' },
      { label: 'Work/Achievement', labelMs: 'Kerja/Pencapaian', value: 'achievement' },
      { label: 'Simple pleasures', labelMs: 'Keseronokan mudah', value: 'simple' },
      { label: 'Nature', labelMs: 'Alam semula jadi', value: 'nature' },
    ],
  },
];

const colorStyles: Record<string, string> = {
  sage: 'bg-sage-100 dark:bg-sage-900/30 border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-300',
  ocean: 'bg-ocean-100 dark:bg-ocean-900/30 border-ocean-300 dark:border-ocean-700 text-ocean-700 dark:text-ocean-300',
  warm: 'bg-warm-100 dark:bg-warm-900/30 border-warm-300 dark:border-warm-700 text-warm-700 dark:text-warm-300',
  lavender: 'bg-lavender-100 dark:bg-lavender-900/30 border-lavender-300 dark:border-lavender-700 text-lavender-700 dark:text-lavender-300',
  neutral: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300',
};

export default function CheckinPage() {
  const router = useRouter();
  const [locale] = useState<'en' | 'ms'>('en');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = CHECKIN_QUESTIONS[currentIndex];

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Small delay for visual feedback
    setTimeout(async () => {
      if (currentIndex < CHECKIN_QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Complete - log activity
        setIsComplete(true);
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase.from('user_activity_logs').insert({
              user_id: user.id,
              activity_type: 'checkin',
              completed_at: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error logging activity:', error);
        }
      }
    }, 300);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsComplete(false);
  };

  const getMoodMessage = () => {
    const mood = answers['mood'];
    const energy = answers['energy'];

    if (mood === 'great' || mood === 'good') {
      return locale === 'ms'
        ? 'Syabas! Teruskan momentum positif ini.'
        : "That's wonderful! Keep nurturing that positive energy.";
    } else if (mood === 'struggling' || mood === 'low') {
      return locale === 'ms'
        ? 'Terima kasih kerana berkongsi. Ingat, tidak mengapa untuk tidak okay.'
        : "Thank you for sharing. Remember, it's okay to not be okay.";
    } else {
      return locale === 'ms'
        ? 'Terima kasih kerana meluangkan masa untuk diri sendiri.'
        : 'Thank you for taking this moment for yourself.';
    }
  };

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
            className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-lavender-600 dark:hover:text-lavender-400 transition-colors mb-6"
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
            <div className="w-14 h-14 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-lavender-600 dark:text-lavender-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {locale === 'ms' ? 'Daftar Masuk Harian' : 'Daily Check-in'}
            </h1>
          </motion.div>

          {/* Check-in Content */}
          {!isComplete ? (
            <div className="wellness-card p-6 md:p-8">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {CHECKIN_QUESTIONS.map((_, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      index === currentIndex
                        ? 'w-8 bg-lavender-500'
                        : index < currentIndex
                        ? 'bg-lavender-400'
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

                  {/* Mood type - larger buttons with icons */}
                  {currentQuestion.type === 'mood' && (
                    <div className="grid grid-cols-5 gap-2">
                      {currentQuestion.options?.map((option) => {
                        const Icon = option.icon;
                        const isSelected = answers[currentQuestion.id] === option.value;

                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className={cn(
                              'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                              isSelected
                                ? colorStyles[option.color || 'neutral']
                                : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-lavender-300 dark:hover:border-lavender-700'
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className={cn(
                              'w-8 h-8',
                              isSelected
                                ? ''
                                : 'text-neutral-400'
                            )} />
                            <span className="text-xs font-medium">
                              {locale === 'ms' ? option.labelMs : option.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Scale type - horizontal scale */}
                  {currentQuestion.type === 'scale' && (
                    <div className="space-y-4">
                      <div className="flex justify-between gap-2">
                        {currentQuestion.options?.map((option, index) => {
                          const isSelected = answers[currentQuestion.id] === option.value;
                          const colors = [
                            'bg-sage-500',
                            'bg-sage-400',
                            'bg-warm-400',
                            'bg-warm-500',
                            'bg-lavender-500',
                          ];

                          return (
                            <motion.button
                              key={option.value}
                              onClick={() => handleAnswer(option.value)}
                              className={cn(
                                'flex-1 py-4 rounded-2xl border-2 transition-all',
                                isSelected
                                  ? `${colors[index]} border-transparent text-white`
                                  : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-lavender-300'
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-lg font-bold">{option.value}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 px-2">
                        <span>{locale === 'ms' ? currentQuestion.options?.[0].labelMs : currentQuestion.options?.[0].label}</span>
                        <span>{locale === 'ms' ? currentQuestion.options?.[4].labelMs : currentQuestion.options?.[4].label}</span>
                      </div>
                    </div>
                  )}

                  {/* Choice type - regular buttons */}
                  {currentQuestion.type === 'choice' && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option) => {
                        const isSelected = answers[currentQuestion.id] === option.value;

                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className={cn(
                              'w-full text-left p-4 rounded-2xl border-2 transition-all',
                              isSelected
                                ? 'border-lavender-400 bg-lavender-50 dark:bg-lavender-900/30'
                                : 'border-warm-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-lavender-300 dark:hover:border-lavender-700'
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span className={cn(
                              'text-neutral-700 dark:text-neutral-200',
                              isSelected && 'text-lavender-700 dark:text-lavender-300 font-medium'
                            )}>
                              {locale === 'ms' ? option.labelMs : option.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="wellness-card p-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <BreathingCircle size="lg" color="lavender" />
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {locale === 'ms' ? 'Terima Kasih' : 'Thank You'}
              </h2>

              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                {getMoodMessage()}
              </p>

              {/* Summary */}
              <div className="bg-warm-50 dark:bg-neutral-800/50 rounded-2xl p-4 mb-8 text-left">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  {locale === 'ms' ? 'Ringkasan Hari Ini' : "Today's Summary"}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {locale === 'ms' ? 'Perasaan' : 'Mood'}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-200 capitalize">
                      {answers['mood']}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {locale === 'ms' ? 'Tenaga' : 'Energy'}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-200">
                      {answers['energy']}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {locale === 'ms' ? 'Tekanan' : 'Stress'}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-200">
                      {answers['stress']}/5
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={handleRestart}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium',
                    'bg-lavender-500 text-white hover:bg-lavender-600 transition-colors'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  {locale === 'ms' ? 'Check-in Lagi' : 'Check-in Again'}
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
