'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Heart,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';

const features = [
  {
    icon: Brain,
    title: 'Validated Assessments',
    titleMs: 'Penilaian Disahkan',
    description:
      'Clinically validated screening tools including PHQ-9, GAD-7, and more.',
    descriptionMs:
      'Alat saringan yang disahkan secara klinikal termasuk PHQ-9, GAD-7, dan lain-lain.',
  },
  {
    icon: Shield,
    title: 'Safe & Private',
    titleMs: 'Selamat & Peribadi',
    description:
      'Your data is encrypted and protected. We prioritize your privacy.',
    descriptionMs:
      'Data anda disulitkan dan dilindungi. Kami mengutamakan privasi anda.',
  },
  {
    icon: Heart,
    title: 'Personalized Insights',
    titleMs: 'Pandangan Peribadi',
    description:
      'AI-powered recommendations tailored to your unique situation.',
    descriptionMs:
      'Cadangan berkuasa AI yang disesuaikan dengan keadaan unik anda.',
  },
];

const benefits = [
  'Free initial screening',
  'Results in minutes',
  'Professional resources',
  'Malaysian hotlines included',
];

const conditionsScreened = [
  'Depression',
  'Anxiety',
  'OCD',
  'PTSD',
  'Insomnia',
  'And more...',
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Mental Health Screening Platform
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
                  Understand Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-teal-500">
                    Mental Well-being
                  </span>
                </h1>

                <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
                  Take a free, confidential mental health screening to better
                  understand your emotional well-being. Get personalized insights
                  and professional resources.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/start">
                    <GlassButton
                      variant="primary"
                      size="lg"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Take the Test
                    </GlassButton>
                  </Link>
                  <Link href="/about">
                    <GlassButton variant="secondary" size="lg">
                      Learn More
                    </GlassButton>
                  </Link>
                </div>

                {/* Benefits */}
                <div className="mt-10 grid grid-cols-2 gap-3">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right content - Hero Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard variant="elevated" className="relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                        <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          Mental Health Screening
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Quick & Confidential
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-neutral-600 dark:text-neutral-300">
                        Our screening covers multiple conditions:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {conditionsScreened.map((condition) => (
                          <span
                            key={condition}
                            className="px-3 py-1 text-sm rounded-full bg-white/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 border border-white/20 dark:border-neutral-700/30"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 flex items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          ~10 minutes
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          Private & Secure
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/30 dark:bg-neutral-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Why Choose MyMental?
              </h2>
              <p className="mt-4 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                We combine clinical expertise with modern technology to provide
                you with accurate, personalized mental health insights.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl w-fit mb-4">
                      <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard
                variant="elevated"
                className="text-center py-12 px-6"
              >
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  Ready to Take the First Step?
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8">
                  Understanding your mental health is the first step toward
                  well-being. Our screening is free, confidential, and takes
                  only a few minutes.
                </p>
                <Link href="/start">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Start Your Screening
                  </GlassButton>
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
