'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Users,
  FileText,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface RecentActivityProps {
  recentUsers: Array<{
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
  }>;
  recentAssessments: Array<{
    id: string;
    assessment_type: string;
    total_score: number;
    risk_level: string;
    created_at: string;
    user_id: string | null;
  }>;
}

export function RecentActivity({
  recentUsers,
  recentAssessments,
}: RecentActivityProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'assessments'>('users');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'imminent':
      case 'high':
        return 'text-red-400 bg-red-500/10';
      case 'moderate':
        return 'text-amber-400 bg-amber-500/10';
      default:
        return 'text-green-400 bg-green-500/10';
    }
  };

  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700">
      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-primary-400 border-b-2 border-primary-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Recent Users
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'assessments'
              ? 'text-primary-400 border-b-2 border-primary-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Recent Assessments
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'users' ? (
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No recent users</p>
            ) : (
              recentUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {(user.full_name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.full_name || 'No name'}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">
                      {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {recentAssessments.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No recent assessments</p>
            ) : (
              recentAssessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/admin/assessments/${assessment.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white capitalize">
                      {assessment.assessment_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Score: {assessment.total_score}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(
                        assessment.risk_level
                      )}`}
                    >
                      {assessment.risk_level === 'imminent' && (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {assessment.risk_level}
                    </span>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDistanceToNow(new Date(assessment.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="px-4 py-3 border-t border-neutral-700">
        <Link
          href={activeTab === 'users' ? '/admin/users' : '/admin/assessments'}
          className="text-sm text-primary-400 hover:text-primary-300 font-medium"
        >
          View all {activeTab} →
        </Link>
      </div>
    </div>
  );
}
