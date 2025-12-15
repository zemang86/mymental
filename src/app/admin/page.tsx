import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { DashboardStats } from '@/components/admin/dashboard/stats';
import { RecentActivity } from '@/components/admin/dashboard/recent-activity';
import { SystemHealth } from '@/components/admin/dashboard/system-health';
import { AlertsOverview } from '@/components/admin/dashboard/alerts-overview';

async function getDashboardData() {
  const adminClient = createAdminClient();

  // Fetch stats in parallel
  const [
    usersResult,
    assessmentsResult,
    subscriptionsResult,
    paymentsResult,
    alertsResult,
    recentUsersResult,
    recentAssessmentsResult,
    highRiskResult,
  ] = await Promise.all([
    adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    adminClient.from('assessments').select('id', { count: 'exact', head: true }),
    adminClient.from('subscriptions').select('id, tier, status'),
    adminClient
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', new Date(new Date().setDate(1)).toISOString()),
    adminClient
      .from('system_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
    adminClient
      .from('profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    adminClient
      .from('assessments')
      .select('id, assessment_type, total_score, risk_level, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5),
    adminClient
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('risk_level', ['high', 'imminent']),
  ]);

  const activeSubscriptions = subscriptionsResult.data?.filter(
    (s) => s.status === 'active'
  ).length || 0;

  const monthlyRevenue = paymentsResult.data?.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  ) || 0;

  return {
    stats: {
      totalUsers: usersResult.count || 0,
      totalAssessments: assessmentsResult.count || 0,
      activeSubscriptions,
      monthlyRevenue,
      unreadAlerts: alertsResult.count || 0,
      highRiskUsers: highRiskResult.count || 0,
    },
    recentUsers: recentUsersResult.data || [],
    recentAssessments: recentAssessmentsResult.data || [],
  };
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-400">
          Welcome back, {admin.fullName || admin.email}
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={data.stats} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity
            recentUsers={data.recentUsers}
            recentAssessments={data.recentAssessments}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SystemHealth />
          <AlertsOverview alertCount={data.stats.unreadAlerts} />
        </div>
      </div>
    </div>
  );
}
