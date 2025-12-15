'use client';

import Link from 'next/link';
import { Bell, AlertTriangle, Info, ChevronRight } from 'lucide-react';

interface AlertsOverviewProps {
  alertCount: number;
}

export function AlertsOverview({ alertCount }: AlertsOverviewProps) {
  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-white">Alerts</h3>
        </div>
        {alertCount > 0 && (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-medium">
            {alertCount > 99 ? '99+' : alertCount}
          </span>
        )}
      </div>

      {alertCount === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-neutral-500" />
          </div>
          <p className="text-sm text-neutral-400">No pending alerts</p>
          <p className="text-xs text-neutral-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Quick summary */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  {alertCount} unread {alertCount === 1 ? 'alert' : 'alerts'}
                </p>
                <p className="text-xs text-amber-400/70 mt-0.5">
                  Requires your attention
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <Link
              href="/admin/alerts?type=error"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-neutral-300">Error Alerts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="/admin/crisis"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm text-neutral-300">Crisis Alerts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="/admin/alerts?type=user_feedback"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-neutral-300">User Feedback</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </Link>
          </div>
        </div>
      )}

      {/* View All Link */}
      <div className="mt-4 pt-3 border-t border-neutral-700">
        <Link
          href="/admin/alerts"
          className="text-sm text-primary-400 hover:text-primary-300 font-medium"
        >
          View all alerts →
        </Link>
      </div>
    </div>
  );
}
