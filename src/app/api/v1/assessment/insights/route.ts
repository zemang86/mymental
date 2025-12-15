/**
 * Assessment Insights API
 * Generates AI-powered personalized insights based on assessment results
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentResults } from '@/lib/ai/rag';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentType, score, severity, riskLevel, detectedConditions } = body;

    if (!assessmentType || score === undefined || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields: assessmentType, score, severity' },
        { status: 400 }
      );
    }

    // Generate RAG-enhanced insights
    const { results, sources } = await generateAssessmentResults(
      assessmentType,
      score,
      severity,
      riskLevel || 'low',
      detectedConditions || [assessmentType]
    );

    return NextResponse.json({
      success: true,
      insights: results,
      sources: sources.map((s) => ({
        title: s.title,
        category: s.category,
        similarity: s.similarity,
      })),
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
