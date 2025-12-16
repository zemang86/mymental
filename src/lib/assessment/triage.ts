/**
 * TRIAGE SYSTEM - CRITICAL SAFETY COMPONENT
 *
 * This module handles real-time risk detection during assessments.
 * It runs on EVERY answer submission and cannot be bypassed.
 *
 * Risk Levels:
 * - imminent: Immediate danger - show emergency modal, block chat, redirect
 * - high: Urgent - show warning, recommend professional help
 * - moderate: Concerning - provide resources
 * - low: Normal flow
 */

import type { RiskLevel, AssessmentType } from '@/types/assessment';
import { INITIAL_SCREENING_QUESTIONS } from './questions';

export type TriageAction =
  | 'show_emergency_modal'
  | 'block_chat'
  | 'log_event'
  | 'redirect_emergency'
  | 'show_warning_banner';

export interface TriageRule {
  questionId: string;
  triggerValue: boolean;
  riskLevel: RiskLevel;
  reason: string;
  actions: TriageAction[];
}

// Define triage rules based on question responses
export const TRIAGE_RULES: TriageRule[] = [
  // IMMINENT RISK - Suicidal ideation (thoughts of ending life)
  {
    questionId: 'ending_life',
    triggerValue: true,
    riskLevel: 'imminent',
    reason: 'User indicated thoughts of ending their life',
    actions: ['show_emergency_modal', 'block_chat', 'log_event', 'redirect_emergency'],
  },
  // HIGH RISK - Thoughts of death/dying
  {
    questionId: 'thoughts_death_dying',
    triggerValue: true,
    riskLevel: 'high',
    reason: 'User indicated thoughts of death or dying',
    actions: ['show_warning_banner', 'log_event'],
  },
  // HIGH RISK - Hearing voices (psychosis)
  {
    questionId: 'hearing_voices',
    triggerValue: true,
    riskLevel: 'high',
    reason: 'User indicated hearing voices others cannot hear',
    actions: ['show_warning_banner', 'log_event'],
  },
  // HIGH RISK - Belief in extraordinary powers (psychosis/grandiosity)
  {
    questionId: 'extraordinary_powers',
    triggerValue: true,
    riskLevel: 'high',
    reason: 'User indicated belief in extraordinary powers',
    actions: ['show_warning_banner', 'log_event'],
  },
];

export interface TriageResult {
  riskLevel: RiskLevel;
  triggeredRules: TriageRule[];
  actions: TriageAction[];
  shouldBlockChat: boolean;
  shouldShowEmergency: boolean;
  shouldRedirectEmergency: boolean;
  highestRiskReason: string | null;
  hasSuicidalIdeation: boolean;
  hasPsychosisIndicators: boolean;
  triggerQuestions: string[];
}

const RISK_PRIORITY: Record<RiskLevel, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  imminent: 3,
};

/**
 * Evaluate triage rules against current answers
 * This runs on EVERY answer submission
 */
export function evaluateTriage(
  answers: Record<string, boolean>
): TriageResult {
  const triggeredRules: TriageRule[] = [];
  const allActions = new Set<TriageAction>();
  let highestRiskLevel: RiskLevel = 'low';
  let highestRiskReason: string | null = null;

  // Check each triage rule
  for (const rule of TRIAGE_RULES) {
    const answer = answers[rule.questionId];

    if (answer === rule.triggerValue) {
      triggeredRules.push(rule);
      rule.actions.forEach((action) => allActions.add(action));

      // Track highest risk level
      if (RISK_PRIORITY[rule.riskLevel] > RISK_PRIORITY[highestRiskLevel]) {
        highestRiskLevel = rule.riskLevel;
        highestRiskReason = rule.reason;
      }
    }
  }

  // Also check questions with inline triage from question definitions
  for (const question of INITIAL_SCREENING_QUESTIONS) {
    if (question.triageRisk && answers[question.id] === true) {
      const existingRule = triggeredRules.find(r => r.questionId === question.id);
      if (!existingRule) {
        // Create implicit rule from question definition
        const implicitRule: TriageRule = {
          questionId: question.id,
          triggerValue: true,
          riskLevel: question.triageRisk,
          reason: question.triageReason || `Triggered by ${question.id}`,
          actions: question.triageRisk === 'imminent'
            ? ['show_emergency_modal', 'block_chat', 'log_event', 'redirect_emergency']
            : ['show_warning_banner', 'log_event'],
        };
        triggeredRules.push(implicitRule);
        implicitRule.actions.forEach((action) => allActions.add(action));

        if (RISK_PRIORITY[question.triageRisk] > RISK_PRIORITY[highestRiskLevel]) {
          highestRiskLevel = question.triageRisk;
          highestRiskReason = question.triageReason || null;
        }
      }
    }
  }

  // Check for specific indicators
  const hasSuicidalIdeation = triggeredRules.some(
    (r) => r.questionId === 'ending_life' || r.questionId === 'thoughts_death_dying'
  );
  const hasPsychosisIndicators = triggeredRules.some(
    (r) => r.questionId === 'hearing_voices' || r.questionId === 'extraordinary_powers'
  );
  const triggerQuestions = triggeredRules.map((r) => r.questionId);

  return {
    riskLevel: highestRiskLevel,
    triggeredRules,
    actions: Array.from(allActions),
    shouldBlockChat: allActions.has('block_chat'),
    shouldShowEmergency: allActions.has('show_emergency_modal'),
    shouldRedirectEmergency: allActions.has('redirect_emergency'),
    highestRiskReason,
    hasSuicidalIdeation,
    hasPsychosisIndicators,
    triggerQuestions,
  };
}

