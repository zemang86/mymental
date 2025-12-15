'use client';

import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface HealthItem {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  latency?: number;
}

export function SystemHealth() {
  // In a real app, this would be fetched from an API
  const healthItems: HealthItem[] = [
    { name: 'Database', status: 'healthy', latency: 12 },
    { name: 'Authentication', status: 'healthy', latency: 45 },
    { name: 'AI Services', status: 'healthy', latency: 230 },
    { name: 'Storage', status: 'healthy', latency: 18 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'warning':
        return 'text-amber-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  const overallStatus = healthItems.every((item) => item.status === 'healthy')
    ? 'healthy'
    : healthItems.some((item) => item.status === 'error')
    ? 'error'
    : 'warning';

  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-white">System Health</h3>
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            overallStatus === 'healthy'
              ? 'bg-green-500/10 text-green-400'
              : overallStatus === 'warning'
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {getStatusIcon(overallStatus)}
          {overallStatus === 'healthy' ? 'All Systems Operational' : 'Issues Detected'}
        </span>
      </div>

      <div className="space-y-3">
        {healthItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-2 border-b border-neutral-700 last:border-0"
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(item.status)}
              <span className="text-sm text-neutral-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.latency && (
                <span className="text-xs text-neutral-500">{item.latency}ms</span>
              )}
              <span className={`text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
