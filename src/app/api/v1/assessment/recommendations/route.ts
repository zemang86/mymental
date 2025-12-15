/**
 * Assessment Recommendations API
 * Returns intervention recommendations based on assessment results
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInterventionRecommendations } from '@/lib/interventions/recommendations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentType = searchParams.get('type');
    const severity = searchParams.get('severity');

    // Validate required parameters
    if (!assessmentType) {
      return NextResponse.json(
        { error: 'Assessment type is required' },
        { status: 400 }
      );
    }

    if (!severity) {
      return NextResponse.json(
        { error: 'Severity level is required' },
        { status: 400 }
      );
    }

    // Valid assessment types
    const validTypes = [
      'depression',
      'anxiety',
      'ocd',
      'ptsd',
      'insomnia',
      'suicidal',
      'psychosis',
      'sexual_addiction',
      'marital_distress',
    ];

    if (!validTypes.includes(assessmentType)) {
      return NextResponse.json(
        { error: 'Invalid assessment type' },
        { status: 400 }
      );
    }

    // Get recommendations
    const recommendations = await getInterventionRecommendations(
      assessmentType,
      severity
    );

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
