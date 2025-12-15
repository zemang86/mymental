import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { SubscriptionsTable } from '@/components/admin/subscriptions/subscriptions-table';

async function getSubscriptions(page = 1, limit = 20, tier?: string, status?: string) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = adminClient
    .from('subscriptions')
    .select('*, profiles(email, full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (tier) {
    query = query.eq('tier', tier);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return { subscriptions: [], total: 0 };
  }

  return { subscriptions: data || [], total: count || 0 };
}

async function getSubscriptionStats() {
  const adminClient = createAdminClient();

  const [total, active, basic, premium] = await Promise.all([
    adminClient.from('subscriptions').select('id', { count: 'exact', head: true }),
    adminClient.from('subscriptions').select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    adminClient.from('subscriptions').select('id', { count: 'exact', head: true })
      .eq('tier', 'basic'),
    adminClient.from('subscriptions').select('id', { count: 'exact', head: true })
      .eq('tier', 'premium'),
  ]);

  // Get MRR (Monthly Recurring Revenue)
  const { data: activePayments } = await adminClient
    .from('subscriptions')
    .select('tier')
    .eq('status', 'active');

  const mrr = (activePayments || []).reduce((sum, sub) => {
    if (sub.tier === 'basic') return sum + 19;
    if (sub.tier === 'premium') return sum + 49;
    return sum;
  }, 0);

  return {
    total: total.count || 0,
    active: active.count || 0,
    basic: basic.count || 0,
    premium: premium.count || 0,
    mrr,
  };
}

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tier?: string; status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const [{ subscriptions, total }, stats] = await Promise.all([
    getSubscriptions(page, 20, params.tier, params.status),
    getSubscriptionStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-neutral-400">Manage user subscriptions and billing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-neutral-400">Total</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          <p className="text-sm text-neutral-400">Active</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-blue-400">{stats.basic}</p>
          <p className="text-sm text-neutral-400">Basic</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-purple-400">{stats.premium}</p>
          <p className="text-sm text-neutral-400">Premium</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-2xl font-bold text-emerald-400">RM {stats.mrr}</p>
          <p className="text-sm text-emerald-300">Est. MRR</p>
        </div>
      </div>

      <SubscriptionsTable
        subscriptions={subscriptions}
        total={total}
        currentPage={page}
        selectedTier={params.tier}
        selectedStatus={params.status}
      />
    </div>
  );
}
