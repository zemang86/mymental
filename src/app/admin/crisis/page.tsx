import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { CrisisAlertsList } from '@/components/admin/crisis/crisis-alerts-list';

async function getCrisisAlerts() {
  const adminClient = createAdminClient();

  // Get users with high or imminent risk assessments
  const { data: highRiskAssessments } = await adminClient
    .from('assessments')
    .select(`
      id,
      user_id,
      assessment_type,
      total_score,
      risk_level,
      created_at,
      profiles (
        id,
        email,
        full_name,
        phone
      )
    `)
    .in('risk_level', ['high', 'imminent'])
    .order('created_at', { ascending: false })
    .limit(50);

  // Group by user and get latest assessment per user
  const userAlerts = new Map();
  highRiskAssessments?.forEach((assessment) => {
    const userId = assessment.user_id;
    // profiles can be an array or object depending on Supabase types
    const profileData = assessment.profiles as unknown;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    if (userId && !userAlerts.has(userId)) {
      userAlerts.set(userId, {
        id: assessment.id,
        assessment_type: assessment.assessment_type,
        total_score: assessment.total_score,
        risk_level: assessment.risk_level,
        created_at: assessment.created_at,
        user: profile as { id: string; email: string; full_name: string | null; phone: string | null } | null,
      });
    }
  });

  return Array.from(userAlerts.values());
}

async function getCrisisStats() {
  const adminClient = createAdminClient();

  const [imminent, high, weekly] = await Promise.all([
    adminClient.from('assessments').select('id', { count: 'exact', head: true })
      .eq('risk_level', 'imminent'),
    adminClient.from('assessments').select('id', { count: 'exact', head: true })
      .eq('risk_level', 'high'),
    adminClient.from('assessments').select('id', { count: 'exact', head: true })
      .in('risk_level', ['high', 'imminent'])
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    imminent: imminent.count || 0,
    high: high.count || 0,
    weeklyTotal: weekly.count || 0,
  };
}

export default async function CrisisAlertsPage() {
  await requireAdmin();
  const [alerts, stats] = await Promise.all([
    getCrisisAlerts(),
    getCrisisStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Crisis Alerts</h1>
        <p className="text-neutral-400">Monitor high-risk users requiring immediate attention</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-3xl font-bold text-red-400">{stats.imminent}</p>
          <p className="text-sm text-red-300">Imminent Risk</p>
        </div>
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
          <p className="text-3xl font-bold text-orange-400">{stats.high}</p>
          <p className="text-sm text-orange-300">High Risk</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-3xl font-bold text-white">{stats.weeklyTotal}</p>
          <p className="text-sm text-neutral-400">This Week</p>
        </div>
      </div>

      <CrisisAlertsList alerts={alerts} />
    </div>
  );
}
