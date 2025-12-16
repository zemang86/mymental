'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2, Heart, Brain, Moon, Wind, Smile, Users } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassInput } from '@/components/ui';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import { WellnessCard, WellnessCardFeatured } from '@/components/intervention/wellness-card';
import { useSubscription } from '@/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import type { InterventionModule } from '@/lib/interventions/modules';

// Categories with icons and colors
const CATEGORIES = [
  { value: 'all', label: 'All', labelMs: 'Semua', icon: Sparkles, color: 'sage' },
  { value: 'anxiety', label: 'Anxiety', labelMs: 'Kebimbangan', icon: Wind, color: 'lavender' },
  { value: 'depression', label: 'Depression', labelMs: 'Kemurungan', icon: Heart, color: 'ocean' },
  { value: 'ptsd', label: 'PTSD', labelMs: 'PTSD', icon: Brain, color: 'warm' },
  { value: 'ocd', label: 'OCD', labelMs: 'OCD', icon: Brain, color: 'lavender' },
  { value: 'insomnia', label: 'Sleep', labelMs: 'Tidur', icon: Moon, color: 'sage' },
  { value: 'suicidal', label: 'Crisis Support', labelMs: 'Sokongan Krisis', icon: Heart, color: 'ocean' },
  { value: 'sexual-addiction', label: 'Recovery', labelMs: 'Pemulihan', icon: Smile, color: 'warm' },
  { value: 'marital-distress', label: 'Relationships', labelMs: 'Hubungan', icon: Users, color: 'lavender' },
];

// Category color styles
const categoryColorStyles: Record<string, string> = {
  sage: 'bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 border-sage-200 dark:border-sage-700/50',
  lavender: 'bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300 border-lavender-200 dark:border-lavender-700/50',
  ocean: 'bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-300 border-ocean-200 dark:border-ocean-700/50',
  warm: 'bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 border-warm-200 dark:border-warm-700/50',
};

export default function InterventionsPage() {
  const router = useRouter();
  const { subscription } = useSubscription();
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [interventions, setInterventions] = useState<InterventionModule[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [loading, setLoading] = useState(true);
  const [locale] = useState<'en' | 'ms'>('en');

  // Get user ID from supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    fetchInterventions();
  }, []);

  useEffect(() => {
    if (userId && interventions.length > 0) {
      fetchUserProgress();
    }
  }, [userId, interventions]);

  const fetchInterventions = async () => {
    try {
      const res = await fetch('/api/v1/intervention/modules');
      if (res.ok) {
        const data = await res.json();
        setInterventions(data.modules || []);
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/v1/intervention/progress?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const progressMap: Record<string, { completed: number; total: number }> = {};
        data.progress?.forEach((p: { interventionId: string; completedChapters?: number }) => {
          progressMap[p.interventionId] = {
            completed: p.completedChapters || 0,
            total: interventions.find(i => i.id === p.interventionId)?.totalChapters || 0,
          };
        });
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const filteredInterventions = interventions.filter((intervention) => {
    const name = locale === 'ms' ? intervention.nameMs : intervention.name;
    const description = locale === 'ms' ? intervention.descriptionMs : intervention.description;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || intervention.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured intervention (first with progress, or first premium, or just first)
  const featuredIntervention = filteredInterventions.find(i =>
    userProgress[i.id]?.completed > 0
  ) || filteredInterventions.find(i => i.isPremium) || filteredInterventions[0];

  const otherInterventions = filteredInterventions.filter(i => i.id !== featuredIntervention?.id);

  const isPremiumUser = subscription?.status === 'active';

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        {/* Hero Section with Breathing Animation */}
        <section className="relative overflow-hidden py-12 md:py-16">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-sage-200/40 dark:bg-sage-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-lavender-200/30 dark:bg-lavender-900/10 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Breathing circle */}
              <div className="flex justify-center mb-6">
                <BreathingCircle size="lg" color="sage" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {locale === 'ms' ? 'Perjalanan Kesejahteraan Anda' : 'Your Wellness Journey'}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                {locale === 'ms'
                  ? 'Luangkan masa untuk diri anda dengan latihan dan modul yang direka untuk menyokong kesihatan mental anda.'
                  : 'Take time for yourself with exercises and modules designed to support your mental well-being.'}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={locale === 'ms' ? 'Cari modul...' : 'Search modules...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-12 pr-4 py-3 rounded-2xl transition-all',
                    'bg-white dark:bg-neutral-900',
                    'border border-warm-200 dark:border-neutral-800',
                    'text-neutral-900 dark:text-white',
                    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400'
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.value;
                const colorStyle = categoryColorStyles[category.color];

                return (
                  <motion.button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all border',
                      isSelected
                        ? colorStyle
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-warm-200 dark:border-neutral-800 hover:border-sage-300 dark:hover:border-sage-700'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    {locale === 'ms' ? category.labelMs : category.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <BreathingCircle size="lg" color="sage" />
              <p className="text-neutral-500 dark:text-neutral-400">
                {locale === 'ms' ? 'Memuatkan...' : 'Loading...'}
              </p>
            </div>
          )}

          {/* Content */}
          {!loading && filteredInterventions.length > 0 && (
            <div className="space-y-8">
              {/* Featured Intervention */}
              {featuredIntervention && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <WellnessCardFeatured
                    intervention={featuredIntervention}
                    progress={userProgress[featuredIntervention.id]}
                    isPremium={featuredIntervention.isPremium}
                    locale={locale}
                    onClick={() => router.push(`/interventions/${featuredIntervention.slug}`)}
                  />
                </motion.div>
              )}

              {/* Other Interventions Grid */}
              {otherInterventions.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    {locale === 'ms' ? 'Semua Modul' : 'All Modules'}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {otherInterventions.map((intervention, index) => {
                      const progress = userProgress[intervention.id];
                      const isLocked = intervention.isPremium && !isPremiumUser;

                      return (
                        <motion.div
                          key={intervention.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                        >
                          <WellnessCard
                            intervention={intervention}
                            progress={progress}
                            isPremium={intervention.isPremium}
                            isLocked={isLocked}
                            locale={locale}
                            onClick={() => {
                              if (isLocked) {
                                router.push('/pricing');
                              } else {
                                router.push(`/interventions/${intervention.slug}`);
                              }
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredInterventions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="wellness-card max-w-md mx-auto p-8">
                <div className="w-16 h-16 rounded-full bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-warm-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  {locale === 'ms' ? 'Tiada modul dijumpai' : 'No modules found'}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {locale === 'ms'
                    ? 'Cuba laraskan carian atau pilih kategori lain.'
                    : 'Try adjusting your search or selecting a different category.'}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
