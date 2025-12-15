'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Users,
} from 'lucide-react';

interface Intervention {
  id: string;
  slug: string;
  title: string;
  title_ms: string | null;
  description: string | null;
  category: string;
  difficulty: string | null;
  estimated_duration: string | null;
  is_published: boolean;
  is_premium: boolean;
  created_at: string;
  intervention_chapters: { count: number }[] | null;
}

interface InterventionsTableProps {
  interventions: Intervention[];
  total: number;
  currentPage: number;
}

export function InterventionsTable({
  interventions,
  total,
  currentPage,
}: InterventionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / 20);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/interventions?${params.toString()}`);
  };

  const getChapterCount = (intervention: Intervention) => {
    if (Array.isArray(intervention.intervention_chapters)) {
      return intervention.intervention_chapters[0]?.count || 0;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Intervention
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-neutral-800 border border-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Chapters</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {interventions.map((intervention) => (
                <tr key={intervention.id} className="hover:bg-neutral-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-500/10">
                        <BookOpen className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{intervention.title}</p>
                        <p className="text-xs text-neutral-500">{intervention.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300 capitalize">
                      {intervention.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-300">
                      {getChapterCount(intervention)} chapters
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">
                      {intervention.estimated_duration || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        intervention.is_published
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-neutral-500/10 text-neutral-400'
                      }`}>
                        {intervention.is_published ? 'Published' : 'Draft'}
                      </span>
                      {intervention.is_premium && (
                        <span className="inline-flex px-2 py-1 bg-amber-500/10 rounded text-xs text-amber-400">
                          Premium
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">
                      {formatDistanceToNow(new Date(intervention.created_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-neutral-600 rounded-lg" title="View enrollments">
                        <Users className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg" title="Preview">
                        <Eye className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg" title="Edit">
                        <Edit className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {interventions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    No interventions found
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
