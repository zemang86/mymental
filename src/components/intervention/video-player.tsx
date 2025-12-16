'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  CheckCircle,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { GlassCard } from '@/components/ui';
import type { InterventionChapter } from '@/lib/interventions';
import { formatDuration } from '@/lib/interventions';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  chapters: InterventionChapter[];
  currentChapterIndex: number;
  completedChapters: string[];
  onChapterChange: (index: number) => void;
  onProgress: (time: number) => void;
  onChapterComplete: (chapterId: string) => void;
  initialTime?: number;
}

export function VideoPlayer({
  chapters,
  currentChapterIndex,
  completedChapters,
  onChapterChange,
  onProgress,
  onChapterComplete,
  initialTime = 0,
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const currentChapter = chapters[currentChapterIndex];
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if chapter has video URL
  const hasVideo = !!(currentChapter as any)?.video_url;

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Update progress every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const time = playerRef.current.getCurrentTime?.() || currentTime;
        setCurrentTime(time);
        onProgress(time);

        // Check if chapter is complete (95% watched)
        if (time >= duration * 0.95 && !completedChapters.includes(currentChapter.id)) {
          onChapterComplete(currentChapter.id);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, currentChapter, completedChapters, onProgress, onChapterComplete, currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && playerRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      playerRef.current.seekTo?.(newTime, 'seconds');
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('video-container');
    if (container) {
      if (!isFullscreen) {
        container.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      onChapterChange(currentChapterIndex - 1);
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      onChapterChange(currentChapterIndex + 1);
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
  };

  const handleProgress = (state: any) => {
    if (!isPlaying) return;
    setCurrentTime(state.playedSeconds);
    onProgress(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleReady = () => {
    setIsReady(true);
    if (initialTime > 0 && playerRef.current) {
      playerRef.current.seekTo(initialTime, 'seconds');
    }
  };

  const handleEnded = () => {
    onChapterComplete(currentChapter.id);
    goToNextChapter();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div
        id="video-container"
        className="relative bg-black rounded-2xl overflow-hidden aspect-video group"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* ReactPlayer for YouTube, Vimeo, etc. */}
        {hasVideo ? (
          <ReactPlayer
            ref={playerRef}
            url={(currentChapter as any).video_url}
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            playbackRate={playbackRate}
            width="100%"
            height="100%"
            onProgress={handleProgress}
            onDuration={handleDuration}
            onReady={handleReady}
            onEnded={handleEnded}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                },
              },
              vimeo: {
                playerOptions: {
                  byline: false,
                  portrait: false,
                },
              },
            }}
          />
        ) : (
          /* Placeholder when no video URL */
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No Video Available</p>
              <p className="text-xs opacity-60 mt-1">{currentChapter?.title}</p>
              <p className="text-xs opacity-40 mt-2">Add a video URL in the admin panel</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium truncate">{currentChapter?.title}</h3>
                <p className="text-white/60 text-sm">
                  Chapter {currentChapterIndex + 1} of {chapters.length}
                </p>
              </div>

              {/* Center play button */}
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </button>

              {/* Bottom controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  onClick={handleSeek}
                  className="h-1 bg-white/30 rounded-full cursor-pointer group/progress"
                >
                  <div
                    className="h-full bg-primary-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPreviousChapter}
                      disabled={currentChapterIndex === 0}
                      className="p-2 text-white hover:bg-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={goToNextChapter}
                      disabled={currentChapterIndex === chapters.length - 1}
                      className="p-2 text-white hover:bg-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </div>

                    {/* Time */}
                    <span className="text-white/80 text-sm ml-4">
                      {formatDuration(Math.floor(currentTime))} /{' '}
                      {formatDuration(currentChapter?.duration || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Playback speed */}
                    <button
                      onClick={changePlaybackRate}
                      className="px-2 py-1 text-white/80 text-sm hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {playbackRate}x
                    </button>

                    {/* Chapter list */}
                    <button
                      onClick={() => setShowChapterList(!showChapterList)}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <List className="w-5 h-5" />
                    </button>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapter List */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Chapters</h4>
              <div className="space-y-2">
                {chapters.map((chapter, index) => {
                  const isCompleted = completedChapters.includes(chapter.id);
                  const isCurrent = index === currentChapterIndex;

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => onChapterChange(index)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors',
                        isCurrent
                          ? 'bg-primary-100 dark:bg-primary-900/30'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : isCurrent
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <span
                            className={cn(
                              'text-sm font-medium',
                              isCurrent ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'
                            )}
                          >
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-medium truncate',
                            isCurrent
                              ? 'text-primary-700 dark:text-primary-300'
                              : 'text-neutral-900 dark:text-white'
                          )}
                        >
                          {chapter.title}
                        </p>
                        <p className="text-sm text-neutral-500">{formatDuration(chapter.duration)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
