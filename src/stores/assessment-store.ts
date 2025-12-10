import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RiskLevel, AssessmentType, Demographics } from '@/types/assessment';

interface AssessmentState {
  // Session
  sessionId: string | null;

  // Demographics
  demographics: Demographics;
  hasAcceptedTerms: boolean;
  hasAcceptedPrivacy: boolean;

  // Initial Screening
  initialScreeningAnswers: Record<string, boolean>;
  detectedConditions: AssessmentType[];

  // Social Function
  socialFunctionAnswers: Record<string, number>;
  socialFunctionScore: number | null;

  // Risk Assessment
  riskLevel: RiskLevel | null;
  hasSuicidalIdeation: boolean;
  hasPsychosisIndicators: boolean;
  isEmergency: boolean;

  // Progress
  currentStep: 'demographics' | 'screening' | 'social' | 'registration' | 'results';
  screeningProgress: number;

  // User (after registration)
  userId: string | null;
  userEmail: string | null;

  // Actions
  setSessionId: (id: string) => void;
  setDemographics: (data: Partial<Demographics>) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setPrivacyAccepted: (accepted: boolean) => void;
  setInitialScreeningAnswer: (questionId: string, answer: boolean) => void;
  setDetectedConditions: (conditions: AssessmentType[]) => void;
  setSocialFunctionAnswer: (questionId: string, score: number) => void;
  calculateSocialFunctionScore: () => void;
  setRiskLevel: (level: RiskLevel) => void;
  setSuicidalIdeation: (value: boolean) => void;
  setPsychosisIndicators: (value: boolean) => void;
  triggerEmergency: () => void;
  setStep: (step: AssessmentState['currentStep']) => void;
  setScreeningProgress: (progress: number) => void;
  setUser: (userId: string, email: string) => void;
  reset: () => void;
  clearSession: () => void;
}

const initialState = {
  sessionId: null,
  demographics: {},
  hasAcceptedTerms: false,
  hasAcceptedPrivacy: false,
  initialScreeningAnswers: {},
  detectedConditions: [],
  socialFunctionAnswers: {},
  socialFunctionScore: null,
  riskLevel: null,
  hasSuicidalIdeation: false,
  hasPsychosisIndicators: false,
  isEmergency: false,
  currentStep: 'demographics' as const,
  screeningProgress: 0,
  userId: null,
  userEmail: null,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSessionId: (id) => set({ sessionId: id }),

      setDemographics: (data) =>
        set((state) => ({
          demographics: { ...state.demographics, ...data },
        })),

      setTermsAccepted: (accepted) => set({ hasAcceptedTerms: accepted }),

      setPrivacyAccepted: (accepted) => set({ hasAcceptedPrivacy: accepted }),

      setInitialScreeningAnswer: (questionId, answer) =>
        set((state) => ({
          initialScreeningAnswers: {
            ...state.initialScreeningAnswers,
            [questionId]: answer,
          },
        })),

      setDetectedConditions: (conditions) =>
        set({ detectedConditions: conditions }),

      setSocialFunctionAnswer: (questionId, score) =>
        set((state) => ({
          socialFunctionAnswers: {
            ...state.socialFunctionAnswers,
            [questionId]: score,
          },
        })),

      calculateSocialFunctionScore: () => {
        const answers = get().socialFunctionAnswers;
        const total = Object.values(answers).reduce((sum, score) => sum + score, 0);
        set({ socialFunctionScore: total });
      },

      setRiskLevel: (level) => set({ riskLevel: level }),

      setSuicidalIdeation: (value) => {
        set({ hasSuicidalIdeation: value });
        if (value) {
          set({ isEmergency: true, riskLevel: 'imminent' });
        }
      },

      setPsychosisIndicators: (value) => set({ hasPsychosisIndicators: value }),

      triggerEmergency: () =>
        set({ isEmergency: true, riskLevel: 'imminent' }),

      setStep: (step) => set({ currentStep: step }),

      setScreeningProgress: (progress) => set({ screeningProgress: progress }),

      setUser: (userId, email) => set({ userId, userEmail: email }),

      reset: () => set(initialState),

      clearSession: () => set(initialState),
    }),
    {
      name: 'mymental-assessment',
      partialize: (state) => ({
        sessionId: state.sessionId,
        demographics: state.demographics,
        hasAcceptedTerms: state.hasAcceptedTerms,
        hasAcceptedPrivacy: state.hasAcceptedPrivacy,
        initialScreeningAnswers: state.initialScreeningAnswers,
        detectedConditions: state.detectedConditions,
        socialFunctionAnswers: state.socialFunctionAnswers,
        socialFunctionScore: state.socialFunctionScore,
        currentStep: state.currentStep,
        screeningProgress: state.screeningProgress,
        riskLevel: state.riskLevel,
        hasSuicidalIdeation: state.hasSuicidalIdeation,
        isEmergency: state.isEmergency,
      }),
    }
  )
);
