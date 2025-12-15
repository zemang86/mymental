'use client';

import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

interface ReportsOverviewProps {
  data: {
    assessmentsByType: Record<string, number>;
    riskDistribution: Record<string, number>;
    subscriptionStats: {
      free: number;
      basic: number;
      premium: number;
      active: number;
    };
    payments: Array<{ amount: number; created_at: string }>;
  };
}

export function ReportsOverview({ data }: ReportsOverviewProps) {
  const totalAssessments = Object.values(data.assessmentsByType).reduce((a, b) => a + b, 0);
  const totalRevenue = data.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'imminent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          Export Full Report
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white text-sm font-medium transition-colors">
          <Calendar className="w-4 h-4" />
          Custom Date Range
        </button>
      </div>

      {/* Assessment Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Type */}
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-white">Assessments by Type</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(data.assessmentsByType).map(([type, count]) => {
              const percentage = totalAssessments > 0 ? (count / totalAssessments) * 100 : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-300 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-neutral-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(data.assessmentsByType).length === 0 && (
              <p className="text-neutral-500 text-center py-4">No assessment data</p>
            )}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-white">Risk Level Distribution</h3>
          </div>
          <div className="space-y-4">
            {['low', 'moderate', 'high', 'imminent'].map((risk) => {
              const count = data.riskDistribution[risk] || 0;
              const percentage = totalAssessments > 0 ? (count / totalAssessments) * 100 : 0;
              return (
                <div key={risk}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-300 capitalize">{risk}</span>
                    <span className="text-neutral-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getRiskColor(risk)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscription & Revenue */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subscriptions */}
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-white">Subscription Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-neutral-700/50">
              <p className="text-2xl font-bold text-white">{data.subscriptionStats.free}</p>
              <p className="text-sm text-neutral-400">Free Users</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-700/50">
              <p className="text-2xl font-bold text-blue-400">{data.subscriptionStats.basic}</p>
              <p className="text-sm text-neutral-400">Basic</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-700/50">
              <p className="text-2xl font-bold text-purple-400">{data.subscriptionStats.premium}</p>
              <p className="text-sm text-neutral-400">Premium</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-700/50">
              <p className="text-2xl font-bold text-green-400">{data.subscriptionStats.active}</p>
              <p className="text-sm text-neutral-400">Active Subs</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-white">Revenue (Last 6 Months)</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-emerald-400">
              RM {totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              {data.payments.length} transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
