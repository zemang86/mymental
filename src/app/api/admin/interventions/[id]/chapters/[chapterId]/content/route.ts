import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdminAccess } from '@/lib/admin/auth';

// GET - Get chapter content (edited or KB fallback)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { chapterId } = await params;
  const adminClient = createAdminClient();

  // Get edited content if exists
  const { data: editedContent } = await adminClient
    .from('intervention_content_edited')
    .select('*')
    .eq('chapter_id', chapterId)
    .single();

  // Get chapter with KB article
  const { data: chapter } = await adminClient
    .from('intervention_chapters')
    .select(`
      *,
      kb_articles (
        id,
        title,
        content
      )
    `)
    .eq('id', chapterId)
    .single();

  return NextResponse.json({
    editedContent,
    chapter,
    hasEditedContent: !!editedContent,
  });
}

// PUT - Update or create edited content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const admin = await checkAdminAccess();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { chapterId } = await params;

  try {
    const body = await request.json();
    const {
      title_en,
      title_ms,
      content_en,
      content_ms,
      summary_en,
      summary_ms,
      video_url,
      video_provider = 'youtube',
      video_title,
      video_title_ms,
      video_duration_seconds,
      is_published = true,
    } = body;

    const adminClient = createAdminClient();

    // Check if edited content exists
    const { data: existing } = await adminClient
      .from('intervention_content_edited')
      .select('id')
      .eq('chapter_id', chapterId)
      .single();

    const contentData = {
      chapter_id: chapterId,
      title_en,
      title_ms,
      content_en,
      content_ms,
      summary_en,
      summary_ms,
      video_url,
      video_provider,
      video_title,
      video_title_ms,
      video_duration_seconds,
      is_published,
      updated_at: new Date().toISOString(),
    };

    let data;
    let error;

    if (existing) {
      // Update existing
      const result = await adminClient
        .from('intervention_content_edited')
        .update(contentData)
        .eq('chapter_id', chapterId)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new
      const result = await adminClient
        .from('intervention_content_edited')
        .insert(contentData)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log audit
    await adminClient.from('audit_logs').insert({
      admin_id: admin.id,
      action: existing ? 'update_content' : 'create_content',
      resource_type: 'intervention_content_edited',
      resource_id: data.id,
      details: { chapter_id: chapterId },
    });

    return NextResponse.json({ content: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
