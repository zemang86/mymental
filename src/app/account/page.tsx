'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Globe,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Save,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';

export default function AccountPage() {
  const { userEmail, demographics, setDemographics, clearSession } = useAssessmentStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // In production, save to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your profile and preferences
            </p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  Profile
                </h2>
                {!isEditing && (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </GlassButton>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <GlassInput
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white">
                      {name || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <p className="text-neutral-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    {userEmail || 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Age
                  </label>
                  <p className="text-neutral-900 dark:text-white">
                    {demographics.age || 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Gender
                  </label>
                  <p className="text-neutral-900 dark:text-white capitalize">
                    {demographics.gender || 'Not set'}
                  </p>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <GlassButton
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </GlassButton>
                    <GlassButton
                      variant="primary"
                      onClick={handleSave}
                      loading={isSaving}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </GlassButton>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <GlassCard>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-primary-500" />
                Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      Language
                    </p>
                    <p className="text-sm text-neutral-500">
                      Choose your preferred language
                    </p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      Notifications
                    </p>
                    <p className="text-sm text-neutral-500">
                      Receive reminders for assessments
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications
                        ? 'bg-primary-500'
                        : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <GlassCard>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-primary-500" />
                Security
              </h2>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-neutral-500" />
                    <div className="text-left">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        Change Password
                      </p>
                      <p className="text-sm text-neutral-500">
                        Update your password regularly
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-neutral-500" />
                    <div className="text-left">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        Privacy Settings
                      </p>
                      <p className="text-sm text-neutral-500">
                        Manage your data and privacy
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassButton
              variant="danger"
              className="w-full"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-5 h-5" />}
            >
              Log Out
            </GlassButton>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <GlassCard className="border-red-200 dark:border-red-800">
              <h2 className="text-lg font-semibold text-red-600 mb-4">
                Danger Zone
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <GlassButton variant="secondary" className="text-red-600">
                Delete Account
              </GlassButton>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
