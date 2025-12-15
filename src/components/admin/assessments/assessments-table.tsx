'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface Assessment {
  id: string;
  assessment_type: string;
  total_score: number;
  risk_level: string;
  status: string;
  created_at: string;
  profiles: { email: string; full_name: string | null } | null;
}

interface AssessmentsTableProps {
  assessments: Assessment[];
  total: number;
  currentPage: number;
  selectedType?: string;
  selectedRisk?: string;
}

const ASSESSMENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'depression', label: 'Depression' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'ptsd', label: 'PTSD' },
  { value: 'ocd', label: 'OCD' },
  { value: 'insomnia', label: 'Insomnia' },
];

const RISK_LEVELS = [
  { value: '', label: 'All Risk Levels' },
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'imminent', label: 'Imminent' },
];

export function AssessmentsTable({
  assessments,
  total,
  currentPage,
  selectedType,
  selectedRisk,
}: AssessmentsTableProps) {
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
    router.push(`/admin/assessments?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/assessments?${params.toString()}`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'imminent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-red-500/10 text-red-400';
      case 'moderate':
        return 'bg-amber-500/10 text-amber-400';
      default:
        return 'bg-green-500/10 text-green-400';
    }
  };

  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700">
      {/* Filters */}
      <div className="p-4 border-b border-neutral-700 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-400">Filters:</span>
        </div>
        <select
          value={selectedType || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
        >
          {ASSESSMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          value={selectedRisk || ''}
          onChange={(e) => handleFilterChange('risk', e.target.value)}
          className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
        >
          {RISK_LEVELS.map((risk) => (
            <option key={risk.value} value={risk.value}>
              {risk.label}
            </option>
          ))}
        </select>
        <button className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Risk Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-neutral-700/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {assessment.profiles?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {assessment.profiles?.email || 'No email'}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-neutral-300 capitalize">
                    {assessment.assessment_type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-white">
                    {assessment.total_score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRiskColor(assessment.risk_level)}`}>
                    {assessment.risk_level === 'imminent' && <AlertCircle className="w-3 h-3" />}
                    {assessment.risk_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-neutral-400 capitalize">
                    {assessment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-neutral-400">
                    {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-2 hover:bg-neutral-600 rounded-lg">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-neutral-700 flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total}
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
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
