'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Share2,
  Lock,
  Play,
  Sparkles,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { BreathingCircle } from '@/components/ui/lottie-animation';
import { ExerciseDetail } from '@/components/intervention/exercise-detail';
import { MindfulProgress } from '@/components/intervention/mindful-progress';
import { JourneyPath } from '@/components/intervention/journey-map';
import { PremiumGate, PremiumBadge } from '@/components/premium';
import { useSubscription } from '@/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import type { InterventionModule, InterventionChapter } from '@/lib/interventions/modules';

export default function InterventionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isPremium, isBasic } = useSubscription();
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
      <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex flex-col items-center justify-center gap-4">
          <BreathingCircle size="lg" color="sage" />
          <p className="text-neutral-500 dark:text-neutral-400">
            {locale === 'ms' ? 'Memuatkan...' : 'Loading...'}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!intervention) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center px-4">
          <div className="wellness-card text-center max-w-md p-8">
            <div className="w-16 h-16 rounded-full bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-warm-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {locale === 'ms' ? 'Modul Tidak Dijumpai' : 'Module Not Found'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {locale === 'ms'
                ? 'Modul yang anda cari tidak wujud.'
                : "The module you're looking for doesn't exist."}
            </p>
            <GlassButton variant="wellness" onClick={() => router.push('/interventions')}>
              {locale === 'ms' ? 'Lihat Modul' : 'Browse Modules'}
            </GlassButton>
          </div>
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

  // Check if user can access chapter
  const canAccessChapter = (index: number): boolean => {
    if (!intervention.isPremium) return true;
    const chapter = chapters[index];
    if (chapter?.isFreePreview) return true;
    return isPremium || isBasic;
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '~15 min';
    if (minutes < 60) {
      return `${minutes} ${locale === 'ms' ? 'min' : 'min'}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours}j`;
  };

  const content = (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-neutral-950">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => router.push('/interventions')}
              className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {locale === 'ms' ? 'Kembali' : 'Back'}
            </button>
          </motion.div>

          {/* Module Completed Banner */}
          {isModuleCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="wellness-card p-6 text-center bg-sage-100 dark:bg-sage-900/30 border-sage-200 dark:border-sage-700/50">
                <Sparkles className="w-8 h-8 text-sage-600 dark:text-sage-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-sage-800 dark:text-sage-200 mb-1">
                  {locale === 'ms' ? 'Tahniah!' : 'Congratulations!'}
                </h3>
                <p className="text-sage-700 dark:text-sage-300">
                  {locale === 'ms'
                    ? `Anda telah menyelesaikan "${name}"`
                    : `You've completed "${name}"`}
                </p>
              </div>
            </motion.div>
          )}

          {/* Journey Path (horizontal on desktop) */}
          {chapters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 hidden md:block"
            >
              <JourneyPath
                chapters={chapters}
                currentChapterIndex={currentChapterIndex}
                onChapterSelect={handleChapterSelect}
                locale={locale}
              />
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Start Screen */}
              {!isStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="wellness-card p-8 text-center">
                    {/* Breathing animation */}
                    <div className="flex justify-center mb-6">
                      <BreathingCircle size="xl" color="sage" />
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {name}
                      </h1>
                      {intervention.isPremium && <PremiumBadge />}
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
                      {description}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDuration(intervention.estimatedDuration)}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {chapters.length} {locale === 'ms' ? 'langkah' : 'moments'}
                      </div>
                      <div className="flex items-center gap-2 capitalize">
                        <span className="w-2 h-2 rounded-full bg-sage-500" />
                        {intervention.category}
                      </div>
                    </div>

                    <motion.button
                      onClick={handleStart}
                      className={cn(
                        'inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-lg transition-all',
                        'bg-sage-500 text-white hover:bg-sage-600',
                        'focus:outline-none focus:ring-4 focus:ring-sage-300/50'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      {locale === 'ms' ? 'Mulakan Perjalanan' : 'Begin Journey'}
                    </motion.button>
                  </div>
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
                    <div className="wellness-card text-center py-12 px-6">
                      <div className="w-16 h-16 rounded-full bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-lavender-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                        {locale === 'ms' ? 'Kandungan Premium' : 'Premium Content'}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        {locale === 'ms'
                          ? 'Tingkatkan ke Premium untuk akses kandungan ini.'
                          : 'Upgrade to Premium to access this content.'}
                      </p>
                      <GlassButton
                        variant="wellness"
                        onClick={() => router.push('/pricing')}
                      >
                        {locale === 'ms' ? 'Tingkatkan Sekarang' : 'Upgrade Now'}
                      </GlassButton>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mindful Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <MindfulProgress
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
                <div className="wellness-card p-5">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    {locale === 'ms' ? 'Kongsi' : 'Share'}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    {locale === 'ms'
                      ? 'Bantu orang lain dalam perjalanan kesejahteraan mereka'
                      : 'Help others on their wellness journey'}
                  </p>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: name,
                          text: description,
                          url: window.location.href,
                        });
                      }
                    }}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                      'bg-warm-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
                      'hover:bg-sage-100 dark:hover:bg-sage-900/30 hover:text-sage-700 dark:hover:text-sage-300'
                    )}
                  >
                    <Share2 className="w-4 h-4" />
                    {locale === 'ms' ? 'Kongsi Modul' : 'Share Module'}
                  </button>
                </div>
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
