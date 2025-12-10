'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Heart,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { MALAYSIA_HOTLINES, EMERGENCY_DISCLAIMER } from '@/lib/constants/hotlines';

const COPING_STRATEGIES = [
  {
    title: 'Deep Breathing',
    titleMs: 'Pernafasan Dalam',
    description: 'Take slow, deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.',
    descriptionMs: 'Ambil nafas perlahan dan dalam. Tarik nafas selama 4 saat, tahan 4, hembus 4.',
    icon: '🌬️',
  },
  {
    title: 'Ground Yourself',
    titleMs: 'Asaskan Diri',
    description: 'Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.',
    descriptionMs: 'Namakan 5 benda yang anda lihat, 4 dengar, 3 rasa, 2 bau, 1 rasa.',
    icon: '🌍',
  },
  {
    title: 'Reach Out',
    titleMs: 'Hubungi Seseorang',
    description: 'Call a trusted friend, family member, or one of the hotlines below.',
    descriptionMs: 'Hubungi rakan, ahli keluarga, atau salah satu talian bantuan di bawah.',
    icon: '🤝',
  },
  {
    title: 'Stay Safe',
    titleMs: 'Kekal Selamat',
    description: 'Remove yourself from any dangerous situation. Go somewhere safe.',
    descriptionMs: 'Jauhkan diri dari sebarang keadaan berbahaya. Pergi ke tempat selamat.',
    icon: '🛡️',
  },
];

const ADDITIONAL_RESOURCES = [
  {
    name: 'Hospital Emergency',
    nameMs: 'Kecemasan Hospital',
    description: 'Go to the nearest hospital emergency department',
    descriptionMs: 'Pergi ke jabatan kecemasan hospital terdekat',
  },
  {
    name: 'Police',
    nameMs: 'Polis',
    description: 'For protection or if someone is in danger',
    descriptionMs: 'Untuk perlindungan atau jika seseorang dalam bahaya',
    number: '999',
  },
  {
    name: 'Women\'s Aid Organization (WAO)',
    nameMs: 'Pertubuhan Bantuan Wanita (WAO)',
    description: 'Support for domestic violence',
    descriptionMs: 'Sokongan untuk keganasan rumah tangga',
    number: '03-7956 3488',
  },
];

export default function EmergencyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              You Are Not Alone
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Help is available 24/7. Please reach out.
            </p>
          </motion.div>

          {/* Emergency Warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  If you are in immediate danger
                </p>
                <p className="text-red-700 dark:text-red-300">
                  {EMERGENCY_DISCLAIMER.en}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hotlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-500" />
              Crisis Hotlines / Talian Krisis
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {MALAYSIA_HOTLINES.map((hotline, index) => (
                <motion.a
                  key={hotline.number}
                  href={`tel:${hotline.number.replace(/\s|-/g, '')}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <GlassCard
                    variant="elevated"
                    className="h-full hover:border-primary-400 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                        <Phone className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white">
                              {hotline.name}
                            </h3>
                            <p className="text-xs text-neutral-500 mb-2">
                              {hotline.nameMs !== hotline.name && hotline.nameMs}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary-500" />
                        </div>
                        <p className="text-2xl font-bold text-primary-600 mb-1">
                          {hotline.number}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Clock className="w-3 h-3" />
                          {hotline.available}
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {hotline.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Coping Strategies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Coping Strategies / Strategi Menangani
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {COPING_STRATEGIES.map((strategy, index) => (
                <motion.div
                  key={strategy.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{strategy.icon}</span>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {strategy.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mb-1">
                          {strategy.titleMs}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {strategy.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Additional Resources / Sumber Tambahan
            </h2>
            <GlassCard>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {ADDITIONAL_RESOURCES.map((resource) => (
                  <div
                    key={resource.name}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {resource.description}
                      </p>
                    </div>
                    {resource.number && (
                      <a
                        href={`tel:${resource.number.replace(/\s|-/g, '')}`}
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        {resource.number}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Message of Hope */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard variant="elevated" className="text-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
              <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                A Message of Hope
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-lg mx-auto">
                Whatever you&apos;re going through, it&apos;s temporary. Many people have felt this way
                and found their way through. You deserve support and care. Please reach out to
                someone who can help.
              </p>
              <p className="text-neutral-500 text-sm italic">
                &quot;Apa jua yang anda lalui, ia sementara. Ramai orang pernah merasai begini
                dan menemui jalan keluar. Anda layak mendapat sokongan dan kasih sayang.
                Sila hubungi seseorang yang boleh membantu.&quot;
              </p>
            </GlassCard>
          </motion.div>

          {/* Back to Assessment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <GlassButton
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Return to Previous Page
            </GlassButton>
          </motion.div>
        </div>
      </main>

      <Footer showEmergencyBanner={false} />
    </div>
  );
}
