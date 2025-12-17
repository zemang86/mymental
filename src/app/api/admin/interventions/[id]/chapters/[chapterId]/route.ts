import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdminAccess } from '@/lib/admin/auth';

// PUT - Update chapter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: interventionId, chapterId } = await params;

  try {
    const body = await request.json();
    const {
      title,
      title_ms,
      description,
      description_ms,
      is_free_preview,
      kb_article_id,
    } = body;

    const adminClient = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (title_ms !== undefined) updateData.title_ms = title_ms;
    if (description !== undefined) updateData.description = description;
    if (description_ms !== undefined) updateData.description_ms = description_ms;
    if (is_free_preview !== undefined) updateData.is_free_preview = is_free_preview;
    if (kb_article_id !== undefined) updateData.kb_article_id = kb_article_id;

    const { data, error } = await adminClient
      .from('intervention_chapters')
      .update(updateData)
      .eq('id', chapterId)
      .eq('intervention_id', interventionId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log audit
    await adminClient.from('audit_logs').insert({
      admin_id: admin.id,
      action: 'update_chapter',
      resource_type: 'intervention_chapter',
      resource_id: chapterId,
      details: { intervention_id: interventionId, ...updateData },
    });

    return NextResponse.json({ chapter: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE - Delete chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: interventionId, chapterId } = await params;
  const adminClient = createAdminClient();

  // Get chapter details before deletion for audit
  const { data: chapter } = await adminClient
    .from('intervention_chapters')
    .select('title, chapter_order')
    .eq('id', chapterId)
    .single();

  const { error } = await adminClient
    .from('intervention_chapters')
    .delete()
    .eq('id', chapterId)
    .eq('intervention_id', interventionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Reorder remaining chapters
  const { data: remainingChapters } = await adminClient
    .from('intervention_chapters')
    .select('id, chapter_order')
    .eq('intervention_id', interventionId)
    .order('chapter_order', { ascending: true });

  if (remainingChapters) {
    for (let i = 0; i < remainingChapters.length; i++) {
      await adminClient
        .from('intervention_chapters')
        .update({ chapter_order: i + 1 })
        .eq('id', remainingChapters[i].id);
    }

    // Update intervention total_chapters
    await adminClient
      .from('interventions')
      .update({
        total_chapters: remainingChapters.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', interventionId);
  }

  // Log audit
  await adminClient.from('audit_logs').insert({
    admin_id: admin.id,
    action: 'delete_chapter',
    resource_type: 'intervention_chapter',
    resource_id: chapterId,
    details: { intervention_id: interventionId, ...chapter },
  });

  return NextResponse.json({ success: true });
}
