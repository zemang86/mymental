/**
 * Structured AI Insights Types
 * Used for storing and displaying assessment insights
 */

export interface AssessmentInsights {
  // Brief summary (1-2 sentences)
  summary: string;
  summaryMs: string;

  // Key findings from the assessment (3-4 points)
  keyFindings: {
    text: string;
    textMs: string;
    type: 'positive' | 'concern' | 'neutral';
  }[];

  // Actionable recommendations (3-4 items)
  recommendations: {
    text: string;
    textMs: string;
    priority: 'high' | 'medium' | 'low';
  }[];

  // Suggested coping strategies (2-3 tips)
  copingStrategies: {
    title: string;
    titleMs: string;
    description: string;
    descriptionMs: string;
  }[];

  // Risk factors identified (if any)
  riskFactors: {
    text: string;
    textMs: string;
    level: 'low' | 'moderate' | 'high';
  }[];

  // Next steps to take
  nextSteps: {
    action: string;
    actionMs: string;
    urgency: 'immediate' | 'soon' | 'when_ready';
  }[];

  // Metadata
  generatedAt: string;
  assessmentType: string;
  severity: string;
  score: number;
}

export interface InsightsStats {
  overallRisk: 'low' | 'moderate' | 'high';
  areasOfConcern: number;
  positiveFactors: number;
  recommendedActions: number;
}
