/**
 * Premium Access Rules
 * Defines what features are available at each subscription tier
 */

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export type FeatureKey =
  | 'AI_INSIGHTS'
  | 'DETAILED_RESULTS'
  | 'FULL_INTERVENTIONS'
  | 'PREMIUM_ASSESSMENTS'
  | 'UNLIMITED_CHAT'
  | 'PDF_REPORTS'
  | 'PROGRESS_TRACKING';

/**
 * Feature definitions with tier requirements
 */
export const PREMIUM_FEATURES: Record<FeatureKey, {
  name: string;
  nameMs: string;
  description: string;
  descriptionMs: string;
  requireTier: 'basic' | 'premium';
}> = {
  AI_INSIGHTS: {
    name: 'AI-Powered Insights',
    nameMs: 'Cerapan Berkuasa AI',
    description: 'Personalized recommendations based on your assessment results',
    descriptionMs: 'Cadangan peribadi berdasarkan keputusan penilaian anda',
    requireTier: 'basic',
  },
  DETAILED_RESULTS: {
    name: 'Detailed Results Analysis',
    nameMs: 'Analisis Keputusan Terperinci',
    description: 'In-depth breakdown of your assessment scores',
    descriptionMs: 'Pecahan mendalam skor penilaian anda',
    requireTier: 'basic',
  },
  FULL_INTERVENTIONS: {
    name: 'Full Intervention Modules',
    nameMs: 'Modul Intervensi Penuh',
    description: 'Access all exercises, worksheets, and guided modules',
    descriptionMs: 'Akses semua latihan, lembaran kerja, dan modul berpandu',
    requireTier: 'premium',
  },
  PREMIUM_ASSESSMENTS: {
    name: 'Premium Assessments',
    nameMs: 'Penilaian Premium',
    description: 'Access to OCD, PTSD, Insomnia, and other specialized assessments',
    descriptionMs: 'Akses kepada penilaian OCD, PTSD, Insomnia, dan penilaian khusus lain',
    requireTier: 'basic',
  },
  UNLIMITED_CHAT: {
    name: 'Unlimited AI Chat',
    nameMs: 'Chat AI Tanpa Had',
    description: 'Unlimited conversations with our AI support assistant',
    descriptionMs: 'Perbualan tanpa had dengan pembantu sokongan AI kami',
    requireTier: 'basic',
  },
  PDF_REPORTS: {
    name: 'PDF Reports',
    nameMs: 'Laporan PDF',
    description: 'Download and share your assessment results',
    descriptionMs: 'Muat turun dan kongsi keputusan penilaian anda',
    requireTier: 'premium',
  },
  PROGRESS_TRACKING: {
    name: 'Progress Tracking',
    nameMs: 'Penjejakan Kemajuan',
    description: 'Track your mental health journey over time',
    descriptionMs: 'Jejaki perjalanan kesihatan mental anda dari masa ke masa',
    requireTier: 'basic',
  },
};

/**
 * Tier-based access configuration
 */
export const TIER_ACCESS = {
  free: {
    // Assessments
    freeAssessments: ['depression', 'anxiety', 'suicidal'] as string[],
    assessmentsPerMonth: 3,

    // Results
    basicResults: true,
    aiInsights: false,
    detailedResults: false,

    // Chat
    chatMessagesPerDay: 5,

    // Interventions
    interventionAccess: 'preview' as const, // Only see previews
    freeChaptersPerModule: 1,

    // Other
    pdfReports: false,
    progressTracking: false,
  },

  basic: {
    // Assessments
    freeAssessments: ['depression', 'anxiety', 'suicidal', 'ocd', 'ptsd', 'insomnia'] as string[],
    assessmentsPerMonth: 10,

    // Results
    basicResults: true,
    aiInsights: true,
    detailedResults: true,

    // Chat
    chatMessagesPerDay: 50,

    // Interventions
    interventionAccess: 'limited' as const, // First 2 chapters free
    freeChaptersPerModule: 2,

    // Other
    pdfReports: false,
    progressTracking: true,
  },

  premium: {
    // Assessments
    freeAssessments: 'all' as const,
    assessmentsPerMonth: Infinity,

    // Results
    basicResults: true,
    aiInsights: true,
    detailedResults: true,

    // Chat
    chatMessagesPerDay: Infinity,

    // Interventions
    interventionAccess: 'full' as const,
    freeChaptersPerModule: Infinity,

    // Other
    pdfReports: true,
    progressTracking: true,
  },
};

/**
 * Check if a feature is available for a given tier
 */
export function hasFeatureAccess(
  feature: FeatureKey,
  userTier: SubscriptionTier
): boolean {
  const featureConfig = PREMIUM_FEATURES[feature];
  if (!featureConfig) return false;

  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    premium: 2,
  };

  const requiredLevel = tierHierarchy[featureConfig.requireTier];
  const userLevel = tierHierarchy[userTier];

  return userLevel >= requiredLevel;
}

/**
 * Check if an assessment is available for a given tier
 */
export function canAccessAssessment(
  assessmentType: string,
  userTier: SubscriptionTier
): boolean {
  const access = TIER_ACCESS[userTier];

  if (access.freeAssessments === 'all') {
    return true;
  }

  return access.freeAssessments.includes(assessmentType);
}

/**
 * Check if a specific intervention chapter is accessible
 */
export function canAccessInterventionChapter(
  chapterIndex: number,
  userTier: SubscriptionTier
): boolean {
  const access = TIER_ACCESS[userTier];

  if (access.interventionAccess === 'full') {
    return true;
  }

  return chapterIndex < access.freeChaptersPerModule;
}

/**
 * Get feature metadata for UI display
 */
export function getFeatureInfo(feature: FeatureKey) {
  return PREMIUM_FEATURES[feature];
}

/**
 * Get list of features available at a tier
 */
export function getFeaturesForTier(tier: SubscriptionTier): FeatureKey[] {
  return (Object.keys(PREMIUM_FEATURES) as FeatureKey[]).filter(
    (feature) => hasFeatureAccess(feature, tier)
  );
}

/**
 * Get features that require upgrade from current tier
 */
export function getLockedFeatures(currentTier: SubscriptionTier): FeatureKey[] {
  return (Object.keys(PREMIUM_FEATURES) as FeatureKey[]).filter(
    (feature) => !hasFeatureAccess(feature, currentTier)
  );
}
