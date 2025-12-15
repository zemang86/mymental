'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  FileText,
  Upload,
} from 'lucide-react';

interface KBArticle {
  id: string;
  title: string;
  title_ms: string | null;
  category: string;
  source_file: string | null;
  intervention_type: string | null;
  is_published: boolean;
  created_at: string;
}

interface KBArticlesTableProps {
  articles: KBArticle[];
  total: number;
  currentPage: number;
  selectedCategory?: string;
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'depression', label: 'Depression' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'ptsd', label: 'PTSD' },
  { value: 'ocd', label: 'OCD' },
  { value: 'insomnia', label: 'Insomnia' },
  { value: 'general', label: 'General' },
  { value: 'suicidal', label: 'Suicidal' },
  { value: 'psychosis', label: 'Psychosis' },
];

export function KBArticlesTable({
  articles,
  total,
  currentPage,
  selectedCategory,
}: KBArticlesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / 20);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin/kb?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/kb?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Article
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" />
          Bulk Import
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-neutral-800 border border-neutral-700">
        <div className="p-4 border-b border-neutral-700 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Filter:</span>
          </div>
          <select
            value={selectedCategory || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-neutral-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-xs">
                          {article.title}
                        </p>
                        {article.source_file && (
                          <p className="text-xs text-neutral-500 truncate max-w-xs">
                            {article.source_file}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300 capitalize">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400 capitalize">
                      {article.intervention_type || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      article.is_published
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-neutral-500/10 text-neutral-400'
                    }`}>
                      {article.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">
                      {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-neutral-600 rounded-lg">
                        <Eye className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg">
                        <Edit className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-neutral-700 flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing {Math.min((currentPage - 1) * 20 + 1, total)} to {Math.min(currentPage * 20, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className="text-sm text-white">Page {currentPage} of {totalPages || 1}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
