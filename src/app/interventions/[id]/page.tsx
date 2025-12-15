'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Share2,
  Loader2,
  Lock,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { ExerciseDetail } from '@/components/intervention/exercise-detail';
import { ProgressTracker, CompletionBanner } from '@/components/intervention/progress-tracker';
import { PremiumGate, PremiumBadge } from '@/components/premium';
import { useSubscription } from '@/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import type { InterventionModule, InterventionChapter } from '@/lib/interventions/modules';

// Default images for categories
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

export default function InterventionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { subscription, isPremium, isBasic } = useSubscription();
  const [userId, setUserId] = useState<string | null>(null);
  const slug = params.id as string;

  const [intervention, setIntervention] = useState<InterventionModule | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [locale] = useState<'en' | 'ms'>('en');

  // Get user ID from supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    fetchIntervention();
  }, [slug, userId]);

  const fetchIntervention = async () => {
    try {
      const url = userId
        ? `/api/v1/intervention/modules?slug=${slug}&userId=${userId}`
        : `/api/v1/intervention/modules?slug=${slug}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        setIntervention(data.intervention);

        // If user has progress, start from last position
        if (data.intervention?.userProgress) {
          setIsStarted(true);
          // Find first incomplete chapter
          const chapters = data.intervention.chapters || [];
          const firstIncomplete = chapters.findIndex((ch: InterventionChapter) => !ch.isCompleted);
          if (firstIncomplete >= 0) {
            setCurrentChapterIndex(firstIncomplete);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching intervention:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterComplete = async (notes?: string) => {
    if (!userId || !intervention) return;

    const chapter = intervention.chapters?.[currentChapterIndex];
    if (!chapter) return;

    setSaving(true);
    try {
      const res = await fetch('/api/v1/intervention/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          interventionId: intervention.id,
          chapterId: chapter.id,
          kbArticleId: chapter.kbArticleId,
          completed: true,
          notes,
        }),
      });

      if (res.ok) {
        // Update local state
        setIntervention((prev) => {
          if (!prev || !prev.chapters) return prev;
          const updatedChapters = [...prev.chapters];
          updatedChapters[currentChapterIndex] = {
            ...updatedChapters[currentChapterIndex],
            isCompleted: true,
          };
          return { ...prev, chapters: updatedChapters };
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    setIsStarted(true);
  };

  const handleStart = async () => {
    setIsStarted(true);

    // Track that user started this intervention
    if (userId && intervention) {
      try {
        await fetch('/api/v1/intervention/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            interventionId: intervention.id,
            action: 'start',
          }),
        });
      } catch (error) {
        console.error('Error starting intervention:', error);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!intervention) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <GlassCard className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {locale === 'ms' ? 'Intervensi Tidak Dijumpai' : 'Intervention Not Found'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {locale === 'ms'
                ? 'Intervensi yang anda cari tidak wujud.'
                : "The intervention you're looking for doesn't exist."}
            </p>
            <GlassButton variant="primary" onClick={() => router.push('/interventions')}>
              {locale === 'ms' ? 'Lihat Intervensi' : 'Browse Interventions'}
            </GlassButton>
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  const name = locale === 'ms' ? intervention.nameMs : intervention.name;
  const description = locale === 'ms' ? intervention.descriptionMs : intervention.description;
  const chapters = intervention.chapters || [];
  const currentChapter = chapters[currentChapterIndex];
  const completedCount = chapters.filter((ch) => ch.isCompleted).length;
  const isModuleCompleted = completedCount === chapters.length && chapters.length > 0;
  const thumbnail = intervention.thumbnailUrl || CATEGORY_IMAGES[intervention.category] || CATEGORY_IMAGES.default;

  // Check if user can access chapter
  const canAccessChapter = (index: number): boolean => {
    if (!intervention.isPremium) return true;
    const chapter = chapters[index];
    if (chapter?.isFreePreview) return true;
    return isPremium || isBasic;
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    if (minutes < 60) {
      return `${minutes} ${locale === 'ms' ? 'min' : 'min'}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours}j`;
  };

  const content = (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => router.push('/interventions')}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {locale === 'ms' ? 'Kembali ke Intervensi' : 'Back to Interventions'}
            </button>
          </motion.div>

          {/* Module Completed Banner */}
          {isModuleCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <CompletionBanner moduleName={name} locale={locale} />
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Intro or Start Screen */}
              {!isStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="relative overflow-hidden">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={thumbnail}
                        alt={name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <GlassButton
                          variant="primary"
                          size="lg"
                          onClick={handleStart}
                          className="px-8"
                        >
                          {locale === 'ms' ? 'Mula Belajar' : 'Start Learning'}
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Exercise Detail View */}
              {isStarted && currentChapter && (
                <motion.div
                  key={currentChapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {canAccessChapter(currentChapterIndex) ? (
                    <ExerciseDetail
                      chapter={currentChapter}
                      onComplete={handleChapterComplete}
                      onPrevious={
                        currentChapterIndex > 0
                          ? () => setCurrentChapterIndex(currentChapterIndex - 1)
                          : undefined
                      }
                      onNext={
                        currentChapterIndex < chapters.length - 1
                          ? () => setCurrentChapterIndex(currentChapterIndex + 1)
                          : undefined
                      }
                      hasPrevious={currentChapterIndex > 0}
                      hasNext={currentChapterIndex < chapters.length - 1}
                      locale={locale}
                    />
                  ) : (
                    <GlassCard className="text-center py-12">
                      <Lock className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                        {locale === 'ms' ? 'Kandungan Premium' : 'Premium Content'}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        {locale === 'ms'
                          ? 'Tingkatkan ke Premium untuk akses bab ini.'
                          : 'Upgrade to Premium to access this chapter.'}
                      </p>
                      <GlassButton
                        variant="primary"
                        onClick={() => router.push('/pricing')}
                      >
                        {locale === 'ms' ? 'Tingkatkan Sekarang' : 'Upgrade Now'}
                      </GlassButton>
                    </GlassCard>
                  )}
                </motion.div>
              )}

              {/* Title and description (shown when not started) */}
              {!isStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                          {name}
                        </h1>
                      </div>
                      {intervention.isPremium && <PremiumBadge />}
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      {description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                      {intervention.estimatedDuration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDuration(intervention.estimatedDuration)}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {chapters.length} {locale === 'ms' ? 'bab' : 'chapters'}
                      </div>
                      <div className="flex items-center gap-2 capitalize">
                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                        {intervention.category}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <ProgressTracker
                  chapters={chapters}
                  progress={intervention.userProgress}
                  currentChapterIndex={currentChapterIndex}
                  onChapterSelect={handleChapterSelect}
                  locale={locale}
                />
              </motion.div>

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <GlassCard>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    {locale === 'ms' ? 'Kongsi Modul Ini' : 'Share This Module'}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {locale === 'ms'
                      ? 'Bantu orang lain dalam perjalanan kesihatan mental mereka'
                      : 'Help others on their mental wellness journey'}
                  </p>
                  <GlassButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: name,
                          text: description,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {locale === 'ms' ? 'Kongsi' : 'Share'}
                  </GlassButton>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  // For premium modules, show first chapter free, then gate
  if (intervention.isPremium && !currentChapter?.isFreePreview && !canAccessChapter(currentChapterIndex)) {
    return (
      <PremiumGate feature={`"${name}" module`} requireTier="premium">
        {content}
      </PremiumGate>
    );
  }

  return content;
}
