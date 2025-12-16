'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

interface Referral {
  id: string;
  user_id: string;
  professional_id: string | null;
  risk_level: 'low' | 'moderate' | 'high' | 'imminent';
  detected_conditions: string[];
  referral_reason: string | null;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'declined';
  contact_preference: string[];
  preferred_languages: string[];
  notes: string | null;
  scheduled_date: string | null;
  completed_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  mental_health_professionals?: {
    name: string;
    credentials: string;
  };
}

interface ReferralAlert {
  id: string;
  user_id: string;
  referral_id: string;
  alert_type: 'high_risk' | 'imminent_risk';
  is_read: boolean;
  is_actioned: boolean;
  created_at: string;
  user_referrals?: Referral;
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [alerts, setAlerts] = useState<ReferralAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Fetch referrals
      const { data: referralsData } = await supabase
        .from('user_referrals')
        .select(`
          *,
          profiles (full_name, email),
          mental_health_professionals (name, credentials)
        `)
        .order('created_at', { ascending: false });

      // Fetch alerts
      const { data: alertsData } = await supabase
        .from('referral_alerts')
        .select(`
          *,
          user_referrals (
            *,
            profiles (full_name, email)
          )
        `)
        .order('created_at', { ascending: false });

      setReferrals(referralsData || []);
      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReferralStatus = async (referralId: string, status: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('user_referrals')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', referralId);

      if (!error) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating referral:', error);
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('referral_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (!error) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const markAlertAsActioned = async (alertId: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('referral_alerts')
        .update({
          is_actioned: true,
          actioned_at: new Date().toISOString(),
          actioned_by: user?.id,
        })
        .eq('id', alertId);

      if (!error) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error marking alert as actioned:', error);
    }
  };

  const filteredReferrals = referrals.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterRisk !== 'all' && r.risk_level !== filterRisk) return false;
    if (showAlertsOnly) {
      return alerts.some((a) => a.referral_id === r.id && !a.is_actioned);
    }
    return true;
  });

  const unreadAlerts = alerts.filter((a) => !a.is_read).length;
  const unactionedAlerts = alerts.filter((a) => !a.is_actioned).length;

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      moderate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      imminent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk as keyof typeof colors]}`}>
        {risk.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
      contacted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      scheduled: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      declined: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Referral Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage user referrals and connect them with professionals
          </p>
        </div>
        <GlassButton onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </GlassButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Unread Alerts</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{unreadAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Pending Action</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{unactionedAlerts}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Referrals</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{referrals.length}</p>
                </div>
                <User className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {referrals.filter((r) => r.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-neutral-900 dark:text-white">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="declined">Declined</option>
              </select>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="imminent">Imminent</option>
              </select>

              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAlertsOnly}
                  onChange={(e) => setShowAlertsOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-neutral-900 dark:text-white">Alerts Only</span>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Referrals List */}
        <div className="space-y-4">
          {filteredReferrals.map((referral) => {
            const alert = alerts.find((a) => a.referral_id === referral.id);

            return (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className={alert && !alert.is_actioned ? 'border-red-300 dark:border-red-700' : ''}>
                  <div className="p-6">
                    {/* Header with alerts */}
                    {alert && !alert.is_actioned && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">
                          {alert.alert_type === 'imminent_risk' ? 'URGENT: Imminent Risk' : 'High Risk Alert'}
                        </span>
                        <div className="ml-auto flex gap-2">
                          {!alert.is_read && (
                            <GlassButton size="sm" variant="ghost" onClick={() => markAlertAsRead(alert.id)}>
                              <Eye className="w-4 h-4" />
                            </GlassButton>
                          )}
                          <GlassButton size="sm" variant="secondary" onClick={() => markAlertAsActioned(alert.id)}>
                            Mark Actioned
                          </GlassButton>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                            {referral.profiles?.full_name || 'Unknown User'}
                          </h3>
                          {getRiskBadge(referral.risk_level)}
                          {getStatusBadge(referral.status)}
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {referral.profiles?.email}
                        </p>

                        {referral.referral_reason && (
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                            <strong>Reason:</strong> {referral.referral_reason}
                          </p>
                        )}

                        {referral.detected_conditions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {referral.detected_conditions.map((condition) => (
                              <span
                                key={condition}
                                className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs rounded-full"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {referral.contact_preference.join(', ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {referral.preferred_languages.join(', ')}
                          </span>
                          <span>Created: {new Date(referral.created_at).toLocaleDateString()}</span>
                        </div>

                        {referral.notes && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
                            <strong>Notes:</strong> {referral.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      {referral.status === 'pending' && (
                        <GlassButton
                          size="sm"
                          variant="primary"
                          onClick={() => updateReferralStatus(referral.id, 'contacted')}
                        >
                          Mark Contacted
                        </GlassButton>
                      )}
                      {referral.status === 'contacted' && (
                        <GlassButton
                          size="sm"
                          variant="primary"
                          onClick={() => updateReferralStatus(referral.id, 'scheduled')}
                        >
                          Mark Scheduled
                        </GlassButton>
                      )}
                      {referral.status === 'scheduled' && (
                        <GlassButton
                          size="sm"
                          variant="primary"
                          onClick={() => updateReferralStatus(referral.id, 'completed')}
                        >
                          Mark Completed
                        </GlassButton>
                      )}
                      {referral.status !== 'declined' && referral.status !== 'completed' && (
                        <GlassButton
                          size="sm"
                          variant="danger"
                          onClick={() => updateReferralStatus(referral.id, 'declined')}
                        >
                          Mark Declined
                        </GlassButton>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}

          {filteredReferrals.length === 0 && !loading && (
            <GlassCard>
              <div className="p-12 text-center">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No referrals found matching your filters.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
  );
}
