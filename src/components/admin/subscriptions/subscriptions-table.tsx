'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CreditCard,
  XCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useState } from 'react';

interface Subscription {
  id: string;
  user_id: string;
  tier: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  profiles: { email: string; full_name: string | null } | null;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  total: number;
  currentPage: number;
  selectedTier?: string;
  selectedStatus?: string;
}

const TIERS = [
  { value: '', label: 'All Tiers' },
  { value: 'free', label: 'Free' },
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'trialing', label: 'Trialing' },
];

export function SubscriptionsTable({
  subscriptions,
  total,
  currentPage,
  selectedTier,
  selectedStatus,
}: SubscriptionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const totalPages = Math.ceil(total / 20);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-purple-500/10 text-purple-400';
      case 'basic':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-neutral-500/10 text-neutral-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400';
      case 'canceled':
        return 'bg-red-500/10 text-red-400';
      case 'past_due':
        return 'bg-amber-500/10 text-amber-400';
      case 'trialing':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-neutral-500/10 text-neutral-400';
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
          value={selectedTier || ''}
          onChange={(e) => handleFilterChange('tier', e.target.value)}
          className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white"
        >
          {TIERS.map((tier) => (
            <option key={tier.value} value={tier.value}>
              {tier.label}
            </option>
          ))}
        </select>
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Tier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-neutral-700/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {sub.profiles?.full_name || 'No name'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {sub.profiles?.email || 'No email'}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${getTierColor(sub.tier)}`}>
                    {sub.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                    {sub.cancel_at_period_end && (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Clock className="w-3 h-3" />
                        Canceling
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {sub.current_period_end ? (
                    <div>
                      <p className="text-sm text-neutral-300">
                        Ends {format(new Date(sub.current_period_end), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(sub.current_period_end), { addSuffix: true })}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-neutral-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-neutral-400">
                    {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === sub.id ? null : sub.id)}
                      className="p-1 hover:bg-neutral-600 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>
                    {openMenu === sub.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-neutral-700 border border-neutral-600 rounded-lg shadow-xl z-10">
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-600">
                          <CreditCard className="w-4 h-4" /> View Payments
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-600">
                          <RefreshCw className="w-4 h-4" /> Change Plan
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-600">
                          <XCircle className="w-4 h-4" /> Cancel Subscription
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No subscriptions found
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
  );
}
