'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Save,
  Key,
  CreditCard,
} from 'lucide-react';

interface SettingsPanelProps {
  adminEmail: string;
}

export function SettingsPanel({ adminEmail }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

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
                    defaultValue="MyMental"
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@mymental.com"
                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Default Language
                  </label>
                  <select className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white">
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                  <div>
                    <p className="font-medium text-white">Maintenance Mode</p>
                    <p className="text-sm text-neutral-400">Disable public access temporarily</p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white">
                    Disabled
                  </button>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium">
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="rounded-xl bg-neutral-800 border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>

            <div className="space-y-4">
              {[
                { label: 'Crisis Alerts', desc: 'Notify on high-risk assessments', enabled: true },
                { label: 'New Users', desc: 'Notify on new registrations', enabled: false },
                { label: 'Payment Events', desc: 'Notify on subscription changes', enabled: true },
                { label: 'System Errors', desc: 'Notify on critical errors', enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-neutral-400">{item.desc}</p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    item.enabled
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
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
                  <button className="px-4 py-2 bg-neutral-700 text-neutral-400 rounded-lg text-sm">
                    Not Configured
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-700">
                  <div>
                    <p className="font-medium text-white">Session Timeout</p>
                    <p className="text-sm text-neutral-400">Auto-logout after inactivity</p>
                  </div>
                  <select className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>8 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-white">IP Whitelist</p>
                    <p className="text-sm text-neutral-400">Restrict admin access by IP</p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-700 text-neutral-400 rounded-lg text-sm">
                    Not Configured
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
