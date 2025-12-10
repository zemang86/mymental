import { z } from 'zod';

// ============================================
// Enums
// ============================================

export const RiskLevel = z.enum(['low', 'moderate', 'high', 'imminent']);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const AssessmentType = z.enum([
  'depression',
  'anxiety',
  'ocd',
  'ptsd',
  'insomnia',
  'suicidal',
  'psychosis',
  'sexual_addiction',
  'marital_distress',
]);
export type AssessmentType = z.infer<typeof AssessmentType>;

export const AssessmentStatus = z.enum(['in_progress', 'completed', 'abandoned']);
export type AssessmentStatus = z.infer<typeof AssessmentStatus>;

// ============================================
// Question Types
// ============================================

export interface QuestionOption {
  label: string;
  labelMs?: string; // Malay translation
  score: number;
  triggersTriageCheck?: boolean;
  triageRiskLevel?: RiskLevel;
}

export interface AssessmentQuestion {
  id: string;
  questionId: string;
  text: string;
  textMs?: string; // Malay translation
  type: 'yes_no' | 'likert' | 'multiple_choice' | 'scale';
  options: QuestionOption[];
  category?: string;
  triageRule?: TriageRule;
}

export interface TriageRule {
  condition: 'equals' | 'greater_than' | 'contains';
  value: unknown;
  riskLevel: RiskLevel;
  reason: string;
}

// ============================================
// Assessment Data
// ============================================

export interface Assessment {
  id: string;
  userId?: string;
  sessionId?: string;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  isPremium: boolean;
  rawAnswers: Record<string, unknown>;
  totalScore?: number;
  scoreBreakdown?: Record<string, number>;
  riskLevel?: RiskLevel;
  resultText?: string;
  resultHtml?: string;
  recommendations?: Recommendation[];
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  titleMs?: string;
  description: string;
  descriptionMs?: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'read_article' | 'take_test' | 'seek_help' | 'try_exercise';
  actionUrl?: string;
}

// ============================================
// Initial Screening
// ============================================

export interface InitialScreening {
  id: string;
  sessionId?: string;
  userId?: string;
  rawAnswers: Record<string, unknown>;
  detectedConditions: AssessmentType[];
  hasSuicidalIdeation: boolean;
  hasPsychosisIndicators: boolean;
  overallRiskLevel: RiskLevel;
  createdAt: string;
}

export interface SocialFunctionScreening {
  id: string;
  sessionId?: string;
  userId?: string;
  initialScreeningId?: string;
  rawAnswers: Record<string, number>;
  totalScore: number;
  functionalLevel: 'high' | 'moderate' | 'low' | 'severe';
  createdAt: string;
}

// ============================================
// Demographics
// ============================================

export const GenderType = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);
export type GenderType = z.infer<typeof GenderType>;

export const MaritalStatus = z.enum(['single', 'married', 'divorced', 'widowed', 'separated']);
export type MaritalStatus = z.infer<typeof MaritalStatus>;

export interface Demographics {
  age?: number;
  gender?: GenderType;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  religion?: string;
  language?: 'en' | 'ms';
  education?: string;
  occupation?: string;
  hasMentalIllnessDiagnosis?: boolean;
  mentalIllnessDetails?: string;
}

export const DemographicsSchema = z.object({
  age: z.number().min(13).max(120).optional(),
  gender: GenderType.optional(),
  maritalStatus: MaritalStatus.optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  language: z.enum(['en', 'ms']).optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  hasMentalIllnessDiagnosis: z.boolean().optional(),
  mentalIllnessDetails: z.string().optional(),
});

// ============================================
// Triage
// ============================================

export interface TriageEvent {
  id: string;
  assessmentId?: string;
  initialScreeningId?: string;
  userId?: string;
  sessionId?: string;
  riskLevel: RiskLevel;
  triggerReason: string;
  triggerQuestionId?: string;
  triggerAnswer?: unknown;
  chatBlocked: boolean;
  emergencyModalShown: boolean;
  notificationSent: boolean;
  createdAt: string;
}

export interface TriageResult {
  riskLevel: RiskLevel;
  triggeredRules: TriageRule[];
  actions: Set<TriageAction>;
  shouldBlockChat: boolean;
  shouldShowEmergency: boolean;
  shouldRedirectEmergency: boolean;
}

export type TriageAction =
  | 'show_emergency_modal'
  | 'block_chat'
  | 'log_event'
  | 'send_notification'
  | 'redirect_emergency';

// ============================================
// API Types
// ============================================

export interface StartAssessmentRequest {
  assessmentType: AssessmentType;
  sessionId?: string;
}

export interface StartAssessmentResponse {
  assessmentId: string;
  questions: AssessmentQuestion[];
}

export interface SubmitAnswerRequest {
  assessmentId: string;
  questionId: string;
  answer: unknown;
}

export interface SubmitAnswerResponse {
  saved: boolean;
  triageResult?: TriageResult;
  nextQuestion?: AssessmentQuestion;
  progress: number;
}

export interface CompleteAssessmentResponse {
  assessmentId: string;
  riskLevel: RiskLevel;
  totalScore: number;
  resultUrl: string;
}
