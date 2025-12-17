import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { ChapterManager } from '@/components/admin/interventions/chapter-manager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getIntervention(id: string) {
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

  if (error || !data) {
    return null;
  }

  // Sort chapters by order
  if (data.intervention_chapters) {
    data.intervention_chapters.sort((a: { chapter_order: number }, b: { chapter_order: number }) =>
      a.chapter_order - b.chapter_order
    );
  }

  return data;
}

export default async function InterventionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const intervention = await getIntervention(id);

  if (!intervention) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/interventions"
          className="p-2 hover:bg-neutral-700 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{intervention.name}</h1>
          <p className="text-neutral-400">
            {intervention.category.replace('-', ' ')} • {intervention.intervention_chapters?.length || 0} chapters
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
            intervention.is_published
              ? 'bg-green-500/10 text-green-400'
              : 'bg-neutral-500/10 text-neutral-400'
          }`}>
            {intervention.is_published ? 'Published' : 'Draft'}
          </span>
          {intervention.is_premium && (
            <span className="inline-flex px-3 py-1 bg-amber-500/10 rounded-full text-sm text-amber-400">
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {intervention.description && (
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-neutral-300">{intervention.description}</p>
        </div>
      )}

      {/* Chapter Manager */}
      <ChapterManager
        interventionId={intervention.id}
        chapters={intervention.intervention_chapters || []}
      />
    </div>
  );
}
