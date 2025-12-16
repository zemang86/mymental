'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Globe,
  BookOpen,
  Heart,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { MALAYSIA_HOTLINES } from '@/lib/constants/hotlines';

const onlineResources = [
  {
    name: 'Mental Health Association of Malaysia',
    nameMs: 'Persatuan Kesihatan Mental Malaysia',
    url: 'https://mentalhealth.org.my',
    description: 'Resources and support for mental health in Malaysia',
  },
  {
    name: 'Malaysian Mental Health Association',
    nameMs: 'Persatuan Kesihatan Mental Malaysia',
    url: 'https://mmha.org.my',
    description: 'Advocacy and education for mental health awareness',
  },
  {
    name: 'Befrienders Worldwide',
    nameMs: 'Befrienders',
    url: 'https://www.befrienders.org',
    description: 'Emotional support for those in crisis',
  },
];

const selfHelpTopics = [
  {
    title: 'Managing Anxiety',
    titleMs: 'Menguruskan Kebimbangan',
    description: 'Learn techniques to cope with anxiety and worry.',
    link: '/interventions',
  },
  {
    title: 'Understanding Depression',
    titleMs: 'Memahami Kemurungan',
    description: 'Information about depression and coping strategies.',
    link: '/interventions',
  },
  {
    title: 'Sleep Hygiene',
    titleMs: 'Kebersihan Tidur',
    description: 'Tips for better sleep and managing insomnia.',
    link: '/interventions',
  },
  {
    title: 'Mindfulness & Meditation',
    titleMs: 'Kesedaran & Meditasi',
    description: 'Guided practices for mental wellness.',
    link: '/interventions',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Mental Health Resources
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Helpful resources and support for your mental health journey.
            </p>
          </motion.div>

          {/* Emergency Hotlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-500" />
              Crisis Hotlines
            </h2>
            <p className="text-neutral-500 mb-6">
              If you are in crisis, please reach out to these services immediately.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {MALAYSIA_HOTLINES.map((hotline, index) => (
                <motion.div
                  key={hotline.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <GlassCard className="h-full border-red-200 dark:border-red-800/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {hotline.name}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-2">{hotline.nameMs}</p>
                        <a
                          href={`tel:${hotline.number.replace(/[^0-9+]/g, '')}`}
                          className="text-2xl font-bold text-red-600 dark:text-red-400 hover:underline"
                        >
                          {hotline.number}
                        </a>
                        <p className="text-sm text-neutral-500 mt-1">
                          {hotline.available}
                        </p>
                      </div>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => window.open(`tel:${hotline.number.replace(/[^0-9+]/g, '')}`)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Phone className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Self-Help Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sage-500" />
              Self-Help Courses
            </h2>
            <p className="text-neutral-500 mb-6">
              Learn coping strategies and techniques at your own pace.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {selfHelpTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <GlassCard
                    className="h-full cursor-pointer hover:border-sage-400 transition-colors"
                    onClick={() => window.location.href = topic.link}
                  >
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-2">{topic.titleMs}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      {topic.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Online Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <Globe className="w-6 h-6 text-sage-500" />
              Online Resources
            </h2>
            <p className="text-neutral-500 mb-6">
              Trusted organizations for mental health information and support.
            </p>
            <div className="space-y-4">
              {onlineResources.map((resource, index) => (
                <motion.div
                  key={resource.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-neutral-500">{resource.description}</p>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sage-600 hover:text-sage-700"
                      >
                        Visit <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard variant="elevated" className="text-center">
              <MessageCircle className="w-12 h-12 text-sage-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Need Someone to Talk To?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Our AI assistant is available 24/7 to provide guidance and support.
              </p>
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/chat'}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </GlassButton>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
