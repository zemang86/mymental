import { requireAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { KBArticlesTable } from '@/components/admin/kb/kb-articles-table';

async function getKBArticles(page = 1, limit = 20, category?: string) {
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = adminClient
    .from('kb_articles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching KB articles:', error);
    return { articles: [], total: 0 };
  }

  return { articles: data || [], total: count || 0 };
}

async function getKBStats() {
  const adminClient = createAdminClient();

  const [total, categoriesResult] = await Promise.all([
    adminClient.from('kb_articles').select('id', { count: 'exact', head: true }),
    adminClient.from('kb_articles').select('category'),
  ]);

  const categories = new Set(categoriesResult.data?.map((a) => a.category) || []);

  return {
    total: total.count || 0,
    categories: categories.size,
  };
}

export default async function KBArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const [{ articles, total }, stats] = await Promise.all([
    getKBArticles(page, 20, params.category),
    getKBStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
        <p className="text-neutral-400">Manage KB articles and intervention content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-neutral-400">Total Articles</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800 border border-neutral-700">
          <p className="text-2xl font-bold text-white">{stats.categories}</p>
          <p className="text-sm text-neutral-400">Categories</p>
        </div>
      </div>

      <KBArticlesTable
        articles={articles}
        total={total}
        currentPage={page}
        selectedCategory={params.category}
      />
    </div>
  );
}