/**
 * Evaluate a single answer for immediate triage check
 * Used for real-time checking as user answers
 */
export function evaluateSingleAnswer(
  questionId: string,
  answer: boolean
): TriageResult | null {
  // Find matching rule
  const rule = TRIAGE_RULES.find(
    (r) => r.questionId === questionId && r.triggerValue === answer
  );

  // Also check question definition
  const question = INITIAL_SCREENING_QUESTIONS.find((q) => q.id === questionId);

  if (!rule && (!question?.triageRisk || answer !== true)) {
    return null;
  }

  const triggeredRule = rule || {
    questionId,
    triggerValue: true,
    riskLevel: question!.triageRisk!,
    reason: question!.triageReason || `Triggered by ${questionId}`,
    actions: question!.triageRisk === 'imminent'
      ? ['show_emergency_modal', 'block_chat', 'log_event', 'redirect_emergency'] as TriageAction[]
      : ['show_warning_banner', 'log_event'] as TriageAction[],
  };

  const hasSuicidalIdeation = triggeredRule.questionId === 'ending_life' || triggeredRule.questionId === 'thoughts_death_dying';
  const hasPsychosisIndicators = triggeredRule.questionId === 'hearing_voices' || triggeredRule.questionId === 'extraordinary_powers';

  return {
    riskLevel: triggeredRule.riskLevel,
    triggeredRules: [triggeredRule],
    actions: triggeredRule.actions,
    shouldBlockChat: triggeredRule.actions.includes('block_chat'),
    shouldShowEmergency: triggeredRule.actions.includes('show_emergency_modal'),
    shouldRedirectEmergency: triggeredRule.actions.includes('redirect_emergency'),
    highestRiskReason: triggeredRule.reason,
    hasSuicidalIdeation,
    hasPsychosisIndicators,
    triggerQuestions: [triggeredRule.questionId],
  };
}

/**
 * Determine detected conditions from initial screening answers
 */
export function detectConditions(
  answers: Record<string, boolean>
): AssessmentType[] {
  const conditions = new Set<AssessmentType>();

  for (const question of INITIAL_SCREENING_QUESTIONS) {
    if (answers[question.id] === true && question.triggerCondition) {
      conditions.add(question.triggerCondition);
    }
  }

  return Array.from(conditions);
}

/**
 * Create referral for high-risk users
 * This function creates a referral record and sends alerts to admin
 */
export async function createReferralForHighRiskUser(
  userId: string,
  triageResult: TriageResult,
  detectedConditions: AssessmentType[]
): Promise<{ referralId: string | null; alertId: string | null }> {
  // Only create referrals for high or imminent risk
  if (triageResult.riskLevel !== 'high' && triageResult.riskLevel !== 'imminent') {
    return { referralId: null, alertId: null };
  }

  try {
    // Create referral via API
    const referralResponse = await fetch('/api/v1/referral/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        riskLevel: triageResult.riskLevel,
        detectedConditions,
        referralReason: triageResult.highestRiskReason,
        contactPreference: ['phone', 'in_person'],
      }),
    });

    if (!referralResponse.ok) {
      console.error('Failed to create referral');
      return { referralId: null, alertId: null };
    }

    const referralData = await referralResponse.json();
    return {
      referralId: referralData.referralId,
      alertId: referralData.alertId,
    };
  } catch (error) {
    console.error('Error creating referral:', error);
    return { referralId: null, alertId: null };
  }
}

/**
 * Calculate functional level from social function score
 * Score range: 0-32 (8 questions x 0-4)
 */
export function calculateFunctionalLevel(
  score: number
): 'high' | 'moderate' | 'low' | 'severe' {
  if (score >= 26) return 'high';      // 81-100%
  if (score >= 18) return 'moderate';  // 56-80%
  if (score >= 10) return 'low';       // 31-55%
  return 'severe';                      // 0-30%
}

/**
 * Get overall risk level considering both triage and functional level
 */
export function getOverallRiskLevel(
  triageRiskLevel: RiskLevel,
  functionalLevel: 'high' | 'moderate' | 'low' | 'severe'
): RiskLevel {
  // Triage always takes priority for imminent/high
  if (triageRiskLevel === 'imminent' || triageRiskLevel === 'high') {
    return triageRiskLevel;
  }

  // Factor in functional level
  if (functionalLevel === 'severe') {
    return triageRiskLevel === 'moderate' ? 'high' : 'moderate';
  }

  if (functionalLevel === 'low') {
    return triageRiskLevel === 'low' ? 'moderate' : triageRiskLevel;
  }

  return triageRiskLevel;
}
