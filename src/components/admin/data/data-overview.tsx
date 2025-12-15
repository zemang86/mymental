'use client';

import {
  Database,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  FileJson,
  Table,
  Archive,
} from 'lucide-react';

interface DataOverviewProps {
  stats: {
    tables: Record<string, number>;
    storage: {
      used: number;
      breakdown: Record<string, number>;
    };
  };
}

export function DataOverview({ stats }: DataOverviewProps) {
  const formatStorage = (kb: number) => {
    if (kb >= 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
    } else if (kb >= 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
    return `${kb} KB`;
  };

  const tableLabels: Record<string, string> = {
    profiles: 'Users',
    assessments: 'Assessments',
    kb_articles: 'KB Articles',
    interventions: 'Interventions',
    subscriptions: 'Subscriptions',
    payments: 'Payments',
    audit_logs: 'Audit Logs',
  };

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Estimated Storage</p>
              <p className="text-xl font-bold text-white">{formatStorage(stats.storage.used)}</p>
            </div>
          </div>
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min((stats.storage.used / (1024 * 1024)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">of 1 GB allocated</p>
        </div>

        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Records</p>
              <p className="text-xl font-bold text-white">
                {Object.values(stats.tables).reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">Across {Object.keys(stats.tables).length} tables</p>
        </div>

        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Table className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Database Status</p>
              <p className="text-xl font-bold text-green-400">Healthy</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">All tables operational</p>
        </div>
      </div>

      {/* Table Statistics */}
      <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-white">Table Statistics</h3>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Table</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Records</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Est. Size</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {Object.entries(stats.tables).map(([table, count]) => (
                <tr key={table} className="hover:bg-neutral-700/50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">{tableLabels[table] || table}</span>
                    <p className="text-xs text-neutral-500">{table}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-neutral-300">{count.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-neutral-400">
                      {formatStorage(stats.storage.breakdown[table.replace('_', '')] || count * 2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 hover:bg-neutral-600 rounded text-neutral-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import/Export & Maintenance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Import/Export */}
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileJson className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-white">Import / Export</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium transition-colors">
              <Download className="w-5 h-5" />
              Export All Data (JSON)
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors">
              <Download className="w-5 h-5" />
              Export Users (CSV)
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors">
              <Download className="w-5 h-5" />
              Export Assessments (CSV)
            </button>
            <div className="pt-4 border-t border-neutral-700">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-neutral-600 hover:border-neutral-500 rounded-lg text-neutral-400 hover:text-white transition-colors">
                <Upload className="w-5 h-5" />
                Import Data
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Archive className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-white">Maintenance</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors">
              <Archive className="w-5 h-5" />
              Create Backup
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors">
              <RefreshCw className="w-5 h-5" />
              Rebuild Embeddings Index
            </button>
            <div className="pt-4 border-t border-neutral-700">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-medium transition-colors">
                <Trash2 className="w-5 h-5" />
                Clear Old Audit Logs
              </button>
              <p className="text-xs text-neutral-500 mt-2 text-center">
                Removes logs older than 90 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
