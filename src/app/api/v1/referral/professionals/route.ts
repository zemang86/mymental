/**
 * Professional Directory API
 * Get list of verified mental health professionals
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const specialization = searchParams.get('specialization');
    const language = searchParams.get('language');
    const acceptingPatients = searchParams.get('acceptingPatients');

    const admin = getSupabaseAdmin();
    let query = admin
      .from('mental_health_professionals')
      .select('*')
      .eq('is_verified', true);

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (specialization) {
      query = query.contains('specializations', [specialization]);
    }

    if (language) {
      query = query.contains('languages', [language]);
    }

    if (acceptingPatients === 'true') {
      query = query.eq('accepting_patients', true);
    }

    query = query.order('name');

    const { data: professionals, error } = await query;

    if (error) {
      console.error('Error fetching professionals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch professionals' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      professionals: professionals || [],
      count: professionals?.length || 0,
    });
  } catch (error) {
    console.error('Error in professionals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
