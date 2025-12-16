'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  User,
  UserPlus,
  Lock,
  ArrowRight,
  ArrowDown,
  DollarSign,
  Shield,
  FileText,
  MessageSquare,
  Heart,
  Crown,
  Settings,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard } from '@/components/ui';

interface TestItem {
  id: string;
  title: string;
  description?: string;
  subitems?: TestItem[];
}

interface TestSection {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'standard';
  items: TestItem[];
}

const TESTING_DATA: TestSection[] = [
  {
    id: 'crisis',
    title: 'Crisis Management & Triage System',
    priority: 'critical',
    items: [
      {
        id: 'crisis-1',
        title: 'Imminent Risk Detection',
        description: 'Test suicidal ideation triggers',
      },
      {
        id: 'crisis-2',
        title: 'Emergency Modal',
        description: 'Verify closable modal still shows resources',
      },
      {
        id: 'crisis-3',
        title: 'Crisis Hotlines',
        description: 'Verify all Malaysian crisis numbers are current',
      },
      {
        id: 'crisis-4',
        title: 'Risk Level Escalation',
        description: 'Test all triage pathways (low → moderate → high → imminent)',
      },
      {
        id: 'crisis-5',
        title: 'Chat Blocking',
        description: 'Verify high-risk users cannot access chat',
      },
      {
        id: 'crisis-6',
        title: 'Triage Event Logging',
        description: 'Confirm all risk events are logged in database',
      },
    ],
  },
  {
    id: 'darkmode',
    title: 'Dark Mode Functionality',
    priority: 'critical',
    items: [
      {
        id: 'dark-1',
        title: 'Theme Toggle',
        description: 'Test toggle button on all pages',
      },
      {
        id: 'dark-2',
        title: 'Text Visibility',
        description: 'Check all text is readable in both modes',
      },
      {
        id: 'dark-3',
        title: 'Component Styling',
        description: 'Verify all UI components in dark mode',
        subitems: [
          { id: 'dark-3-1', title: 'GlassButton (all variants)' },
          { id: 'dark-3-2', title: 'GlassCard (all variants)' },
          { id: 'dark-3-3', title: 'GlassModal (default & emergency)' },
          { id: 'dark-3-4', title: 'GlassInput (all states)' },
          { id: 'dark-3-5', title: 'Navigation menus' },
          { id: 'dark-3-6', title: 'Footer' },
          { id: 'dark-3-7', title: 'Admin dashboard' },
        ],
      },
      {
        id: 'dark-4',
        title: 'Background Colors',
        description: 'Verify solid colors (white/off-black, no gradients)',
      },
      {
        id: 'dark-5',
        title: 'Forms',
        description: 'Test all forms in dark mode (login, register, assessments)',
      },
      {
        id: 'dark-6',
        title: 'Assessment Flow',
        description: 'Complete full assessment in dark mode',
      },
      {
        id: 'dark-7',
        title: 'Mobile Responsiveness',
        description: 'Test dark mode on mobile devices',
      },
      {
        id: 'dark-8',
        title: 'Theme Persistence',
        description: 'Verify theme preference is saved across sessions',
      },
    ],
  },
  {
    id: 'email',
    title: 'Email Delivery',
    priority: 'critical',
    items: [
      {
        id: 'email-1',
        title: 'OTP Codes',
        description: 'Test magic link email delivery to various providers',
        subitems: [
          { id: 'email-1-1', title: 'Gmail' },
          { id: 'email-1-2', title: 'Outlook/Hotmail' },
          { id: 'email-1-3', title: 'Yahoo Mail' },
          { id: 'email-1-4', title: 'Malaysian providers (Maxis, TM, etc.)' },
        ],
      },
      {
        id: 'email-2',
        title: 'Assessment Results',
        description: 'Test results email after payment',
      },
      {
        id: 'email-3',
        title: 'Spam Filtering',
        description: 'Check if emails land in spam folders',
      },
      {
        id: 'email-4',
        title: 'Email Content',
        description: 'Verify bilingual content (EN/MS)',
      },
      {
        id: 'email-5',
        title: 'From Address',
        description: 'Confirm noreply@kitamen.my displays correctly',
      },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment Accuracy',
    priority: 'critical',
    items: [
      {
        id: 'assess-1',
        title: 'Scoring Algorithms',
        description: 'Validate all assessment scoring',
        subitems: [
          { id: 'assess-1-1', title: 'PHQ-9 (Depression)' },
          { id: 'assess-1-2', title: 'AST (Anxiety)' },
          { id: 'assess-1-3', title: 'SEGIST (Insomnia)' },
          { id: 'assess-1-4', title: 'PTSD Checklist' },
          { id: 'assess-1-5', title: 'YSAS (Suicidal Ideation)' },
          { id: 'assess-1-6', title: 'OCD Screening' },
          { id: 'assess-1-7', title: 'Psychosis Screening' },
          { id: 'assess-1-8', title: 'Sexual Addiction Screening' },
          { id: 'assess-1-9', title: 'Marital Distress' },
        ],
      },
      {
        id: 'assess-2',
        title: 'Severity Classification',
        description: 'Test threshold boundaries',
      },
      {
        id: 'assess-3',
        title: 'Bilingual Consistency',
        description: 'Ensure EN/MS versions produce same scores',
      },
    ],
  },
  {
    id: 'ux',
    title: 'User Experience',
    priority: 'high',
    items: [
      {
        id: 'ux-1',
        title: 'Assessment Flow',
        description: 'Complete end-to-end assessment flow',
      },
      {
        id: 'ux-2',
        title: 'Progress Saving',
        description: 'Test auto-save and resume functionality',
      },
      {
        id: 'ux-3',
        title: 'Mobile Experience',
        description: 'Test on iOS and Android devices',
      },
      {
        id: 'ux-4',
        title: 'Browser Compatibility',
        description: 'Test on multiple browsers',
        subitems: [
          { id: 'ux-4-1', title: 'Chrome' },
          { id: 'ux-4-2', title: 'Safari' },
          { id: 'ux-4-3', title: 'Firefox' },
          { id: 'ux-4-4', title: 'Edge' },
          { id: 'ux-4-5', title: 'Mobile browsers' },
        ],
      },
      {
        id: 'ux-5',
        title: 'Language Switching',
        description: 'Test EN ↔ MS switching mid-flow',
      },
      {
        id: 'ux-6',
        title: 'Loading States',
        description: 'Verify all async operations show loading indicators',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Features',
    priority: 'high',
    items: [
      {
        id: 'ai-1',
        title: 'Chat Support',
        description: 'Test AI responses for appropriateness',
      },
      {
        id: 'ai-2',
        title: 'RAG Integration',
        description: 'Verify knowledge base retrieval works',
      },
      {
        id: 'ai-3',
        title: 'Crisis Detection',
        description: 'Test if AI detects crisis language',
      },
      {
        id: 'ai-4',
        title: 'Safety Guardrails',
        description: 'Verify AI refuses harmful requests',
      },
      {
        id: 'ai-5',
        title: 'Insights Generation',
        description: 'Test AI-generated insights quality',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Subscription & Payment',
    priority: 'high',
    items: [
      {
        id: 'pay-1',
        title: 'Payment Flow',
        description: 'Test checkout process (simulation mode)',
      },
      {
        id: 'pay-2',
        title: 'Subscription Management',
        description: 'Test upgrade/downgrade flows',
      },
      {
        id: 'pay-3',
        title: 'Premium Features',
        description: 'Verify premium content access control',
      },
      {
        id: 'pay-4',
        title: 'Payment Gate',
        description: 'Test 2nd screening payment requirement (when implemented)',
      },
    ],
  },
  {
    id: 'auth',
    title: 'Authentication',
    priority: 'standard',
    items: [
      {
        id: 'auth-1',
        title: 'Magic Link Login',
        description: 'Test OTP code delivery and verification',
      },
      {
        id: 'auth-2',
        title: 'Session Management',
        description: 'Test session persistence and logout',
      },
      {
        id: 'auth-3',
        title: 'Registration',
        description: 'Test user registration flow',
      },
      {
        id: 'auth-4',
        title: 'Account Settings',
        description: 'Test profile updates',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin Dashboard',
    priority: 'standard',
    items: [
      {
        id: 'admin-1',
        title: 'Admin Login',
        description: 'Test admin authentication',
      },
      {
        id: 'admin-2',
        title: 'User Management',
        description: 'Test user CRUD operations',
      },
      {
        id: 'admin-3',
        title: 'Alert Management',
        description: 'Test crisis alert handling',
      },
      {
        id: 'admin-4',
        title: 'Audit Logs',
        description: 'Verify all admin actions are logged',
      },
      {
        id: 'admin-5',
        title: 'Reports',
        description: 'Test analytics and reporting features',
      },
      {
        id: 'admin-6',
        title: 'Data Export',
        description: 'Test data export functionality',
      },
    ],
  },
  {
    id: 'interventions',
    title: 'Interventions',
    priority: 'standard',
    items: [
      {
        id: 'inter-1',
        title: 'Module Access',
        description: 'Test free vs premium content access',
      },
      {
        id: 'inter-2',
        title: 'Progress Tracking',
        description: 'Test chapter completion tracking',
      },
      {
        id: 'inter-3',
        title: 'Video Playback',
        description: 'Test video player functionality',
      },
      {
        id: 'inter-4',
        title: 'Exercise Completion',
        description: 'Test exercise marking system',
      },
    ],
  },
];

function TestItemComponent({
  item,
  checked,
  onToggle,
  level = 0,
}: {
  item: TestItem;
  checked: boolean;
  onToggle: (id: string) => void;
  level?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSubitems = item.subitems && item.subitems.length > 0;

  return (
    <div className={level > 0 ? 'ml-6' : ''}>
      <div
        className={`flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors ${
          checked ? 'opacity-60' : ''
        }`}
      >
        <button
          onClick={() => onToggle(item.id)}
          className="mt-0.5 flex-shrink-0"
        >
          {checked ? (
            <CheckCircle2 className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          ) : (
            <Circle className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {hasSubitems && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex-shrink-0 mt-0.5"
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            )}
            <div className="flex-1">
              <h4
                className={`font-medium text-neutral-900 dark:text-white ${
                  checked ? 'line-through' : ''
                }`}
              >
                {item.title}
              </h4>
              {item.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {hasSubitems && expanded && (
            <div className="mt-2 space-y-2">
              {item.subitems!.map((subitem) => (
                <TestItemComponent
                  key={subitem.id}
                  item={subitem}
                  checked={checked}
                  onToggle={onToggle}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TestSection({
  section,
  checkedItems,
  onToggle,
}: {
  section: TestSection;
  checkedItems: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const totalItems = section.items.reduce((acc, item) => {
    return acc + 1 + (item.subitems?.length || 0);
  }, 0);

  const checkedCount = section.items.reduce((acc, item) => {
    let count = checkedItems.has(item.id) ? 1 : 0;
    if (item.subitems) {
      count += item.subitems.filter((sub) => checkedItems.has(sub.id)).length;
    }
    return acc + count;
  }, 0);

  const progress = (checkedCount / totalItems) * 100;

  const priorityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    standard: 'bg-blue-500',
  };

  const priorityIcons = {
    critical: <AlertCircle className="w-5 h-5" />,
    high: <AlertTriangle className="w-5 h-5" />,
    standard: <CheckSquare className="w-5 h-5" />,
  };

  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div
            className={`${priorityColors[section.priority]} text-white p-2 rounded-lg`}
          >
            {priorityIcons[section.priority]}
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {section.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {checkedCount} of {totalItems} completed ({progress.toFixed(0)}%)
            </p>
          </div>
        </div>

        {expanded ? (
          <ChevronDown className="w-6 h-6 text-neutral-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-6 h-6 text-neutral-500 flex-shrink-0" />
        )}
      </button>

      {/* Progress bar */}
      <div className="px-6">
        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${priorityColors[section.priority]}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {expanded && (
        <div className="p-6 pt-4 space-y-1">
          {section.items.map((item) => (
            <TestItemComponent
              key={item.id}
              item={item}
              checked={checkedItems.has(item.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default function ProgressPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const criticalSections = TESTING_DATA.filter((s) => s.priority === 'critical');
  const highSections = TESTING_DATA.filter((s) => s.priority === 'high');
  const standardSections = TESTING_DATA.filter((s) => s.priority === 'standard');

  const totalItems = TESTING_DATA.reduce((acc, section) => {
    return (
      acc +
      section.items.reduce((itemAcc, item) => {
        return itemAcc + 1 + (item.subitems?.length || 0);
      }, 0)
    );
  }, 0);

  const totalChecked = checkedItems.size;
  const overallProgress = (totalChecked / totalItems) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-sage-50 to-teal-50 dark:from-neutral-900 dark:to-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white">
                MyMental Platform Summary
              </h1>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Complete platform overview, features, and QA testing progress
              </p>

              {/* Overall Implementation Progress */}
              <div className="mt-8 max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Platform Implementation Status
                  </span>
                  <span className="text-sm font-bold text-sage-600 dark:text-sage-400">
                    86% Complete
                  </span>
                </div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: '86%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-center">
                  Based on actual implementation of core systems (Assessment, Referral, Intervention, Email, Admin, Payment, UI)
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GlassCard>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                📱 Project Overview
              </h2>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                MyMental is a comprehensive mental health assessment and support platform built for the Malaysian population. It provides culturally-appropriate mental health screening tools, AI-powered insights, and self-help interventions.
              </p>

              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                🛠️ Tech Stack
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Frontend</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Backend</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Next.js API Routes, Supabase (PostgreSQL + Auth)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">AI</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Anthropic Claude API with RAG (Retrieval-Augmented Generation)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Styling</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Glass morphism UI design system with dark mode support</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">i18n</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Bilingual support (English & Bahasa Malaysia)</p>
                </div>
              </div>

              <div className="bg-sage-50 dark:bg-sage-900/20 rounded-xl p-6 border border-sage-200 dark:border-sage-800">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  🎯 Recent Updates (December 16, 2025)
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 dark:text-sage-400 mb-2">✅ Dark Mode Implementation</h4>
                    <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                      <li>Full dark mode support with theme toggle</li>
                      <li>Floating theme toggle button (bottom-right corner)</li>
                      <li>Updated all UI components for dark mode</li>
                      <li>Simplified background to solid colors</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-700 dark:text-sage-400 mb-2">✅ Email Domain Configuration</h4>
                    <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                      <li>Updated to verified domain: noreply@kitamen.my</li>
                      <li>All email functions updated (OTP, results)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-700 dark:text-sage-400 mb-2">✅ Emergency Modal Updates</h4>
                    <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                      <li>Emergency modal now closable at all risk levels</li>
                      <li>Users can save progress while viewing crisis resources</li>
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* User Flow Diagram */}
        <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
              🗺️ User Journey & Platform Flow
            </h2>
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Complete user flow from entry to exit, including paywall placement and feature access
            </p>

            {/* Main Flow Diagram */}
            <div className="grid gap-6 mb-8">
              {/* Entry Point */}
              <GlassCard className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-2 border-blue-300 dark:border-blue-700">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-3">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    1. User Entry
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                    Anonymous or Registered user lands on homepage
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-full border border-blue-300 dark:border-blue-700">
                      <User className="inline w-3 h-3 mr-1" /> Anonymous
                    </span>
                    <span className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-full border border-blue-300 dark:border-blue-700">
                      <UserPlus className="inline w-3 h-3 mr-1" /> New Registration
                    </span>
                    <span className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-full border border-blue-300 dark:border-blue-700">
                      <Lock className="inline w-3 h-3 mr-1" /> Existing Login
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowDown className="w-6 h-6 text-neutral-400" />
              </div>

              {/* Initial Screening */}
              <GlassCard className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-2 border-green-300 dark:border-green-700">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    2. Initial Screening (FREE)
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                    PHQ-9, AST, SEGIST, YSAS + Social Functioning
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-green-300 dark:border-green-700">
                      <p className="font-semibold text-neutral-900 dark:text-white">Route: /screening</p>
                      <p className="text-neutral-600 dark:text-neutral-400">Basic 4 instruments</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-green-300 dark:border-green-700">
                      <p className="font-semibold text-neutral-900 dark:text-white">Route: /social</p>
                      <p className="text-neutral-600 dark:text-neutral-400">Social functioning assessment</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-green-300 dark:border-green-700">
                      <p className="font-semibold text-neutral-900 dark:text-white">Real-Time Triage</p>
                      <p className="text-neutral-600 dark:text-neutral-400">Crisis detection active</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* High Risk Detection Branch */}
              <div className="grid md:grid-cols-2 gap-4">
                <GlassCard className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-2 border-red-300 dark:border-red-700">
                  <div className="flex items-start gap-3">
                    <Shield className="w-10 h-10 text-red-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white mb-2">
                        🚨 High/Imminent Risk Path
                      </h4>
                      <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                        <li>• Emergency modal displays (closable)</li>
                        <li>• Crisis hotlines shown (Befrienders, Talian Kasih)</li>
                        <li>• Auto-referral created</li>
                        <li>• Admin alert triggered</li>
                        <li>• Email sent with professional directory</li>
                        <li>• Chat access blocked</li>
                      </ul>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-2 border-green-300 dark:border-green-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white mb-2">
                        ✅ Low/Moderate Risk Path
                      </h4>
                      <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                        <li>• Preliminary results shown</li>
                        <li>• Brief scores summary</li>
                        <li>• General recommendations</li>
                        <li>• Continues to normal flow</li>
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowDown className="w-6 h-6 text-neutral-400" />
              </div>

              {/* PAYWALL - 2nd Screening Results */}
              <GlassCard className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/50 dark:to-orange-900/50 border-4 border-yellow-400 dark:border-yellow-600 shadow-xl">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full mb-3 animate-pulse">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    💳 PAYWALL - Full Results Access
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                    <strong>Route: /results/preliminary → Payment Gate → /results/full</strong>
                  </p>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border-2 border-yellow-400 dark:border-yellow-600 mb-4">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                      <strong className="text-yellow-700 dark:text-yellow-400">⚠️ PLANNED (NOT YET IMPLEMENTED):</strong> After completing social functioning assessment,<br />users must pay to see full 2nd screening results
                    </p>
                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2 bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950/50 dark:to-sage-900/50 rounded-lg border border-sage-300 dark:border-sage-700">
                        <p className="font-bold text-sage-700 dark:text-sage-400">FREE</p>
                        <p className="text-neutral-700 dark:text-neutral-300">Initial assessments</p>
                      </div>
                      <div className="p-2 bg-gradient-to-br from-sage-100 to-sage-200 dark:from-sage-900/70 dark:to-sage-800/70 rounded-lg border-2 border-sage-500 dark:border-sage-600">
                        <p className="font-bold text-sage-700 dark:text-sage-300">RM29 / 6 months</p>
                        <p className="text-neutral-700 dark:text-neutral-300">Premium - 6 Months</p>
                      </div>
                      <div className="p-2 bg-gradient-to-br from-sage-100 to-sage-200 dark:from-sage-900/70 dark:to-sage-800/70 rounded-lg border-2 border-sage-500 dark:border-sage-600">
                        <p className="font-bold text-sage-700 dark:text-sage-300">RM45 / year</p>
                        <p className="text-neutral-700 dark:text-neutral-300">Premium - Yearly</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      <p className="font-semibold mb-1">Payment Options (PLANNED):</p>
                      <p>• Stripe (International cards)</p>
                      <p>• Billplz (Malaysian FPX)</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowDown className="w-6 h-6 text-neutral-400" />
              </div>

              {/* Post-Payment Split */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Free Tier */}
                <GlassCard className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-700/50 border-2 border-neutral-300 dark:border-neutral-600">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-500 text-white rounded-full mb-3">
                      <User className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                      Free Tier Access
                    </h4>
                    <div className="text-left space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300">Basic assessments (screening only)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300">Preliminary results (score ranges)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300">Free interventions access</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300">Basic chat (rate limited)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Circle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-500 dark:text-neutral-400 line-through">Full detailed results</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Circle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-500 dark:text-neutral-400 line-through">Premium interventions</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Circle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-500 dark:text-neutral-400 line-through">Advanced assessments</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Circle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-500 dark:text-neutral-400 line-through">AI insights</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Premium Tier */}
                <GlassCard className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950/50 dark:to-sage-900/50 border-2 border-sage-500 dark:border-sage-600 shadow-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-full mb-3">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                      Premium Access 👑
                    </h4>
                    <div className="text-left space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>All assessments</strong> (9 instruments)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>Full detailed results</strong> with insights</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>Email results delivery</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>All interventions</strong> (videos, quizzes)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>Unlimited AI chat</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>AI-generated insights</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>Progress tracking</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300"><strong>Priority support</strong></span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowDown className="w-6 h-6 text-neutral-400" />
              </div>

              {/* Core Features */}
              <GlassCard className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/50 dark:to-cyan-900/50 border-2 border-teal-300 dark:border-teal-700">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
                  4. Core Platform Features
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-teal-300 dark:border-teal-700 text-center">
                    <MessageSquare className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">AI Chat</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">/chat</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Claude-powered support</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-teal-300 dark:border-teal-700 text-center">
                    <Heart className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">Interventions</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">/interventions</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Self-help programs</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-teal-300 dark:border-teal-700 text-center">
                    <FileText className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">My Assessments</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">/my-assessments</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">History & tracking</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-teal-300 dark:border-teal-700 text-center">
                    <Shield className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">Referrals</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">/referrals</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Professional help</p>
                  </div>
                </div>
              </GlassCard>

              {/* Admin Flow */}
              <GlassCard className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-2 border-purple-300 dark:border-purple-700">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full mb-3">
                    <Settings className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                    Admin Dashboard (Separate Flow)
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-purple-300 dark:border-purple-700">
                      <p className="font-semibold text-neutral-900 dark:text-white">User Management</p>
                      <p className="text-neutral-600 dark:text-neutral-400">/admin/users</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-purple-300 dark:border-purple-700">
                      <p className="font-semibold text-neutral-900 dark:text-white">Crisis Alerts</p>
                      <p className="text-neutral-600 dark:text-neutral-400">/admin/alerts</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-purple-300 dark:border-purple-700">
                      <p className="font-semibold text-neutral-900 dark:text-white">Referral Management</p>
                      <p className="text-neutral-600 dark:text-neutral-400">/admin/referrals</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Flow Summary */}
            <GlassCard className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-700">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                📋 Flow Summary
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Current Implementation (LIVE):</h4>
                  <ul className="space-y-1 text-neutral-700 dark:text-neutral-300 text-xs">
                    <li>✅ Anonymous users can start assessments</li>
                    <li>✅ Real-time crisis detection & emergency modals</li>
                    <li>✅ Auto-referral for high-risk users</li>
                    <li>✅ Free tier shows preliminary results</li>
                    <li>✅ Premium users get full access (simulation mode)</li>
                    <li>✅ Email delivery (OTP, results, referrals)</li>
                    <li>✅ Admin dashboard with alerts & management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Planned (NOT Implemented):</h4>
                  <ul className="space-y-1 text-neutral-700 dark:text-neutral-300 text-xs">
                    <li>❌ Payment gate after 2nd screening</li>
                    <li>❌ Real Stripe/Billplz integration</li>
                    <li>❌ Premium pricing tiers (RM29/6mo, RM45/year)</li>
                    <li>❌ Payment confirmation emails</li>
                    <li>❌ Subscription upgrade/downgrade flows</li>
                    <li>❌ Admin quiz builder & intervention editor</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Implementation Status */}
        <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              📊 Implementation Status
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Complete Systems */}
              <GlassCard className="border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-4">
                  ✅ 100% Complete
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Core Assessment System:</strong> All 9 instruments, scoring, triage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Professional Referral System:</strong> Directory, automatic triggers, admin dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Dark Mode & UI:</strong> Theme toggle, all components updated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Database Schema:</strong> All tables, RLS, indexes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Security:</strong> Row Level Security on all tables</span>
                  </li>
                </ul>
              </GlassCard>

              {/* Nearly Complete */}
              <GlassCard className="border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">
                  📈 90-95% Complete
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">⬆</span>
                    <span><strong>Intervention System (95%):</strong> Video, quizzes, progress tracking (Lottie animations UI pending)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">⬆</span>
                    <span><strong>Email System (90%):</strong> Resend setup, results & crisis emails (payment emails missing)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">⬆</span>
                    <span><strong>Admin Dashboard (90%):</strong> Full management (quiz builder & intervention editor missing)</span>
                  </li>
                </ul>
              </GlassCard>

              {/* Partial Implementation */}
              <GlassCard className="border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">
                  ⚠️ 40% Complete (Infrastructure Only)
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">⚠</span>
                    <span><strong>Payment System:</strong></span>
                  </li>
                  <li className="ml-6 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Database schema complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Simulation mode working</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>UI complete (checkout, billing)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>New pricing tiers (RM29/6mo, RM45/year)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">✗</span>
                      <span className="font-semibold">Stripe integration missing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">✗</span>
                      <span className="font-semibold">Billplz not implemented</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">✗</span>
                      <span className="font-semibold">Webhook handlers missing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">✗</span>
                      <span className="font-semibold">2nd screening payment gate TODO</span>
                    </div>
                  </li>
                </ul>
              </GlassCard>

              {/* Missing Features */}
              <GlassCard className="border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">
                  ❌ Not Implemented (From Plan)
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Real payment processing (Stripe/Billplz APIs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Payment gateway router</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Subscription upgrade/downgrade flows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Admin quiz builder interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Intervention editor (create/edit modules)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Payment confirmation emails</span>
                  </li>
                </ul>
              </GlassCard>
            </div>

            {/* Overall Status Bar */}
            <GlassCard>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                Overall Platform Completion
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Core Assessment System', value: 100, color: 'bg-green-500' },
                  { name: 'Referral System', value: 100, color: 'bg-green-500' },
                  { name: 'Intervention System', value: 95, color: 'bg-blue-500' },
                  { name: 'Email System', value: 90, color: 'bg-blue-500' },
                  { name: 'Admin Dashboard', value: 90, color: 'bg-blue-500' },
                  { name: 'Payment System', value: 40, color: 'bg-orange-500' },
                  { name: 'Dark Mode & UI', value: 100, color: 'bg-green-500' },
                  { name: 'Database & Security', value: 100, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg border border-sage-200 dark:border-sage-800">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  <strong className="text-sage-700 dark:text-sage-400">Production Ready:</strong> Assessment system, Referrals, Interventions (user-facing), Email delivery
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
                  <strong className="text-orange-700 dark:text-orange-400">Requires Work:</strong> Real payment processing integration, Admin content creation tools
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              ⭐ Core Features
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Mental Health Assessments */}
              <GlassCard>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  📋 Mental Health Assessments
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  9 Malaysian-validated screening instruments including:
                </p>
                <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-2">
                  <li><strong>PHQ-9</strong> - Depression (0-27)</li>
                  <li><strong>AST</strong> - Anxiety (0-76)</li>
                  <li><strong>SEGIST</strong> - Insomnia (0-44)</li>
                  <li><strong>PTSD Checklist</strong> (0-80)</li>
                  <li><strong>YSAS</strong> - Suicidal Ideation (0-40)</li>
                  <li><strong>OCD Screening</strong> (0-80)</li>
                  <li><strong>Psychosis Screening</strong> (0-24)</li>
                  <li><strong>Sexual Addiction</strong> (0-20)</li>
                  <li><strong>Marital Distress</strong> (0-50)</li>
                </ul>
              </GlassCard>

              {/* Real-Time Triage */}
              <GlassCard>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  🚨 Real-Time Triage System
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Imminent Risk</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Emergency modal with crisis resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">High Risk</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Warning and professional help recommendation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Moderate Risk</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Resource provision</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Low Risk</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Normal flow</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* AI Features */}
              <GlassCard>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  🤖 AI-Powered Features
                </h3>
                <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-2">
                  <li><strong>Chat Support:</strong> Claude-powered conversational AI</li>
                  <li><strong>RAG Integration:</strong> Knowledge base retrieval</li>
                  <li><strong>Insights:</strong> Personalized analysis based on scores</li>
                  <li><strong>Safety Guardrails:</strong> Crisis situation detection</li>
                  <li><strong>Bilingual:</strong> EN/MS output</li>
                </ul>
              </GlassCard>

              {/* Interventions */}
              <GlassCard>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  🎯 Self-Help Interventions
                </h3>
                <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-2">
                  <li>Structured self-help programs with chapters</li>
                  <li>Video introductions and exercises</li>
                  <li>Progress tracking per user</li>
                  <li>Premium/free content tiers</li>
                </ul>
              </GlassCard>

              {/* Subscription */}
              <GlassCard>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  💳 Subscription & Billing
                </h3>
                <div className="space-y-3">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3">
                    <p className="font-semibold text-neutral-900 dark:text-white">Free Tier</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Basic assessments</p>
                  </div>
                  <div className="bg-sage-100 dark:bg-sage-900/30 rounded-lg p-3">
                    <p className="font-semibold text-neutral-900 dark:text-white">Premium - 6 Months</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">RM29 (6 months access)</p>
                  </div>
                  <div className="bg-sage-100 dark:bg-sage-900/30 rounded-lg p-3">
                    <p className="font-semibold text-neutral-900 dark:text-white">Premium - Yearly</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">RM45/year</p>
                  </div>
                </div>
              </GlassCard>

              {/* Database */}
              <GlassCard>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  🗄️ Database Schema
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  6 Migrations with comprehensive schema:
                </p>
                <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                  <li>• Core tables (users, assessments, screenings)</li>
                  <li>• Knowledge base with pgvector for RAG</li>
                  <li>• Payments & subscriptions</li>
                  <li>• Intervention modules & progress</li>
                  <li>• Admin system & audit logs</li>
                  <li>• System settings & configuration</li>
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Application Routes */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              🗺️ Application Routes
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Public Pages */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Public Pages
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-sage-600 dark:text-sage-400">/</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/about</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/pricing</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/resources</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/emergency</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/login</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/register</div>
                </div>
              </GlassCard>

              {/* Assessment Flow */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Assessment Flow
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-sage-600 dark:text-sage-400">/start</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/screening</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/social</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/results/preliminary</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/test/[type]</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/test/[type]/results</div>
                </div>
              </GlassCard>

              {/* User Dashboard */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  User Dashboard
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-sage-600 dark:text-sage-400">/my-assessments</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/chat</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/interventions</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/account</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/billing</div>
                  <div className="font-mono text-sage-600 dark:text-sage-400">/checkout</div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* QA Testing Section Header */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                🧪 QA Testing Progress
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Track testing progress across all platform features and functionality
              </p>
            </div>
          </div>
        </section>

        {/* Critical Priority */}
        <section className="py-12 bg-red-50 dark:bg-red-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                🔴 Critical Priority - Requires Professional Testing
              </h2>
            </div>
            <div className="space-y-4">
              {criticalSections.map((section) => (
                <TestSection
                  key={section.id}
                  section={section}
                  checkedItems={checkedItems}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        </section>

        {/* High Priority */}
        <section className="py-12 bg-orange-50 dark:bg-orange-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                🟡 High Priority - User Acceptance Testing
              </h2>
            </div>
            <div className="space-y-4">
              {highSections.map((section) => (
                <TestSection
                  key={section.id}
                  section={section}
                  checkedItems={checkedItems}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Standard Priority */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                🟢 Standard Testing
              </h2>
            </div>
            <div className="space-y-4">
              {standardSections.map((section) => (
                <TestSection
                  key={section.id}
                  section={section}
                  checkedItems={checkedItems}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        </section>

        {/* User Type Testing */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              📋 Testing Checklist by User Type
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Anonymous Users */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Anonymous Users
                </h3>
                <div className="space-y-2">
                  <TestItemComponent
                    item={{ id: 'anon-1', title: 'Can complete initial screening' }}
                    checked={checkedItems.has('anon-1')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'anon-2', title: 'Can view preliminary results' }}
                    checked={checkedItems.has('anon-2')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'anon-3', title: 'Cannot access chat or interventions' }}
                    checked={checkedItems.has('anon-3')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'anon-4', title: 'Prompted to register for full features' }}
                    checked={checkedItems.has('anon-4')}
                    onToggle={handleToggle}
                  />
                </div>
              </GlassCard>

              {/* Registered Users (Free) */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Registered Users (Free)
                </h3>
                <div className="space-y-2">
                  <TestItemComponent
                    item={{ id: 'reg-1', title: 'Can complete full assessments' }}
                    checked={checkedItems.has('reg-1')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'reg-2', title: 'Can access free interventions' }}
                    checked={checkedItems.has('reg-2')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'reg-3', title: 'Can use basic chat (with rate limits)' }}
                    checked={checkedItems.has('reg-3')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'reg-4', title: 'Prompted to upgrade for premium features' }}
                    checked={checkedItems.has('reg-4')}
                    onToggle={handleToggle}
                  />
                </div>
              </GlassCard>

              {/* Premium Users */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Premium Users
                </h3>
                <div className="space-y-2">
                  <TestItemComponent
                    item={{ id: 'prem-1', title: 'Can access all assessments' }}
                    checked={checkedItems.has('prem-1')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'prem-2', title: 'Can access all interventions' }}
                    checked={checkedItems.has('prem-2')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'prem-3', title: 'Unlimited chat access' }}
                    checked={checkedItems.has('prem-3')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'prem-4', title: 'Can view detailed insights' }}
                    checked={checkedItems.has('prem-4')}
                    onToggle={handleToggle}
                  />
                </div>
              </GlassCard>

              {/* Admin Users */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Admin Users
                </h3>
                <div className="space-y-2">
                  <TestItemComponent
                    item={{ id: 'admin-user-1', title: 'Can access admin dashboard' }}
                    checked={checkedItems.has('admin-user-1')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'admin-user-2', title: 'Can manage users and content' }}
                    checked={checkedItems.has('admin-user-2')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'admin-user-3', title: 'Can view alerts and logs' }}
                    checked={checkedItems.has('admin-user-3')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'admin-user-4', title: 'Can export data' }}
                    checked={checkedItems.has('admin-user-4')}
                    onToggle={handleToggle}
                  />
                </div>
              </GlassCard>

              {/* Super Admin Users */}
              <GlassCard>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Super Admin Users
                </h3>
                <div className="space-y-2">
                  <TestItemComponent
                    item={{ id: 'super-1', title: 'All admin permissions' }}
                    checked={checkedItems.has('super-1')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'super-2', title: 'Can manage other admins' }}
                    checked={checkedItems.has('super-2')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'super-3', title: 'Can modify system settings' }}
                    checked={checkedItems.has('super-3')}
                    onToggle={handleToggle}
                  />
                  <TestItemComponent
                    item={{ id: 'super-4', title: 'Can access audit logs' }}
                    checked={checkedItems.has('super-4')}
                    onToggle={handleToggle}
                  />
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
