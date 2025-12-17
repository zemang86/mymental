import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdminAccess } from '@/lib/admin/auth';

// POST - Create new chapter
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: interventionId } = await params;

  try {
    const body = await request.json();
    const {
      title,
      title_ms,
      description,
      description_ms,
      is_free_preview = false,
      kb_article_id,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get next chapter order
    const { data: lastChapter } = await adminClient
      .from('intervention_chapters')
      .select('chapter_order')
      .eq('intervention_id', interventionId)
      .order('chapter_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (lastChapter?.chapter_order || 0) + 1;

    const { data, error } = await adminClient
      .from('intervention_chapters')
      .insert({
        intervention_id: interventionId,
        title,
        title_ms,
        description,
        description_ms,
        is_free_preview,
        kb_article_id,
        chapter_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update intervention total_chapters count
    await adminClient
      .from('interventions')
      .update({
        total_chapters: nextOrder,
        updated_at: new Date().toISOString(),
      })
      .eq('id', interventionId);

    // Log audit
    await adminClient.from('audit_logs').insert({
      admin_id: admin.id,
      action: 'create_chapter',
      resource_type: 'intervention_chapter',
      resource_id: data.id,
      details: { intervention_id: interventionId, title, chapter_order: nextOrder },
    });

    return NextResponse.json({ chapter: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT - Reorder chapters
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: interventionId } = await params;

  try {
    const body = await request.json();
    const { chapters } = body; // Array of { id, chapter_order }

    if (!Array.isArray(chapters)) {
      return NextResponse.json({ error: 'Chapters array is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Update each chapter's order
    for (const chapter of chapters) {
      await adminClient
        .from('intervention_chapters')
        .update({ chapter_order: chapter.chapter_order })
        .eq('id', chapter.id)
        .eq('intervention_id', interventionId);
    }

    // Log audit
    await adminClient.from('audit_logs').insert({
      admin_id: admin.id,
      action: 'reorder_chapters',
      resource_type: 'intervention',
      resource_id: interventionId,
      details: { new_order: chapters },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
