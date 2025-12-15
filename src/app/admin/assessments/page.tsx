import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { AssessmentsTable } from '@/components/admin/assessments/assessments-table';

async function getAssessments(page = 1, limit = 20, type?: string, risk?: string) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = adminClient
    .from('assessments')
    .select('*, profiles(email, full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) {
    query = query.eq('assessment_type', type);
  }
  if (risk) {
    query = query.eq('risk_level', risk);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching assessments:', error);
    return { assessments: [], total: 0 };
  }

  return { assessments: data || [], total: count || 0 };
}

async function getAssessmentStats() {
  const adminClient = createAdminClient();

  const [totalResult, todayResult, highRiskResult] = await Promise.all([
    adminClient.from('assessments').select('id', { count: 'exact', head: true }),
    adminClient.from('assessments').select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    adminClient.from('assessments').select('id', { count: 'exact', head: true })
      .in('risk_level', ['high', 'imminent']),
  ]);

  return {
    total: totalResult.count || 0,
    today: todayResult.count || 0,
    highRisk: highRiskResult.count || 0,
  };
}

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; risk?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const [{ assessments, total }, stats] = await Promise.all([
    getAssessments(page, 20, params.type, params.risk),
    getAssessmentStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assessments</h1>
        <p className="text-neutral-400">View and manage user assessments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Total Assessments</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.today.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Today</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-red-400">{stats.highRisk.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">High Risk</p>
        </div>
      </div>

      <AssessmentsTable
        assessments={assessments}
        total={total}
        currentPage={page}
        selectedType={params.type}
        selectedRisk={params.risk}
      />
    </div>
  );
}
