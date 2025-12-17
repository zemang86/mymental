'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  ClipboardList,
  FileText,
  TrendingUp,
  Calendar,
  ChevronRight,
  Loader2,
  Play,
  MessageCircle,
  BookOpen,
  Sparkles,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardStats {
  totalScreenings: number;
  totalAssessments: number;
  areasTracked: number;
  lastActivity: string | null;
  latestRiskLevel: string | null;
  interventionInProgress: boolean;
  currentCondition: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations('assessments');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalScreenings: 0,
    totalAssessments: 0,
    areasTracked: 0,
    lastActivity: null,
    latestRiskLevel: null,
    interventionInProgress: false,
    currentCondition: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/dashboard');
        return;
      }

      setUser(user);

      // Fetch screenings count
      const { data: screenings } = await supabase
        .from('initial_screenings')
        .select('id, overall_risk_level, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch assessments
      const { data: assessments } = await supabase
        .from('assessments')
        .select('id, assessment_type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch intervention progress
      const { data: interventionProgress } = await supabase
        .from('user_intervention_progress')
        .select('condition, current_chapter_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      // Calculate stats
      const uniqueTypes = new Set(assessments?.map((a) => a.assessment_type) || []);
      const latestScreening = screenings?.[0];
      const latestAssessment = assessments?.[0];

      // Determine last activity date
      let lastActivity: string | null = null;
      if (latestScreening && latestAssessment) {
        lastActivity = new Date(latestScreening.created_at) > new Date(latestAssessment.created_at)
          ? latestScreening.created_at
          : latestAssessment.created_at;
      } else {
        lastActivity = latestScreening?.created_at || latestAssessment?.created_at || null;
      }

      setStats({
        totalScreenings: screenings?.length || 0,
        totalAssessments: assessments?.length || 0,
        areasTracked: uniqueTypes.size,
        lastActivity,
        latestRiskLevel: latestScreening?.overall_risk_level || null,
        interventionInProgress: !!interventionProgress?.current_chapter_id,
        currentCondition: interventionProgress?.condition || null,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getRiskLevelColor = (level: string | null) => {
    if (!level) return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600';
    switch (level.toLowerCase()) {
      case 'high':
      case 'imminent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'moderate':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400';
    }
  };

  const quickActions = [
    {
      title: 'Take Screening',
      description: 'Start a mental health screening',
      icon: ClipboardList,
      href: '/start',
      color: 'sage',
      primary: true,
    },
    ...(stats.interventionInProgress && stats.currentCondition
      ? [{
          title: 'Continue Intervention',
          description: `Resume your ${stats.currentCondition} program`,
          icon: Play,
          href: `/interventions/${stats.currentCondition}`,
          color: 'lavender',
          primary: false,
        }]
      : [{
          title: 'Browse Interventions',
          description: 'Explore self-help programs',
          icon: BookOpen,
          href: '/interventions',
          color: 'lavender',
          primary: false,
        }]),
    {
      title: 'AI Chat',
      description: 'Talk to our AI assistant',
      icon: MessageCircle,
      href: '/chat',
      color: 'ocean',
      primary: false,
    },
    {
      title: 'Activities',
      description: 'Try mindfulness exercises',
      icon: Sparkles,
      href: '/activities',
      color: 'warm',
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your mental wellness dashboard
            </p>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 animate-spin text-sage-500" />
            </motion.div>
          ) : (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-8"
              >
                <GlassCard className="text-center">
                  <div className="p-3 bg-sage-100 dark:bg-sage-900/30 rounded-xl w-fit mx-auto mb-3">
                    <ClipboardList className="w-6 h-6 text-sage-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {stats.totalScreenings}
                  </p>
                  <p className="text-sm text-neutral-500">Screenings</p>
                </GlassCard>

                <GlassCard className="text-center">
                  <div className="p-3 bg-ocean-100 dark:bg-ocean-900/30 rounded-xl w-fit mx-auto mb-3">
                    <FileText className="w-6 h-6 text-ocean-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {stats.totalAssessments}
                  </p>
                  <p className="text-sm text-neutral-500">Assessments</p>
                </GlassCard>

                <GlassCard className="text-center">
                  <div className="p-3 bg-lavender-100 dark:bg-lavender-900/30 rounded-xl w-fit mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-lavender-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {stats.areasTracked}
                  </p>
                  <p className="text-sm text-neutral-500">Areas Tracked</p>
                </GlassCard>

                <GlassCard className="text-center">
                  <div className="p-3 bg-warm-100 dark:bg-warm-900/30 rounded-xl w-fit mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-warm-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {stats.lastActivity ? formatDate(stats.lastActivity).split(',')[0] : 'N/A'}
                  </p>
                  <p className="text-sm text-neutral-500">Last Activity</p>
                </GlassCard>
              </motion.div>

              {/* Risk Level Alert (if applicable) */}
              {stats.latestRiskLevel && stats.latestRiskLevel !== 'low' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-8"
                >
                  <GlassCard className={`${getRiskLevelColor(stats.latestRiskLevel)} border-l-4 ${
                    stats.latestRiskLevel === 'high' || stats.latestRiskLevel === 'imminent'
                      ? 'border-l-red-500'
                      : 'border-l-orange-500'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Your recent screening shows {stats.latestRiskLevel} risk level</p>
                        <p className="text-sm opacity-80 mt-1">
                          We recommend exploring our intervention programs or speaking with a professional.
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map((action, index) => (
                    <Link key={action.title} href={action.href}>
                      <GlassCard
                        className={`cursor-pointer hover:border-${action.color}-400 transition-all hover:shadow-lg group ${
                          action.primary ? `bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-900/30 dark:to-sage-800/30 border-sage-200 dark:border-sage-700/50` : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            action.color === 'sage' ? 'bg-sage-100 dark:bg-sage-900/50' :
                            action.color === 'lavender' ? 'bg-lavender-100 dark:bg-lavender-900/50' :
                            action.color === 'ocean' ? 'bg-ocean-100 dark:bg-ocean-900/50' :
                            'bg-warm-100 dark:bg-warm-900/50'
                          }`}>
                            <action.icon className={`w-6 h-6 ${
                              action.color === 'sage' ? 'text-sage-600' :
                              action.color === 'lavender' ? 'text-lavender-600' :
                              action.color === 'ocean' ? 'text-ocean-600' :
                              'text-warm-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 dark:text-white">
                              {action.title}
                            </h3>
                            <p className="text-sm text-neutral-500">
                              {action.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* View History Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-center"
              >
                <Link
                  href="/my-assessments"
                  className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300 font-medium transition-colors"
                >
                  View Assessment History
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer showEmergencyBanner />
    </div>
  );
}
