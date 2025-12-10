'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Loader2,
  CreditCard,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login?redirect=/account');
        return;
      }
      setUser(user);
      setName(user.user_metadata?.full_name || '');
      setIsLoading(false);
    });
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          language,
          notifications,
        },
      });

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      }
    } catch (err) {
      setPasswordError('Failed to update password');
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    // In production, this would call a server action to delete the user
    alert('Account deletion request submitted. You will be contacted via email.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </main>
        <Footer />
      </div>
    );
  }

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
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {name || 'User'}
                    </p>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                </div>

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
                    <p className="text-neutral-900 dark:text-white py-2">
                      {name || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <p className="text-neutral-900 dark:text-white flex items-center gap-2 py-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    {user?.email || 'Not set'}
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
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
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

                <button
                  onClick={() => router.push('/billing')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-neutral-500" />
                    <div className="text-left">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        Billing & Subscription
                      </p>
                      <p className="text-sm text-neutral-500">
                        Manage your subscription plan
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
              variant="secondary"
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
              <GlassButton
                variant="secondary"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </GlassButton>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard variant="elevated">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                Change Password
              </h3>

              <div className="space-y-4">
                {passwordError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <GlassInput
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <GlassInput
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="flex gap-3 pt-4">
                  <GlassButton
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancel
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    className="flex-1"
                    onClick={handlePasswordChange}
                  >
                    Update Password
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
