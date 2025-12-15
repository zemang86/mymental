'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Plus,
} from 'lucide-react';

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  metadata: Record<string, unknown> | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

interface AlertsManagerProps {
  alerts: Alert[];
  total: number;
  currentPage: number;
  selectedStatus?: string;
  selectedSeverity?: string;
}

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
];

const SEVERITIES = [
  { value: '', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'critical', label: 'Critical' },
];

export function AlertsManager({
  alerts,
  total,
  currentPage,
  selectedStatus,
  selectedSeverity,
}: AlertsManagerProps) {
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
    router.push(`/admin/alerts?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/alerts?${params.toString()}`);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'error':
        return 'bg-red-500/10 text-red-400';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400';
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/10 text-green-400';
      case 'acknowledged':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-amber-500/10 text-amber-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Alert
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Check className="w-4 h-4" />
          Resolve All Active
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-neutral-800 border border-neutral-700">
        <div className="p-4 border-b border-neutral-700 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Filters:</span>
          </div>
          <select
            value={selectedStatus || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
          >
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <select
            value={selectedSeverity || ''}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
          >
            {SEVERITIES.map((severity) => (
              <option key={severity.value} value={severity.value}>
                {severity.label}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-neutral-700">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-neutral-700/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity).split(' ')[0]}`}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white">{alert.title}</h4>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>Type: {alert.alert_type}</span>
                    <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
                    {alert.resolved_at && (
                      <span className="text-green-400">
                        Resolved {formatDistanceToNow(new Date(alert.resolved_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alert.status !== 'resolved' && (
                    <>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg text-green-400" title="Resolve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-neutral-600 rounded-lg text-neutral-400" title="Dismiss">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400">No alerts found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
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
              <span className="text-sm text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
