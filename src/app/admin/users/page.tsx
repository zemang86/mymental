import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { UsersTable } from '@/components/admin/users/users-table';

async function getUsers(page = 1, limit = 20, search?: string) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = adminClient
    .from('profiles')
    .select('*, subscriptions(tier, status)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }

  return { users: data || [], total: count || 0 };
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search;

  const { users, total } = await getUsers(page, 20, search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-neutral-400">Manage user accounts and permissions</p>
        </div>
      </div>

      <UsersTable users={users} total={total} currentPage={page} search={search} />
    </div>
  );
}
