import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { InterventionsTable } from '@/components/admin/interventions/interventions-table';

async function getInterventions(page = 1, limit = 20) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  const { data, count, error } = await adminClient
    .from('interventions')
    .select('*, intervention_chapters(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching interventions:', error);
    return { interventions: [], total: 0 };
  }

  return { interventions: data || [], total: count || 0 };
}

async function getInterventionStats() {
  const adminClient = createAdminClient();

  const [total, published, progress] = await Promise.all([
    adminClient.from('interventions').select('id', { count: 'exact', head: true }),
    adminClient.from('interventions').select('id', { count: 'exact', head: true })
      .eq('is_published', true),
    adminClient.from('user_intervention_progress').select('id', { count: 'exact', head: true }),
  ]);

  return {
    total: total.count || 0,
    published: published.count || 0,
    enrollments: progress.count || 0,
  };
}

export default async function InterventionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const [{ interventions, total }, stats] = await Promise.all([
    getInterventions(page, 20),
    getInterventionStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Interventions</h1>
        <p className="text-neutral-400">Manage intervention programs and modules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-neutral-400">Total Programs</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-green-400">{stats.published}</p>
          <p className="text-sm text-neutral-400">Published</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-blue-400">{stats.enrollments}</p>
          <p className="text-sm text-neutral-400">User Enrollments</p>
        </div>
      </div>

      <InterventionsTable
        interventions={interventions}
        total={total}
        currentPage={page}
      />
    </div>
  );
}
