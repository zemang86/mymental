import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { ReportsOverview } from '@/components/admin/reports/reports-overview';

async function getReportData() {
  const adminClient = createAdminClient();

  // Get assessment breakdown by type
  const { data: assessmentsByType } = await adminClient
    .from('assessments')
    .select('assessment_type')
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((a) => {
        counts[a.assessment_type] = (counts[a.assessment_type] || 0) + 1;
      });
      return { data: counts };
    });

  // Get risk level distribution
  const { data: riskDistribution } = await adminClient
    .from('assessments')
    .select('risk_level')
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((a) => {
        counts[a.risk_level || 'unknown'] = (counts[a.risk_level || 'unknown'] || 0) + 1;
      });
      return { data: counts };
    });

  // Get subscription breakdown
  const { data: subscriptions } = await adminClient
    .from('subscriptions')
    .select('tier, status');

  const subscriptionStats = {
    free: 0,
    basic: 0,
    premium: 0,
    active: 0,
  };
  subscriptions?.forEach((s) => {
    if (s.tier) subscriptionStats[s.tier as keyof typeof subscriptionStats]++;
    if (s.status === 'active') subscriptionStats.active++;
  });

  // Get monthly revenue
  const { data: payments } = await adminClient
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'completed')
    .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

  return {
    assessmentsByType: assessmentsByType || {},
    riskDistribution: riskDistribution || {},
    subscriptionStats,
    payments: payments || [],
  };
}

export default async function ReportsPage() {
  await requireAdmin();
  const data = await getReportData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-neutral-400">View usage statistics and generate reports</p>
      </div>

      <ReportsOverview data={data} />
    </div>
  );
}
