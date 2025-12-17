import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdminAccess } from '@/lib/admin/auth';

// GET - Get single intervention with chapters
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('interventions')
    .select(`
      *,
      intervention_chapters (
        id,
        chapter_order,
        title,
        title_ms,
        description,
        description_ms,
        is_free_preview,
        kb_article_id,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Sort chapters by order
  if (data.intervention_chapters) {
    data.intervention_chapters.sort((a: { chapter_order: number }, b: { chapter_order: number }) =>
      a.chapter_order - b.chapter_order
    );
  }

  return NextResponse.json({ intervention: data });
}

// PUT - Update intervention
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
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
    } = body;

    const adminClient = createAdminClient();

    // Check if slug is taken by another intervention
    if (slug) {
      const { data: existing } = await adminClient
        .from('interventions')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'An intervention with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (name_ms !== undefined) updateData.name_ms = name_ms;
    if (description !== undefined) updateData.description = description;
    if (description_ms !== undefined) updateData.description_ms = description_ms;
    if (category !== undefined) updateData.category = category;
    if (slug !== undefined) updateData.slug = slug;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (is_published !== undefined) updateData.is_published = is_published;
    if (estimated_duration_minutes !== undefined) updateData.estimated_duration_minutes = estimated_duration_minutes;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (video_intro_url !== undefined) updateData.video_intro_url = video_intro_url;

    const { data, error } = await adminClient
      .from('interventions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log audit
    await adminClient.from('audit_logs').insert({
      admin_id: admin.id,
      action: 'update_intervention',
      resource_type: 'intervention',
      resource_id: id,
      details: updateData,
    });

    return NextResponse.json({ intervention: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE - Delete intervention
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const adminClient = createAdminClient();

  // Get intervention details before deletion for audit
  const { data: intervention } = await adminClient
    .from('interventions')
    .select('name, slug')
    .eq('id', id)
    .single();

  const { error } = await adminClient
    .from('interventions')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log audit
  await adminClient.from('audit_logs').insert({
    admin_id: admin.id,
    action: 'delete_intervention',
    resource_type: 'intervention',
    resource_id: id,
    details: intervention,
  });

  return NextResponse.json({ success: true });
}
