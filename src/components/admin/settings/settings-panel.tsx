'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Key,
  CreditCard,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface SettingsPanelProps {
  adminEmail: string;
  isSuperAdmin?: boolean;
}

interface SystemSettings {
  platform_name: string;
  support_email: string;
  default_language: string;
  maintenance_mode: boolean;
  notify_crisis_alerts: boolean;
  notify_new_users: boolean;
  notify_payment_events: boolean;
  notify_system_errors: boolean;
  session_timeout_minutes: number;
  crisis_hotlines: Record<string, string>;
}

const defaultSettings: SystemSettings = {
  platform_name: 'MyMental',
  support_email: 'support@mymental.com',
  default_language: 'en',
  maintenance_mode: false,
  notify_crisis_alerts: true,
  notify_new_users: false,
  notify_payment_events: true,
  notify_system_errors: true,
  session_timeout_minutes: 60,
  crisis_hotlines: {},
};

export function SettingsPanel({ adminEmail, isSuperAdmin = false }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings({
            platform_name: data.settings.platform_name || defaultSettings.platform_name,
            support_email: data.settings.support_email || defaultSettings.support_email,
            default_language: data.settings.default_language || defaultSettings.default_language,
            maintenance_mode: data.settings.maintenance_mode ?? defaultSettings.maintenance_mode,
            notify_crisis_alerts: data.settings.notify_crisis_alerts ?? defaultSettings.notify_crisis_alerts,
            notify_new_users: data.settings.notify_new_users ?? defaultSettings.notify_new_users,
            notify_payment_events: data.settings.notify_payment_events ?? defaultSettings.notify_payment_events,
            notify_system_errors: data.settings.notify_system_errors ?? defaultSettings.notify_system_errors,
            session_timeout_minutes: data.settings.session_timeout_minutes ?? defaultSettings.session_timeout_minutes,
            crisis_hotlines: data.settings.crisis_hotlines || defaultSettings.crisis_hotlines,
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Update a setting
  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaveStatus('idle');
  };

  // Save settings
  const saveSettings = async () => {
    if (!isSuperAdmin) {
      setSaveStatus('error');
      setSaveMessage('Only super admins can modify settings');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveStatus('success');
        setSaveMessage(data.message || 'Settings saved successfully');
        setHasChanges(false);
      } else {
        setSaveStatus('error');
        setSaveMessage(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            saveStatus === 'success'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            {saveStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {saveMessage}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={settings.platform_name}
                    onChange={(e) => updateSetting('platform_name', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={!isSuperAdmin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => updateSetting('support_email', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={!isSuperAdmin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Default Language
                  </label>
                  <select
                    value={settings.default_language}
                    onChange={(e) => updateSetting('default_language', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={!isSuperAdmin}
                  >
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                  <div>
                    <p className="font-medium text-white">Maintenance Mode</p>
                    <p className="text-sm text-neutral-400">Disable public access temporarily</p>
                  </div>
                  <button
                    onClick={() => updateSetting('maintenance_mode', !settings.maintenance_mode)}
                    disabled={!isSuperAdmin}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.maintenance_mode
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
                    } ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {settings.maintenance_mode ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {isSuperAdmin && (
              <button
                onClick={saveSettings}
                disabled={isSaving || !hasChanges}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  hasChanges
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}

            {!isSuperAdmin && (
              <p className="text-sm text-neutral-500">
                Only super admins can modify settings.
              </p>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>

              <div className="space-y-4">
                {[
                  { key: 'notify_crisis_alerts' as const, label: 'Crisis Alerts', desc: 'Notify on high-risk assessments' },
                  { key: 'notify_new_users' as const, label: 'New Users', desc: 'Notify on new registrations' },
                  { key: 'notify_payment_events' as const, label: 'Payment Events', desc: 'Notify on subscription changes' },
                  { key: 'notify_system_errors' as const, label: 'System Errors', desc: 'Notify on critical errors' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-neutral-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => updateSetting(item.key, !settings[item.key])}
                      disabled={!isSuperAdmin}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings[item.key]
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-neutral-700 text-neutral-400'
                      } ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                    >
                      {settings[item.key] ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {isSuperAdmin && (
              <button
                onClick={saveSettings}
                disabled={isSaving || !hasChanges}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  hasChanges
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-neutral-700">
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-neutral-400">Require 2FA for admin access</p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-700 text-neutral-400 rounded-lg text-sm cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-700">
                  <div>
                    <p className="font-medium text-white">Session Timeout</p>
                    <p className="text-sm text-neutral-400">Auto-logout after inactivity</p>
                  </div>
                  <select
                    value={settings.session_timeout_minutes}
                    onChange={(e) => updateSetting('session_timeout_minutes', parseInt(e.target.value))}
                    disabled={!isSuperAdmin}
                    className={`px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 ${
                      !isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={240}>4 hours</option>
                    <option value={480}>8 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-white">IP Whitelist</p>
                    <p className="text-sm text-neutral-400">Restrict admin access by IP</p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-700 text-neutral-400 rounded-lg text-sm cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Admin Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    disabled
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-400"
                  />
                </div>
                <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm font-medium">
                  Change Password
                </button>
              </div>
            </div>

            {isSuperAdmin && hasChanges && (
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        )}

        {activeTab === 'api' && (
          <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>

            <div className="space-y-4">
              {[
                { name: 'Supabase', status: 'configured', key: '••••••••' },
                { name: 'Anthropic (Claude)', status: 'configured', key: '••••••••' },
                { name: 'OpenAI', status: 'configured', key: '••••••••' },
                { name: 'Stripe', status: 'not_configured', key: null },
              ].map((api) => (
                <div key={api.name} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium text-white">{api.name}</p>
                      <p className="text-sm text-neutral-500">{api.key || 'Not set'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${
                    api.status === 'configured'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-neutral-500/10 text-neutral-400'
                  }`}>
                    {api.status === 'configured' ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              API keys are managed via environment variables for security.
            </p>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription Plans</h3>

              <div className="space-y-4">
                {[
                  { name: 'Free', price: 'RM 0', features: 'Basic assessments' },
                  { name: 'Basic', price: 'RM 19/mo', features: 'AI insights, Detailed results' },
                  { name: 'Premium', price: 'RM 49/mo', features: 'Full interventions, Priority support' },
                ].map((plan) => (
                  <div key={plan.name} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
                    <div>
                      <p className="font-medium text-white">{plan.name}</p>
                      <p className="text-sm text-neutral-400">{plan.features}</p>
                    </div>
                    <span className="text-lg font-bold text-white">{plan.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Gateway</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-neutral-500" />
                  <div>
                    <p className="font-medium text-white">Stripe</p>
                    <p className="text-sm text-neutral-400">Payment processing</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-medium">
                  Simulation Mode
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
