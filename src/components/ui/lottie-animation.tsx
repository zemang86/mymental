'use client';

import { useRef, useEffect, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { cn } from '@/lib/utils/cn';

// Pre-defined animation types for easy loading
export type AnimationType =
  | 'breathing'
  | 'success'
  | 'confetti'
  | 'loading'
  | 'meditation'
  | 'heart'
  | 'calm'
  | 'category-anxiety'
  | 'category-depression'
  | 'category-stress'
  | 'category-sleep'
  | 'category-mindfulness';

export interface LottieAnimationProps {
  // Either provide an animation type (loads from /public/animations/)
  animation?: AnimationType;
  // Or provide custom animation data directly
  animationData?: object;
  // Size presets
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  // Custom dimensions (override size)
  width?: number | string;
  height?: number | string;
  // Playback controls
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  // Event callbacks
  onComplete?: () => void;
  onLoopComplete?: () => void;
  // Styling
  className?: string;
  // Accessibility
  ariaLabel?: string;
}

// Size presets in pixels
const sizeMap = {
  xs: 24,
  sm: 40,
  md: 80,
  lg: 120,
  xl: 200,
  full: '100%',
};

export function LottieAnimation({
  animation,
  animationData: customData,
  size = 'md',
  width,
  height,
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
  onLoopComplete,
  className,
  ariaLabel,
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<object | null>(customData || null);
  const [error, setError] = useState(false);

  // Load animation from file if animation type is provided
  useEffect(() => {
    if (animation && !customData) {
      import(`../../../public/animations/${animation}.json`)
        .then((data) => setAnimationData(data.default))
        .catch(() => {
          console.warn(`Animation not found: ${animation}`);
          setError(true);
        });
    }
  }, [animation, customData]);

  // Set playback speed
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Calculate dimensions
  const dimensions = {
    width: width || sizeMap[size],
    height: height || sizeMap[size],
  };

  // Show placeholder if loading or error
  if (!animationData || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-sage-100 dark:bg-sage-900/30',
          className
        )}
        style={dimensions}
        role="img"
        aria-label={ariaLabel || 'Loading animation'}
      >
        {error ? (
          <span className="text-sage-400 text-xs">✧</span>
        ) : (
          <div className="animate-breathe-slow w-1/2 h-1/2 rounded-full bg-sage-200 dark:bg-sage-800" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      style={dimensions}
      role="img"
      aria-label={ariaLabel}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
        onComplete={onComplete}
        onLoopComplete={onLoopComplete}
      />
    </div>
  );
}

// Convenience components for common animations

export function BreathingAnimation({
  size = 'lg',
  className,
  ...props
}: Omit<LottieAnimationProps, 'animation'>) {
  return (
    <LottieAnimation
      animation="breathing"
      size={size}
      className={className}
      ariaLabel="Breathing animation"
      {...props}
    />
  );
}

export function SuccessAnimation({
  size = 'md',
  loop = false,
  className,
  ...props
}: Omit<LottieAnimationProps, 'animation'>) {
  return (
    <LottieAnimation
      animation="success"
      size={size}
      loop={loop}
      className={className}
      ariaLabel="Success animation"
      {...props}
    />
  );
}

export function ConfettiAnimation({
  size = 'xl',
  loop = false,
  className,
  ...props
}: Omit<LottieAnimationProps, 'animation'>) {
  return (
    <LottieAnimation
      animation="confetti"
      size={size}
      loop={loop}
      className={className}
      ariaLabel="Celebration animation"
      {...props}
    />
  );
}

export function LoadingAnimation({
  size = 'sm',
  className,
  ...props
}: Omit<LottieAnimationProps, 'animation'>) {
  return (
    <LottieAnimation
      animation="loading"
      size={size}
      className={className}
      ariaLabel="Loading"
      {...props}
    />
  );
}

// Fallback CSS-based breathing circle for when Lottie isn't available
export function BreathingCircle({
  size = 'lg',
  color = 'sage',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'sage' | 'lavender' | 'ocean' | 'warm';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const colorClasses = {
    sage: 'bg-sage-300 dark:bg-sage-600',
    lavender: 'bg-lavender-300 dark:bg-lavender-600',
    ocean: 'bg-ocean-300 dark:bg-ocean-600',
    warm: 'bg-warm-300 dark:bg-warm-600',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-breathe-slow opacity-70',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="img"
      aria-label="Breathing circle"
    />
  );
}
