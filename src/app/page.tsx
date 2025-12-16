'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Play,
  ChevronDown,
  ChevronUp,
  Quote,
  Sparkles,
  Heart,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { StatsInfographic } from '@/components/landing/stats-infographic';
import { BreathingCircle } from '@/components/ui/lottie-animation';

import { Wind, Moon, Brain, Users, Shield, Frown, AlertTriangle, Heart as HeartIcon, Activity } from 'lucide-react';

// Conditions with icons and colors for wellness feel
const CONDITIONS = [
  { id: 'anxiety', key: 'anxiety', icon: Wind, color: 'lavender', image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=600&fit=crop' },
  { id: 'depression', key: 'depression', icon: Frown, color: 'ocean', image: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=800&h=600&fit=crop' },
  { id: 'insomnia', key: 'insomnia', icon: Moon, color: 'sage', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop' },
  { id: 'ptsd', key: 'ptsd', icon: Shield, color: 'warm', image: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop' },
  { id: 'ocd', key: 'ocd', icon: Brain, color: 'lavender', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  { id: 'marital_distress', key: 'maritalDistress', icon: Users, color: 'ocean', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop' },
  { id: 'psychosis', key: 'psychosis', icon: Activity, color: 'warm', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&h=600&fit=crop' },
  { id: 'sexual_addiction', key: 'sexualAddiction', icon: HeartIcon, color: 'sage', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop' },
  { id: 'suicidal', key: 'suicidal', icon: AlertTriangle, color: 'warm', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop' },
];

// Color styles for condition cards
const conditionColorStyles: Record<string, { bg: string; icon: string; text: string }> = {
  sage: {
    bg: 'bg-sage-50 dark:bg-sage-900/20 border-sage-200/60 dark:border-sage-700/30 hover:border-sage-300 dark:hover:border-sage-600',
    icon: 'bg-sage-100 dark:bg-sage-800/50 text-sage-600 dark:text-sage-400',
    text: 'text-sage-600 dark:text-sage-400',
  },
  lavender: {
    bg: 'bg-lavender-50 dark:bg-lavender-900/20 border-lavender-200/60 dark:border-lavender-700/30 hover:border-lavender-300 dark:hover:border-lavender-600',
    icon: 'bg-lavender-100 dark:bg-lavender-800/50 text-lavender-600 dark:text-lavender-400',
    text: 'text-lavender-600 dark:text-lavender-400',
  },
  ocean: {
    bg: 'bg-ocean-50 dark:bg-ocean-900/20 border-ocean-200/60 dark:border-ocean-700/30 hover:border-ocean-300 dark:hover:border-ocean-600',
    icon: 'bg-ocean-100 dark:bg-ocean-800/50 text-ocean-600 dark:text-ocean-400',
    text: 'text-ocean-600 dark:text-ocean-400',
  },
  warm: {
    bg: 'bg-warm-50 dark:bg-warm-900/20 border-warm-200/60 dark:border-warm-700/30 hover:border-warm-300 dark:hover:border-warm-600',
    icon: 'bg-warm-100 dark:bg-warm-800/50 text-warm-600 dark:text-warm-400',
    text: 'text-warm-600 dark:text-warm-400',
  },
};

// Hero and other images from Unsplash
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
  video: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1280&h=720&fit=crop',
  cta: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
};

// Testimonials
const TESTIMONIALS = [
  {
    quote: 'Ujian saringan MyMental buat saya sedar yang kekuatan saya sebenarnya lebih dan yang saya sangka. Tiap la bagi saya perpustakaan dan keyakinan untuk dapatkan sokongan yang tepat.',
    author: 'Anonymous User',
  },
  {
    quote: 'MyMental buat saya sedar yang jaga kesihatan mental tu sebenarnya satu kekuatan. Setiap soal baris saya berkembang sebagai diri sendiri dan hadapi hidup dengan lebih yakin.',
    author: 'Anonymous User',
  },
  {
    quote: 'Ujian saringan MyMental buat saya lebih faham diri sendiri dan jadi titik mula untuk saya mengubah ke arah kesihatan mental yang lebih baik.',
    author: 'Anonymous User',
  },
];

export default function HomePage() {
  const t = useTranslations('home');
  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-16 lg:py-24 overflow-hidden">
          {/* Decorative breathing circles - calming background elements */}
          <div className="absolute top-20 left-10 opacity-20 dark:opacity-10 pointer-events-none">
            <BreathingCircle size="xl" color="sage" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-15 dark:opacity-10 pointer-events-none">
            <BreathingCircle size="lg" color="lavender" />
          </div>
          <div className="absolute top-1/2 right-1/4 opacity-10 dark:opacity-5 pointer-events-none hidden lg:block">
            <BreathingCircle size="md" color="ocean" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Wellness badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100/80 dark:bg-sage-900/30 border border-sage-200/50 dark:border-sage-700/30 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                  <span className="text-sm font-medium text-sage-700 dark:text-sage-300">
                    Your mental wellness journey starts here
                  </span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
                  {t('hero.title')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-400">
                    {t('hero.titleHighlight')}
                  </span>
                </h1>

                <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
                  {t('hero.subtitle')}
                </p>

                <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                  {t('hero.cta')}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/start">
                    <GlassButton
                      variant="primary"
                      size="lg"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      {t('hero.startButton')}
                    </GlassButton>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <Heart className="w-4 h-4 text-sage-500" />
                    <span>Free & confidential</span>
                  </div>
                </div>
              </motion.div>

              {/* Right content - Hero Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                {/* Soft glow behind image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-sage-200/30 via-lavender-200/20 to-warm-200/30 dark:from-sage-800/20 dark:via-lavender-800/10 dark:to-warm-800/20 rounded-[2rem] blur-2xl" />

                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-sage-100 to-sage-50 dark:from-sage-900/20 dark:to-sage-800/10 border border-white/50 dark:border-sage-700/30 shadow-xl">
                  <Image
                    src={IMAGES.hero}
                    alt="Person taking a moment for mental health"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Collaboration Section */}
        <section className="py-8 bg-sage-600 dark:bg-sage-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {t('collaboration')}
              </span>
              <div className="flex items-center gap-8 md:gap-12">
                {/* Partner logos */}
                <div className="h-12 px-4 bg-white/90 rounded-lg flex items-center justify-center">
                  <Image
                    src="https://mymental.online/assets/images/home/az_zahrah_logo_landing.svg"
                    alt="Az-Zahrah"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="h-12 px-4 bg-white/90 rounded-lg flex items-center justify-center">
                  <Image
                    src="https://mymental.online/assets/images/home/ukm_logo_landing.svg"
                    alt="UKM"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="h-12 px-4 bg-white/90 rounded-lg flex items-center justify-center">
                  <Image
                    src="https://mymental.online/assets/images/home/logo_hk.png"
                    alt="HK"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard variant="elevated" className="overflow-hidden">
                <div className="relative aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center group cursor-pointer overflow-hidden">
                  <Image
                    src={IMAGES.video}
                    alt="Why MyMental video"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <button className="relative z-10 w-20 h-20 rounded-full bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-sage-600 ml-1" fill="currentColor" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Statistics/Infographic Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <StatsInfographic />
          </div>
        </section>

        {/* Early Signs Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-50/50 to-transparent dark:via-sage-950/20 pointer-events-none" />

          {/* Decorative element */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <BreathingCircle size="xl" color="warm" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-sage-500" />
                  <span className="text-sm font-medium text-sage-600 dark:text-sage-400">Self-awareness matters</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                  {t('earlySigns.title')}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  {t('earlySigns.description')}{' '}
                  <strong className="text-neutral-900 dark:text-white">
                    {t('earlySigns.cta')}
                  </strong>
                </p>

                <Link href="/start">
                  <GlassButton
                    variant="primary"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {t('earlySigns.button')}
                  </GlassButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Conditions Section */}
        <section className="py-20 bg-gradient-to-b from-warm-50 to-white dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 opacity-20 pointer-events-none">
            <BreathingCircle size="xl" color="lavender" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-15 pointer-events-none">
            <BreathingCircle size="lg" color="ocean" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-sage-500" />
                <span className="text-sm font-medium text-sage-600 dark:text-sage-400">Understanding Mental Health</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                {t('conditions.title')}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                {t('conditions.subtitle')}
              </p>
            </motion.div>

            {/* Conditions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CONDITIONS.map((condition, index) => {
                const Icon = condition.icon;
                const colors = conditionColorStyles[condition.color];

                return (
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/test/${condition.id}`}>
                      <motion.div
                        className={`group relative rounded-3xl overflow-hidden border p-5 transition-all duration-300 cursor-pointer ${colors.bg}`}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Card Content */}
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                            <Icon className="w-6 h-6" />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors">
                              {t(`conditions.${condition.key}.title`)}
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3">
                              {t(`conditions.${condition.key}.description`) || 'Take a quick assessment to understand your symptoms better.'}
                            </p>

                            {/* CTA */}
                            <span className={`inline-flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                              Take Assessment
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>

                        {/* Subtle background decoration */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-current pointer-events-none" />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-sage-700 dark:bg-sage-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
                    <Quote className="w-10 h-10 text-sage-300 mb-4" />
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      {testimonial.quote}
                    </p>
                    <p className="text-sage-300 text-sm font-medium">
                      - {testimonial.author}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentTestimonial === index
                      ? 'bg-white'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {t('faq.title')}
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <GlassCard className="overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left p-0"
                    >
                      <span className="font-medium text-neutral-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
                      >
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900 relative overflow-hidden">
          {/* Background decoration - breathing circles */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="absolute top-20 right-20 opacity-20 pointer-events-none">
            <BreathingCircle size="xl" color="sage" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-15 pointer-events-none">
            <BreathingCircle size="lg" color="lavender" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-sage-300" />
                  <span className="text-sm font-medium text-sage-300">Take the first step</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                  {t('cta.title')}
                </h2>
                <Link href="/start">
                  <GlassButton
                    variant="secondary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="bg-white/90 hover:bg-white text-sage-800"
                  >
                    Start Your Journey
                  </GlassButton>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                {/* Soft glow behind image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-sage-500/20 to-lavender-500/20 rounded-[2rem] blur-2xl" />

                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/10 border border-white/20 shadow-2xl">
                  <Image
                    src={IMAGES.cta}
                    alt="Mental health support"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
