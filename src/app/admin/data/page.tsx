import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { DataOverview } from '@/components/admin/data/data-overview';

async function getDataStats() {
  const adminClient = createAdminClient();

  const [
    usersResult,
    assessmentsResult,
    kbArticlesResult,
    interventionsResult,
    subscriptionsResult,
    paymentsResult,
    auditLogsResult,
  ] = await Promise.all([
    adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    adminClient.from('assessments').select('id', { count: 'exact', head: true }),
    adminClient.from('kb_articles').select('id', { count: 'exact', head: true }),
    adminClient.from('interventions').select('id', { count: 'exact', head: true }),
    adminClient.from('subscriptions').select('id', { count: 'exact', head: true }),
    adminClient.from('payments').select('id', { count: 'exact', head: true }),
    adminClient.from('audit_logs').select('id', { count: 'exact', head: true }),
  ]);

  // Get storage estimate (simplified)
  const storageEstimate = {
    users: (usersResult.count || 0) * 2, // ~2KB per user
    assessments: (assessmentsResult.count || 0) * 5, // ~5KB per assessment
    kbArticles: (kbArticlesResult.count || 0) * 50, // ~50KB per article with embeddings
    interventions: (interventionsResult.count || 0) * 10,
    logs: (auditLogsResult.count || 0) * 1,
  };

  const totalStorageKB = Object.values(storageEstimate).reduce((a, b) => a + b, 0);

  return {
    tables: {
      profiles: usersResult.count || 0,
      assessments: assessmentsResult.count || 0,
      kb_articles: kbArticlesResult.count || 0,
      interventions: interventionsResult.count || 0,
      subscriptions: subscriptionsResult.count || 0,
      payments: paymentsResult.count || 0,
      audit_logs: auditLogsResult.count || 0,
    },
    storage: {
      used: totalStorageKB,
      breakdown: storageEstimate,
    },
  };
}

export default async function DataManagementPage() {
  await requireAdmin();
  const stats = await getDataStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Data Management</h1>
        <p className="text-neutral-400">Database statistics, import/export, and maintenance</p>
      </div>

      <DataOverview stats={stats} />
    </div>
  );
}
