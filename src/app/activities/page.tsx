'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Heart, Sparkles, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

const ACTIVITIES = [
  {
    id: 'trivia',
    title: 'Knowledge Trivia',
    titleMs: 'Trivia Pengetahuan',
    description: 'Test your mental health knowledge with quick questions',
    descriptionMs: 'Uji pengetahuan kesihatan mental anda dengan soalan pantas',
    icon: Brain,
    color: 'sage',
    href: '/activities/trivia',
    duration: '2-3 min',
  },
  {
    id: 'checkin',
    title: 'Daily Check-in',
    titleMs: 'Daftar Masuk Harian',
    description: 'Quick wellness questions to reflect on your day',
    descriptionMs: 'Soalan kesejahteraan pantas untuk merenung hari anda',
    icon: Heart,
    color: 'lavender',
    href: '/activities/checkin',
    duration: '1-2 min',
  },
];

const colorStyles: Record<string, { bg: string; icon: string; border: string }> = {
  sage: {
    bg: 'bg-sage-50 dark:bg-sage-900/20',
    icon: 'text-sage-600 dark:text-sage-400',
    border: 'border-sage-200 dark:border-sage-800/50',
  },
  lavender: {
    bg: 'bg-lavender-50 dark:bg-lavender-900/20',
    icon: 'text-lavender-600 dark:text-lavender-400',
    border: 'border-lavender-200 dark:border-lavender-800/50',
  },
  ocean: {
    bg: 'bg-ocean-50 dark:bg-ocean-900/20',
    icon: 'text-ocean-600 dark:text-ocean-400',
    border: 'border-ocean-200 dark:border-ocean-800/50',
  },
  warm: {
    bg: 'bg-warm-50 dark:bg-warm-900/20',
    icon: 'text-warm-600 dark:text-warm-400',
    border: 'border-warm-200 dark:border-warm-800/50',
  },
};

export default function ActivitiesPage() {
  const router = useRouter();
  const [locale] = useState<'en' | 'ms'>('en');
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    // Fetch today's activity count
    async function fetchTodayCount() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('user_activity_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('completed_at', `${today}T00:00:00`);

        setTodayCount(count || 0);
      }
    }

    fetchTodayCount();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-lavender-200/40 dark:bg-lavender-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sage-200/30 dark:bg-sage-900/10 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-center mb-6">
                <BreathingCircle size="lg" color="lavender" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {locale === 'ms' ? 'Aktiviti Pantas' : 'Quick Activities'}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                {locale === 'ms'
                  ? 'Luangkan beberapa minit untuk kesejahteraan anda'
                  : 'Take a few mindful minutes for your wellbeing'}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4">
          {/* Today's Stats */}
          {todayCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="wellness-card p-4 flex items-center justify-center gap-3 bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800/50">
                <Trophy className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <span className="text-sage-700 dark:text-sage-300 font-medium">
                  {locale === 'ms'
                    ? `${todayCount} aktiviti selesai hari ini`
                    : `${todayCount} ${todayCount === 1 ? 'activity' : 'activities'} completed today`}
                </span>
              </div>
            </motion.div>
          )}

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {ACTIVITIES.map((activity, index) => {
              const Icon = activity.icon;
              const colors = colorStyles[activity.color];

              return (
                <motion.button
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => router.push(activity.href)}
                  className={cn(
                    'wellness-card p-6 text-left transition-all group',
                    'hover:shadow-lg hover:-translate-y-1',
                    colors.bg,
                    colors.border
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center',
                      'bg-white/60 dark:bg-neutral-800/60'
                    )}>
                      <Icon className={cn('w-7 h-7', colors.icon)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                        {locale === 'ms' ? activity.titleMs : activity.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {locale === 'ms' ? activity.descriptionMs : activity.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.duration}
                      </div>
                    </div>

                    <ArrowRight className={cn(
                      'w-5 h-5 text-neutral-400 transition-transform',
                      'group-hover:translate-x-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                    )} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Encouragement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 text-sm">
              <Sparkles className="w-4 h-4" />
              {locale === 'ms'
                ? 'Setiap langkah kecil penting'
                : 'Every small step matters'}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
