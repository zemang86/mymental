import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdminAccess } from '@/lib/admin/auth';

// GET - List all interventions (with chapters count)
export async function GET(request: NextRequest) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const { data, count, error } = await adminClient
    .from('interventions')
    .select('*, intervention_chapters(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ interventions: data, total: count });
}

// POST - Create new intervention
export async function POST(request: NextRequest) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      name_ms,
      description,
      description_ms,
      category,
      slug,
      is_premium = true,
      is_published = false,
      estimated_duration_minutes,
      thumbnail_url,
      video_intro_url,
    } = body;

    if (!name || !category || !slug) {
      return NextResponse.json(
        { error: 'Name, category, and slug are required' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Check if slug already exists
    const { data: existing } = await adminClient
      .from('interventions')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An intervention with this slug already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await adminClient
      .from('interventions')
      .insert({
        name,
        name_ms,
        description,
        description_ms,
        category,
        slug,
        is_premium,
        is_published,
        estimated_duration_minutes,
        thumbnail_url,
        video_intro_url,
        total_chapters: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log audit
    await adminClient.from('audit_logs').insert({
      admin_id: admin.id,
      action: 'create_intervention',
      resource_type: 'intervention',
      resource_id: data.id,
      details: { name, category, slug },
    });

    return NextResponse.json({ intervention: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
