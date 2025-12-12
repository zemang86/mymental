'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  User,
  Mail,
  Lock,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
  Save,
  Loader2,
  CreditCard,
  Calendar,
  Heart,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { setLocale } from '@/i18n/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  gender: 'male' | 'female' | 'other' | null;
  age: number | null;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null;
  occupation: string | null;
  education: string | null;
  language: 'en' | 'ms';
}

const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other / Prefer not to say' },
];

const MARITAL_STATUS_OPTIONS = [
  { value: '', label: 'Select status' },
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

const EDUCATION_OPTIONS = [
  { value: '', label: 'Select education level' },
  { value: 'secondary', label: 'Secondary School (SPM)' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'other', label: 'Other' },
];

export default function AccountPage() {
  const router = useRouter();
  const t = useTranslations('account');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    age: '',
    marital_status: '',
    occupation: '',
    education: '',
    language: 'en',
  });

  // Password form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/account');
        return;
      }
      setUser(user);

      // Load profile from profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
      } else if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          gender: profileData.gender || '',
          age: profileData.age?.toString() || '',
          marital_status: profileData.marital_status || '',
          occupation: profileData.occupation || '',
          education: profileData.education || '',
          language: profileData.language || 'en',
        });
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const supabase = createClient();

      // Update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          gender: formData.gender || null,
          age: formData.age ? parseInt(formData.age) : null,
          marital_status: formData.marital_status || null,
          occupation: formData.occupation || null,
          education: formData.education || null,
          language: formData.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        setSaveMessage({ type: 'error', text: 'Failed to save changes' });
      } else {
        setIsEditing(false);
        setSaveMessage({ type: 'success', text: 'Profile updated successfully' });
        // Update local profile state
        setProfile((prev) => prev ? {
          ...prev,
          full_name: formData.full_name || null,
          gender: (formData.gender as Profile['gender']) || null,
          age: formData.age ? parseInt(formData.age) : null,
          marital_status: (formData.marital_status as Profile['marital_status']) || null,
          occupation: formData.occupation || null,
          education: formData.education || null,
          language: formData.language as 'en' | 'ms',
        } : null);
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setSaveMessage({ type: 'error', text: 'Something went wrong' });
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
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      }
    } catch {
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

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              {t('title')}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}

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
                  {t('profile')}
                </h2>
                {!isEditing && (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    {tCommon('edit')}
                  </GlassButton>
                )}
              </div>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {formData.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {formData.full_name || 'User'}
                    </p>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <User className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {t('fullName')}
                  </label>
                  {isEditing ? (
                    <GlassInput
                      value={formData.full_name}
                      onChange={(e) => updateFormField('full_name', e.target.value)}
                      placeholder={t('fullName')}
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white py-2 pl-6">
                      {formData.full_name || tCommon('notSet')}
                    </p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {tAuth('email')}
                  </label>
                  <p className="text-neutral-900 dark:text-white py-2 pl-6">
                    {user?.email || tCommon('notSet')}
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <Users className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {t('gender')}
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => updateFormField('gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {GENDER_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-neutral-900 dark:text-white py-2 pl-6">
                      {GENDER_OPTIONS.find(o => o.value === formData.gender)?.label || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <Calendar className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {t('age')}
                  </label>
                  {isEditing ? (
                    <GlassInput
                      type="number"
                      min="13"
                      max="120"
                      value={formData.age}
                      onChange={(e) => updateFormField('age', e.target.value)}
                      placeholder={t('age')}
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white py-2 pl-6">
                      {formData.age || tCommon('notSet')}
                    </p>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <Heart className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {t('maritalStatus')}
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.marital_status}
                      onChange={(e) => updateFormField('marital_status', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {MARITAL_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-neutral-900 dark:text-white py-2 pl-6">
                      {MARITAL_STATUS_OPTIONS.find(o => o.value === formData.marital_status)?.label || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <Briefcase className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {t('occupation')}
                  </label>
                  {isEditing ? (
                    <GlassInput
                      value={formData.occupation}
                      onChange={(e) => updateFormField('occupation', e.target.value)}
                      placeholder={t('occupation')}
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white py-2 pl-6">
                      {formData.occupation || tCommon('notSet')}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    <GraduationCap className="w-4 h-4 inline mr-2 text-neutral-400" />
                    {t('education')}
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.education}
                      onChange={(e) => updateFormField('education', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {EDUCATION_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-neutral-900 dark:text-white py-2 pl-6">
                      {EDUCATION_OPTIONS.find(o => o.value === formData.education)?.label || 'Not set'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <GlassButton
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to current profile
                        if (profile) {
                          setFormData({
                            full_name: profile.full_name || '',
                            gender: profile.gender || '',
                            age: profile.age?.toString() || '',
                            marital_status: profile.marital_status || '',
                            occupation: profile.occupation || '',
                            education: profile.education || '',
                            language: profile.language || 'en',
                          });
                        }
                      }}
                    >
                      {tCommon('cancel')}
                    </GlassButton>
                    <GlassButton
                      variant="primary"
                      onClick={handleSave}
                      loading={isSaving}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      {tCommon('save')}
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
                {t('preferences')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {t('language')}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {t('languageDescription')}
                    </p>
                  </div>
                  <select
                    value={formData.language}
                    onChange={async (e) => {
                      const newLang = e.target.value;
                      updateFormField('language', newLang);
                      // Save language preference to profile
                      if (user) {
                        const supabase = createClient();
                        await supabase
                          .from('profiles')
                          .update({ language: newLang, updated_at: new Date().toISOString() })
                          .eq('id', user.id);
                      }
                      // Set locale cookie and reload to apply new language
                      setLocale(newLang);
                    }}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
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
                {t('security')}
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
                        {t('changePassword')}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {t('changePasswordDescription')}
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
                        {t('billing')}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {t('billingDescription')}
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
              {tAuth('logout')}
            </GlassButton>
          </motion.div>

          {/* Danger Zone - Hidden for now, will be implemented in future */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <GlassCard className="border-red-200 dark:border-red-800">
              <h2 className="text-lg font-semibold text-red-600 mb-4">
                {t('dangerZone')}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {t('deleteAccountWarning')}
              </p>
              <GlassButton
                variant="secondary"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDeleteAccount}
              >
                {t('deleteAccount')}
              </GlassButton>
            </GlassCard>
          </motion.div> */}
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
                {t('changePassword')}
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
                  label={tAuth('password')}
                  placeholder={tAuth('password')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <GlassInput
                  type="password"
                  label={tAuth('confirmPassword')}
                  placeholder={tAuth('confirmPassword')}
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
                    {tCommon('cancel')}
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    className="flex-1"
                    onClick={handlePasswordChange}
                  >
                    {t('changePassword')}
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
