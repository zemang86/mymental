'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  Award,
  Share2,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { VideoPlayer } from '@/components/intervention';
import { PremiumGate, PremiumBadge } from '@/components/premium';
import {
  SAMPLE_INTERVENTIONS,
  formatTotalDuration,
  formatDuration,
} from '@/lib/interventions';

export default function InterventionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interventionId = params.id as string;

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Find intervention
  const intervention = SAMPLE_INTERVENTIONS.find((i) => i.id === interventionId);

  if (!intervention) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <GlassCard className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Intervention Not Found
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              The intervention you're looking for doesn't exist.
            </p>
            <GlassButton variant="primary" onClick={() => router.push('/interventions')}>
              Browse Interventions
            </GlassButton>
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  const progress =
    intervention.chapters.length > 0
      ? Math.round((completedChapters.length / intervention.chapters.length) * 100)
      : 0;

  const isCompleted = completedChapters.length === intervention.chapters.length;

  const handleChapterComplete = (chapterId: string) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters([...completedChapters, chapterId]);
    }
  };

  const handleChapterChange = (index: number) => {
    setCurrentChapterIndex(index);
    setCurrentTime(0);
  };

  const handleProgress = (time: number) => {
    setCurrentTime(time);
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
              Back to Interventions
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player or Start Screen */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isStarted ? (
                  <VideoPlayer
                    chapters={intervention.chapters}
                    currentChapterIndex={currentChapterIndex}
                    completedChapters={completedChapters}
                    onChapterChange={handleChapterChange}
                    onProgress={handleProgress}
                    onChapterComplete={handleChapterComplete}
                    initialTime={currentTime}
                  />
                ) : (
                  <GlassCard className="relative overflow-hidden">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={intervention.thumbnail}
                        alt={intervention.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <GlassButton
                          variant="primary"
                          size="lg"
                          onClick={() => setIsStarted(true)}
                          className="px-8"
                        >
                          Start Learning
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </motion.div>

              {/* Title and description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                        {intervention.title}
                      </h1>
                      <p className="text-neutral-500">{intervention.titleMs}</p>
                    </div>
                    {intervention.isPremium && <PremiumBadge />}
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    {intervention.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTotalDuration(intervention.duration)}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {intervention.chapters.length} chapters
                    </div>
                    <div className="flex items-center gap-2 capitalize">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                      {intervention.category}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Chapters list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    Course Content
                  </h2>
                  <div className="space-y-2">
                    {intervention.chapters.map((chapter, index) => {
                      const isComplete = completedChapters.includes(chapter.id);
                      const isCurrent = index === currentChapterIndex && isStarted;

                      return (
                        <button
                          key={chapter.id}
                          onClick={() => {
                            setIsStarted(true);
                            handleChapterChange(index);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                            isCurrent
                              ? 'bg-primary-100 dark:bg-primary-900/30'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isComplete
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : isCurrent
                                ? 'bg-primary-500 text-white'
                                : 'bg-neutral-200 dark:bg-neutral-700'
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium truncate ${
                                isCurrent
                                  ? 'text-primary-700 dark:text-primary-300'
                                  : 'text-neutral-900 dark:text-white'
                              }`}
                            >
                              {chapter.title}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {formatDuration(chapter.duration)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <GlassCard>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                    Your Progress
                  </h3>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {completedChapters.length} of {intervention.chapters.length} completed
                      </span>
                      <span className="font-medium text-primary-600">{progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                      <Award className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        Course Completed!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Great job on finishing this course
                      </p>
                    </div>
                  )}

                  {!isStarted && !isCompleted && (
                    <GlassButton
                      variant="primary"
                      className="w-full"
                      onClick={() => setIsStarted(true)}
                    >
                      Start Course
                    </GlassButton>
                  )}

                  {isStarted && !isCompleted && (
                    <GlassButton
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        // Find next incomplete chapter
                        const nextIndex = intervention.chapters.findIndex(
                          (ch) => !completedChapters.includes(ch.id)
                        );
                        if (nextIndex !== -1) {
                          handleChapterChange(nextIndex);
                        }
                      }}
                    >
                      Continue Learning
                    </GlassButton>
                  )}
                </GlassCard>
              </motion.div>

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <GlassCard>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Share This Course
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Help others on their mental wellness journey
                  </p>
                  <GlassButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: intervention.title,
                          text: intervention.description,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
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

  // Wrap premium content in gate
  if (intervention.isPremium) {
    return (
      <PremiumGate feature={`"${intervention.title}" course`} requireTier="premium">
        {content}
      </PremiumGate>
    );
  }

  return content;
}
