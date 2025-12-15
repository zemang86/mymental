import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { AlertsManager } from '@/components/admin/alerts/alerts-manager';

async function getAlerts(page = 1, limit = 20, status?: string, severity?: string) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = adminClient
    .from('system_alerts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }
  if (severity) {
    query = query.eq('severity', severity);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching alerts:', error);
    return { alerts: [], total: 0 };
  }

  return { alerts: data || [], total: count || 0 };
}

async function getAlertStats() {
  const adminClient = createAdminClient();

  const [total, critical, active, resolved] = await Promise.all([
    adminClient.from('system_alerts').select('id', { count: 'exact', head: true }),
    adminClient.from('system_alerts').select('id', { count: 'exact', head: true })
      .eq('severity', 'critical')
      .eq('status', 'active'),
    adminClient.from('system_alerts').select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    adminClient.from('system_alerts').select('id', { count: 'exact', head: true })
      .eq('status', 'resolved'),
  ]);

  return {
    total: total.count || 0,
    critical: critical.count || 0,
    active: active.count || 0,
    resolved: resolved.count || 0,
  };
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; severity?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const [{ alerts, total }, stats] = await Promise.all([
    getAlerts(page, 20, params.status, params.severity),
    getAlertStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Alerts</h1>
        <p className="text-neutral-400">Monitor system notifications and alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Total Alerts</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-red-400">{stats.critical.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Critical</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-amber-400">{stats.active.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Active</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-green-400">{stats.resolved.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Resolved</p>
        </div>
      </div>

      <AlertsManager
        alerts={alerts}
        total={total}
        currentPage={page}
        selectedStatus={params.status}
        selectedSeverity={params.severity}
      />
    </div>
  );
}
