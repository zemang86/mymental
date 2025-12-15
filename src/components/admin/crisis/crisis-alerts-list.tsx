'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  AlertTriangle,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';

interface CrisisAlert {
  id: string;
  assessment_type: string;
  total_score: number;
  risk_level: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
  } | null;
}

interface CrisisAlertsListProps {
  alerts: CrisisAlert[];
}

export function CrisisAlertsList({ alerts }: CrisisAlertsListProps) {
  const getRiskStyles = (risk: string) => {
    if (risk === 'imminent') {
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: <AlertCircle className="w-6 h-6 text-red-400" />,
        badge: 'bg-red-500 text-white',
        label: 'IMMINENT',
      };
    }
    return {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      badge: 'bg-orange-500 text-white',
      label: 'HIGH',
    };
  };

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Crisis Alerts</h3>
        <p className="text-neutral-400">
          There are currently no users with high or imminent risk levels requiring attention.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const styles = getRiskStyles(alert.risk_level);
        return (
          <div
            key={alert.id}
            className={`rounded-xl ${styles.bg} border ${styles.border} p-6`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-neutral-800/50">
                {styles.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${styles.badge}`}>
                    {styles.label} RISK
                  </span>
                  <span className="text-sm text-neutral-400 capitalize">
                    {alert.assessment_type.replace(/_/g, ' ')} Assessment
                  </span>
                  <span className="text-sm text-neutral-500">
                    Score: {alert.total_score}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span className="font-medium text-white">
                    {alert.user?.full_name || 'Anonymous User'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {alert.user?.email && (
                    <a
                      href={`mailto:${alert.user.email}`}
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {alert.user.email}
                    </a>
                  )}
                  {alert.user?.phone && (
                    <a
                      href={`tel:${alert.user.phone}`}
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {alert.user.phone}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  View Assessment
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-400 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Mark Contacted
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
