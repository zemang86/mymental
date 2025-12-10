'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Clock, Lock, Filter, Search } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { PremiumBadge } from '@/components/premium';
import { SAMPLE_INTERVENTIONS, formatTotalDuration } from '@/lib/interventions';
import type { InterventionCategory } from '@/lib/interventions';

const CATEGORIES: { value: InterventionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'stress', label: 'Stress' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'relationships', label: 'Relationships' },
];

export default function InterventionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InterventionCategory | 'all'>('all');

  const filteredInterventions = SAMPLE_INTERVENTIONS.filter((intervention) => {
    const matchesSearch =
      intervention.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || intervention.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              Self-Help Interventions
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Evidence-based video courses and exercises to support your mental well-being journey.
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
                  placeholder="Search interventions..."
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
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Interventions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterventions.map((intervention, index) => (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <GlassCard
                  className="h-full cursor-pointer hover:border-primary-400 transition-all group"
                  onClick={() => router.push(`/interventions/${intervention.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    <Image
                      src={intervention.thumbnail}
                      alt={intervention.title}
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
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTotalDuration(intervention.duration)}
                    </div>

                    {/* Premium badge */}
                    {intervention.isPremium && (
                      <div className="absolute top-2 right-2">
                        <PremiumBadge />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2">
                        {intervention.title}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
                      {intervention.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full capitalize">
                        {intervention.category}
                      </span>
                      <span>{intervention.chapters.length} chapters</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {filteredInterventions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <GlassCard className="max-w-md mx-auto">
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  No interventions found
                </h3>
                <p className="text-neutral-500 text-sm">
                  Try adjusting your search or filter criteria.
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
