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
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { StatsInfographic } from '@/components/landing/stats-infographic';

// Unsplash image URLs for conditions (free to use)
const CONDITIONS = [
  { id: 'anxiety', key: 'anxiety', image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=600&fit=crop' },
  { id: 'marital_distress', key: 'maritalDistress', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop' },
  { id: 'ocd', key: 'ocd', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  { id: 'psychosis', key: 'psychosis', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&h=600&fit=crop' },
  { id: 'insomnia', key: 'insomnia', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop' },
  { id: 'sexual_addiction', key: 'sexualAddiction', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop' },
  { id: 'depression', key: 'depression', image: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=800&h=600&fit=crop' },
  { id: 'ptsd', key: 'ptsd', image: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop' },
  { id: 'suicidal', key: 'suicidal', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop' },
];

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
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
                  {t('hero.title')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                    {t('hero.titleHighlight')}
                  </span>
                </h1>

                <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
                  {t('hero.subtitle')}
                </p>

                <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                  {t('hero.cta')}
                </p>

                <div className="mt-8">
                  <Link href="/start">
                    <GlassButton
                      variant="primary"
                      size="lg"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      {t('hero.startButton')}
                    </GlassButton>
                  </Link>
                </div>
              </motion.div>

              {/* Right content - Hero Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-primary-800/10">
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
        <section className="py-8 bg-primary-600 dark:bg-primary-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {t('collaboration')}
              </span>
              <div className="flex items-center gap-8 md:gap-12">
                {/* Partner logos - replace with actual logos */}
                <div className="h-10 px-4 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Az-Zahrah</span>
                </div>
                <div className="h-10 px-4 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">MQA</span>
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
                    <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
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
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
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
        <section className="py-20 bg-primary-800 dark:bg-primary-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONDITIONS.map((condition, index) => (
                <motion.div
                  key={condition.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={condition.image}
                        alt={t(`conditions.${condition.key}.title`)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">
                        {t(`conditions.${condition.key}.title`)}
                      </h3>
                      <Link
                        href={`/test/${condition.id}`}
                        className="text-primary-300 hover:text-primary-200 text-sm font-medium inline-flex items-center gap-1"
                      >
                        {t('conditions.readMore')}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-primary-700 dark:bg-primary-800">
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
                    <Quote className="w-10 h-10 text-primary-300 mb-4" />
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      {testimonial.quote}
                    </p>
                    <p className="text-primary-300 text-sm font-medium">
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
        <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                  {t('cta.title')}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/10"
              >
                <Image
                  src={IMAGES.cta}
                  alt="Mental health support"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
