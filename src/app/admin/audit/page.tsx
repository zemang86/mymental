import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { AuditLogsTable } from '@/components/admin/audit/audit-logs-table';

async function getAuditLogs(page = 1, limit = 20, action?: string) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = adminClient
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) {
    query = query.eq('action', action);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return { logs: [], total: 0 };
  }

  return { logs: data || [], total: count || 0 };
}

async function getAccessLogs(page = 1, limit = 20) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  const { data, count, error } = await adminClient
    .from('access_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching access logs:', error);
    return { logs: [], total: 0 };
  }

  return { logs: data || [], total: count || 0 };
}

async function getLogStats() {
  const adminClient = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalAudit, todayAudit, totalAccess, failedLogins] = await Promise.all([
    adminClient.from('audit_logs').select('id', { count: 'exact', head: true }),
    adminClient.from('audit_logs').select('id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
    adminClient.from('access_logs').select('id', { count: 'exact', head: true }),
    adminClient.from('access_logs').select('id', { count: 'exact', head: true })
      .eq('event_type', 'login_failed'),
  ]);

  return {
    totalAudit: totalAudit.count || 0,
    todayAudit: todayAudit.count || 0,
    totalAccess: totalAccess.count || 0,
    failedLogins: failedLogins.count || 0,
  };
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tab?: string; action?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const tab = params.tab || 'audit';

  const [auditData, accessData, stats] = await Promise.all([
    getAuditLogs(page, 20, params.action),
    getAccessLogs(page, 20),
    getLogStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-neutral-400">Track admin actions and access events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.totalAudit.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Total Audit Logs</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.todayAudit.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Today&apos;s Actions</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.totalAccess.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Access Events</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-red-400">{stats.failedLogins.toLocaleString()}</p>
          <p className="text-sm text-neutral-400">Failed Logins</p>
        </div>
      </div>

      <AuditLogsTable
        auditLogs={auditData.logs}
        auditTotal={auditData.total}
        accessLogs={accessData.logs}
        accessTotal={accessData.total}
        currentPage={page}
        currentTab={tab}
        selectedAction={params.action}
      />
    </div>
  );
}
