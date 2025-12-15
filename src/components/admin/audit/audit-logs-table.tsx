'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  LogIn,
  Shield,
  Eye,
} from 'lucide-react';

interface AuditLog {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AccessLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface AuditLogsTableProps {
  auditLogs: AuditLog[];
  auditTotal: number;
  accessLogs: AccessLog[];
  accessTotal: number;
  currentPage: number;
  currentTab: string;
  selectedAction?: string;
}

const ACTION_TYPES = [
  { value: '', label: 'All Actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'view', label: 'View' },
  { value: 'export', label: 'Export' },
];

export function AuditLogsTable({
  auditLogs,
  auditTotal,
  accessLogs,
  accessTotal,
  currentPage,
  currentTab,
  selectedAction,
}: AuditLogsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.set('page', '1');
    router.push(`/admin/audit?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin/audit?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/audit?${params.toString()}`);
  };

  const total = currentTab === 'audit' ? auditTotal : accessTotal;
  const totalPages = Math.ceil(total / 20);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/10 text-green-400';
      case 'update':
        return 'bg-blue-500/10 text-blue-400';
      case 'delete':
        return 'bg-red-500/10 text-red-400';
      case 'view':
        return 'bg-neutral-500/10 text-neutral-400';
      default:
        return 'bg-purple-500/10 text-purple-400';
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'login_success':
        return 'bg-green-500/10 text-green-400';
      case 'login_failed':
        return 'bg-red-500/10 text-red-400';
      case 'logout':
        return 'bg-neutral-500/10 text-neutral-400';
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700">
      {/* Tabs */}
      <div className="border-b border-neutral-700">
        <div className="flex">
          <button
            onClick={() => handleTabChange('audit')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              currentTab === 'audit'
                ? 'text-white border-b-2 border-primary-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Admin Actions
          </button>
          <button
            onClick={() => handleTabChange('access')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              currentTab === 'access'
                ? 'text-white border-b-2 border-primary-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Access Logs
          </button>
        </div>
      </div>

      {/* Filters (audit only) */}
      {currentTab === 'audit' && (
        <div className="p-4 border-b border-neutral-700 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Filter:</span>
          </div>
          <select
            value={selectedAction || ''}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
          >
            {ACTION_TYPES.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Audit Logs Table */}
      {currentTab === 'audit' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{log.admin_email || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-300">{log.entity_type}</span>
                    {log.entity_id && (
                      <p className="text-xs text-neutral-500 truncate max-w-32">{log.entity_id}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">{log.ip_address || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 hover:bg-neutral-600 rounded-lg">
                      <Eye className="w-4 h-4 text-neutral-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Access Logs Table */}
      {currentTab === 'access' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Browser</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {accessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-700/50">
                  <td className="px-4 py-3">
                    <span className="text-sm text-white">{log.user_email || 'Unknown'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getEventColor(log.event_type)}`}>
                      {log.event_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">{log.ip_address || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400 truncate max-w-48 block">
                      {log.user_agent?.split(' ')[0] || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </td>
                </tr>
              ))}
              {accessLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    No access logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
  );
}
