'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Clock, Search, BookOpen, Loader2 } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { PremiumBadge } from '@/components/premium';
import { ProgressBadge } from '@/components/intervention/progress-tracker';
import { useSubscription } from '@/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import type { InterventionModule } from '@/lib/interventions/modules';

const CATEGORIES = [
  { value: 'all', label: 'All', labelMs: 'Semua' },
  { value: 'anxiety', label: 'Anxiety', labelMs: 'Kebimbangan' },
  { value: 'depression', label: 'Depression', labelMs: 'Kemurungan' },
  { value: 'ptsd', label: 'PTSD', labelMs: 'PTSD' },
  { value: 'ocd', label: 'OCD', labelMs: 'OCD' },
  { value: 'insomnia', label: 'Insomnia', labelMs: 'Insomnia' },
  { value: 'stress', label: 'Stress', labelMs: 'Tekanan' },
  { value: 'mindfulness', label: 'Mindfulness', labelMs: 'Kesedaran Penuh' },
];

// Default placeholder images for categories
const CATEGORY_IMAGES: Record<string, string> = {
  anxiety: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
  depression: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=450&fit=crop',
  ptsd: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=450&fit=crop',
  ocd: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=450&fit=crop',
  insomnia: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=450&fit=crop',
  stress: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=450&fit=crop',
  mindfulness: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=450&fit=crop',
  default: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
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
    if (userId) {
      fetchUserProgress();
    }
  }, [userId]);

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
        data.progress?.forEach((p: any) => {
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

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    if (minutes < 60) {
      return `${minutes} ${locale === 'ms' ? 'min' : 'min'}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {locale === 'ms' ? 'Intervensi Bantuan Diri' : 'Self-Help Interventions'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {locale === 'ms'
                ? 'Modul dan latihan berasaskan bukti untuk menyokong perjalanan kesihatan mental anda.'
                : 'Evidence-based modules and exercises to support your mental well-being journey.'}
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <GlassInput
                  type="text"
                  placeholder={locale === 'ms' ? 'Cari intervensi...' : 'Search interventions...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/70 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800'
                    }`}
                  >
                    {locale === 'ms' ? category.labelMs : category.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          )}

          {/* Interventions Grid */}
          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInterventions.map((intervention, index) => {
                const name = locale === 'ms' ? intervention.nameMs : intervention.name;
                const description = locale === 'ms' ? intervention.descriptionMs : intervention.description;
                const progress = userProgress[intervention.id];
                const thumbnail = intervention.thumbnailUrl || CATEGORY_IMAGES[intervention.category] || CATEGORY_IMAGES.default;

                return (
                  <motion.div
                    key={intervention.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <GlassCard
                      className="h-full cursor-pointer hover:border-primary-400 transition-all group"
                      onClick={() => router.push(`/interventions/${intervention.slug}`)}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                        <Image
                          src={thumbnail}
                          alt={name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-primary-600 ml-1" />
                          </div>
                        </div>

                        {/* Duration badge */}
                        {intervention.estimatedDuration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(intervention.estimatedDuration)}
                          </div>
                        )}

                        {/* Premium badge */}
                        {intervention.isPremium && (
                          <div className="absolute top-2 right-2">
                            <PremiumBadge />
                          </div>
                        )}

                        {/* Progress indicator */}
                        {progress && progress.completed > 0 && (
                          <div className="absolute top-2 left-2">
                            <ProgressBadge
                              completed={progress.completed}
                              total={progress.total || intervention.totalChapters}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2">
                            {name}
                          </h3>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
                          {description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full capitalize">
                            {intervention.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {intervention.totalChapters} {locale === 'ms' ? 'bab' : 'chapters'}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredInterventions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <GlassCard className="max-w-md mx-auto">
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  {locale === 'ms' ? 'Tiada intervensi dijumpai' : 'No interventions found'}
                </h3>
                <p className="text-neutral-500 text-sm">
                  {locale === 'ms'
                    ? 'Cuba laraskan carian atau kriteria penapis anda.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
