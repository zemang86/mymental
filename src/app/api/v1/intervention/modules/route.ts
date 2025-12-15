/**
 * Intervention Modules API
 * Handles fetching intervention modules from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInterventionModules, getInterventionsByCategory, getInterventionBySlug } from '@/lib/interventions/modules';

// GET: Retrieve intervention modules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');
    const grouped = searchParams.get('grouped') === 'true';

    // If slug provided, get single intervention with chapters
    if (slug) {
      const intervention = await getInterventionBySlug(slug, userId || undefined);

      if (!intervention) {
        return NextResponse.json(
          { error: 'Intervention not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        intervention,
      });
    }

    // If grouped requested, return by category
    if (grouped) {
      const byCategory = await getInterventionsByCategory();
      return NextResponse.json({
        modules: byCategory,
      });
    }

    // Get all modules, optionally filtered by category
    const modules = await getInterventionModules(category || undefined);

    return NextResponse.json({
      modules,
      total: modules.length,
    });
  } catch (error) {
    console.error('Error fetching intervention modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intervention modules' },
      { status: 500 }
    );
  }
}
