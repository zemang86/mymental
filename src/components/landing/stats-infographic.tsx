'use client';

import { motion } from 'framer-motion';
import { Users, Globe, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { BreathingCircle } from '@/components/ui/lottie-animation';

// Animated circle progress
function CircleProgress({
  percentage,
  size = 200,
  strokeWidth = 12,
  delay = 0,
  children
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  children: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-sage-200 dark:text-sage-900"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-sage-500 dark:text-sage-400"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function StatsInfographic() {
  return (
    <div className="w-full">
      <div className="relative bg-gradient-to-r from-sage-50 via-warm-50 to-sage-50 dark:from-sage-950/50 dark:via-neutral-900 dark:to-sage-950/50 rounded-3xl p-8 md:p-12 overflow-hidden">
        {/* Decorative breathing circles */}
        <div className="absolute top-8 right-8 opacity-30 dark:opacity-20 pointer-events-none">
          <BreathingCircle size="xl" color="sage" />
        </div>
        <div className="absolute bottom-12 left-12 opacity-20 dark:opacity-10 pointer-events-none">
          <BreathingCircle size="lg" color="lavender" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Pie charts */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* First circle - 50% worldwide */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <CircleProgress percentage={50} size={180} delay={0}>
                <div className="text-center">
                  <Heart className="w-6 h-6 mx-auto mb-1 text-sage-600 dark:text-sage-400" />
                  <span className="text-3xl font-bold text-sage-800 dark:text-sage-200">50%</span>
                </div>
              </CircleProgress>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-[160px] mx-auto">
                of people worldwide will develop a mental health disorder in their lifetime
              </p>
            </motion.div>

            {/* Second circle - 50% by age 75 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <CircleProgress percentage={50} size={160} strokeWidth={10} delay={0.3}>
                <div className="text-center">
                  <Globe className="w-5 h-5 mx-auto mb-1 text-sage-600 dark:text-sage-400" />
                  <span className="text-2xl font-bold text-sage-800 dark:text-sage-200">50%</span>
                </div>
              </CircleProgress>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-[140px] mx-auto">
                will have experienced at least one disorder by age 75
              </p>
            </motion.div>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-sage-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-sage-800 dark:text-sage-200">
                  Did You Know?
                </h2>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Half the world&apos;s population will face mental health issues.
              </p>
            </motion.div>

            {/* Survey stat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-sage-100 dark:bg-sage-900/50">
                <Users className="w-6 h-6 text-sage-600 dark:text-sage-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-800 dark:text-sage-200">
                  150,000+
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Adults surveyed across 29 countries, Harvard Medical School & University of Queensland
                </p>
              </div>
            </motion.div>

            {/* Malaysia stat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-4 rounded-xl bg-warm-100/80 dark:bg-sage-900/30 border border-warm-200 dark:border-sage-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <span className="font-semibold text-sage-800 dark:text-sage-200">Malaysia Statistics</span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">
                In Malaysia, <span className="font-bold text-sage-600 dark:text-sage-400">29%</span> of adults are affected
                (NHMS 2015, up from 10% in 1996), with <span className="font-semibold">43%</span> in rural East Malaysia
                and <span className="font-semibold">40%</span> in Kuala Lumpur.
              </p>
            </motion.div>

            {/* Sources */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1"
            >
              <p className="font-medium">Source:</p>
              <p>Harvard Medical School & University of Queensland, &quot;Half the World&apos;s Population Will Experience a Mental-Health Disorder,&quot; 2023.</p>
              <p>Institute for Public Health. (2015). National Health & Morbidity Survey 2015. Ministry of Health Malaysia.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
