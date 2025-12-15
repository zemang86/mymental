'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  risk_level: string | null;
  created_at: string;
  subscriptions: Array<{ tier: string; status: string }> | null;
}

interface UsersTableProps {
  users: User[];
  total: number;
  currentPage: number;
  search?: string;
}

export function UsersTable({ users, total, currentPage, search }: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(search || '');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const totalPages = Math.ceil(total / 20);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/admin/users?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/10 text-purple-400';
      case 'admin':
        return 'bg-blue-500/10 text-blue-400';
      case 'moderator':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-neutral-500/10 text-neutral-400';
    }
  };

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'imminent':
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
      {/* Header */}
      <div className="p-4 border-b border-neutral-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </form>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded bg-neutral-700 border-neutral-600"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map((u) => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Subscription</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Risk Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Joined</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-700/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                      }
                    }}
                    className="rounded bg-neutral-700 border-neutral-600"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.full_name || 'No name'}</p>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role?.replace('_', ' ') || 'user'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-neutral-300 capitalize">
                    {user.subscriptions?.[0]?.tier || 'free'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getRiskColor(user.risk_level)}`}>
                    {user.risk_level || 'low'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-neutral-400">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="p-1 hover:bg-neutral-600 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>
                    {openMenu === user.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-neutral-700 border border-neutral-600 rounded-lg shadow-xl z-10">
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-600">
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-600">
                          <Edit className="w-4 h-4" /> Edit User
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-600">
                          <Shield className="w-4 h-4" /> Change Role
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-amber-400 hover:bg-neutral-600">
                          <Ban className="w-4 h-4" /> Suspend
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-600">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-neutral-700 flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} users
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-sm text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
