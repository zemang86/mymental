'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Users,
  Brain,
  Target,
  CheckCircle,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard } from '@/components/ui';

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    titleMs: 'Belas Kasihan',
    description: 'We approach mental health with empathy and understanding.',
    descriptionMs: 'Kami mendekati kesihatan mental dengan empati dan pemahaman.',
  },
  {
    icon: Shield,
    title: 'Privacy',
    titleMs: 'Privasi',
    description: 'Your data is encrypted and never shared without consent.',
    descriptionMs: 'Data anda disulitkan dan tidak pernah dikongsi tanpa kebenaran.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    titleMs: 'Kebolehcapaian',
    description: 'Mental health support for all Malaysians, in English and Bahasa.',
    descriptionMs: 'Sokongan kesihatan mental untuk semua rakyat Malaysia, dalam Bahasa Inggeris dan Bahasa Melayu.',
  },
  {
    icon: Brain,
    title: 'Evidence-Based',
    titleMs: 'Berasaskan Bukti',
    description: 'Our assessments use validated clinical instruments.',
    descriptionMs: 'Penilaian kami menggunakan instrumen klinikal yang disahkan.',
  },
];

const features = [
  'Free mental health screenings',
  'Validated assessment instruments (PHQ-9, GAD-7, etc.)',
  'Bilingual support (English & Bahasa Malaysia)',
  'AI-powered personalized insights',
  'Crisis detection and emergency resources',
  'Self-help interventions and courses',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              About MyMental
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Making mental health support accessible to all Malaysians through
              technology and compassion.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <GlassCard variant="elevated">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Our Mission
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    To break down barriers to mental health care in Malaysia by providing
                    accessible, culturally-sensitive, and evidence-based mental health
                    screening and support.
                  </p>
                  <p className="text-neutral-500 text-sm">
                    Untuk menghapuskan halangan kepada penjagaan kesihatan mental di Malaysia
                    dengan menyediakan saringan dan sokongan kesihatan mental yang mudah diakses,
                    sensitif budaya, dan berasaskan bukti.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <value.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                          {value.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-2">{value.titleMs}</p>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <GlassCard>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                What We Offer
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Important Note
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                MyMental is not a substitute for professional medical advice, diagnosis,
                or treatment. Our screenings are for informational purposes only. If you
                are experiencing a mental health crisis, please contact emergency services
                or call Talian Kasih at 15999.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
