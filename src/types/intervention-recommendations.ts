/**
 * Types for intervention recommendations system
 */

export interface RecommendedExercise {
  id: string;
  title: string;
  titleMs: string;
  description: string;
  descriptionMs: string;
  category: string;
  source: 'kb_article' | 'intervention';
  sourceId?: string;
  sourceName?: string;
  duration?: string;
  isPremium: boolean;
  steps?: string[];
  stepsMs?: string[];
}

export interface InterventionModule {
  id: string;
  name: string;
  nameMs: string;
  category: string;
  description: string;
  descriptionMs: string;
  exerciseCount: number;
  isPremium: boolean;
}

export interface InterventionRecommendations {
  exercises: RecommendedExercise[];
  modules: InterventionModule[];
  assessmentType: string;
  severity: string;
  generatedAt: string;
}

export interface RecommendationRequest {
  assessmentType: string;
  severity: string;
  score?: number;
  maxScore?: number;
}
