'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, CheckCircle } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

function ReferralRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const professionalId = searchParams?.get('professionalId');

  const [userId, setUserId] = useState<string | null>(null);
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locale] = useState<'en' | 'ms'>('en');

  // Form state
  const [contactPreferences, setContactPreferences] = useState<string[]>(['phone']);
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(['English']);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login?redirect=/referrals/request');
        return;
      }
      setUserId(user.id);
    });
  }, [router]);

  useEffect(() => {
    if (professionalId) {
      fetchProfessional();
    } else {
      setLoading(false);
    }
  }, [professionalId]);

  const fetchProfessional = async () => {
    try {
      const response = await fetch('/api/v1/referral/professionals');
      const data = await response.json();

      if (data.success) {
        const prof = data.professionals.find((p: any) => p.id === professionalId);
        setProfessional(prof || null);
      }
    } catch (error) {
      console.error('Error fetching professional:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactPreferenceToggle = (type: string) => {
    setContactPreferences((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      router.push('/login?redirect=/referrals/request');
      return;
    }

    if (contactPreferences.length === 0) {
      alert(locale === 'ms' ? 'Sila pilih sekurang-kurangnya satu pilihan hubungan' : 'Please select at least one contact preference');
      return;
    }

    if (preferredLanguages.length === 0) {
      alert(locale === 'ms' ? 'Sila pilih sekurang-kurangnya satu bahasa' : 'Please select at least one language');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/v1/referral/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          riskLevel: 'low', // User-initiated requests default to low
          detectedConditions: [],
          referralReason: 'User-initiated referral request',
          contactPreference: contactPreferences,
          preferredLanguages,
          notes: notes || undefined,
          professionalId: professionalId || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        alert(data.error || (locale === 'ms' ? 'Gagal membuat rujukan' : 'Failed to create referral'));
      }
    } catch (error) {
      console.error('Error submitting referral:', error);
      alert(locale === 'ms' ? 'Ralat berlaku' : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full px-4"
          >
            <GlassCard>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {locale === 'ms' ? 'Rujukan Berjaya!' : 'Referral Successful!'}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {locale === 'ms'
                    ? 'Pasukan kami akan menghubungi anda dalam masa 24-48 jam.'
                    : 'Our team will contact you within 24-48 hours.'}
                </p>
                <p className="text-sm text-neutral-500">
                  {locale === 'ms' ? 'Mengalih ke papan pemuka...' : 'Redirecting to dashboard...'}
                </p>
              </div>
            </GlassCard>
          </motion.div>
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
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-sage-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {locale === 'ms' ? 'Kembali' : 'Back'}
            </button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {locale === 'ms' ? 'Minta Rujukan' : 'Request Referral'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {locale === 'ms'
                ? 'Beritahu kami pilihan anda dan kami akan menghubungkan anda dengan profesional kesihatan mental yang sesuai.'
                : 'Tell us your preferences and we will connect you with an appropriate mental health professional.'}
            </p>
          </motion.div>

          {/* Professional info (if selected) */}
          {professional && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="mb-6">
                <div className="p-6">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    {locale === 'ms' ? 'Profesional Dipilih' : 'Selected Professional'}
                  </p>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {professional.name}
                  </h3>
                  {professional.credentials && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {professional.credentials}
                    </p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <GlassCard>
                <div className="p-6 space-y-6">
                  {/* Contact Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      {locale === 'ms' ? 'Pilihan Hubungan' : 'Contact Preferences'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="space-y-2">
                      {['in_person', 'phone', 'video'].map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-sage-300 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={contactPreferences.includes(type)}
                            onChange={() => handleContactPreferenceToggle(type)}
                            className="w-4 h-4 rounded border-neutral-300 text-sage-600 focus:ring-sage-500"
                          />
                          <span className="text-neutral-900 dark:text-white">
                            {type === 'in_person' && (locale === 'ms' ? 'Secara Bersemuka' : 'In-Person')}
                            {type === 'phone' && (locale === 'ms' ? 'Telefon' : 'Phone')}
                            {type === 'video' && (locale === 'ms' ? 'Video Call' : 'Video Call')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Language Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      {locale === 'ms' ? 'Bahasa Pilihan' : 'Preferred Languages'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="space-y-2">
                      {['English', 'Malay', 'Mandarin', 'Tamil'].map((lang) => (
                        <label
                          key={lang}
                          className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-sage-300 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={preferredLanguages.includes(lang)}
                            onChange={() => handleLanguageToggle(lang)}
                            className="w-4 h-4 rounded border-neutral-300 text-sage-600 focus:ring-sage-500"
                          />
                          <span className="text-neutral-900 dark:text-white">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {locale === 'ms' ? 'Nota Tambahan (Pilihan)' : 'Additional Notes (Optional)'}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        locale === 'ms'
                          ? 'Beritahu kami jika anda mempunyai keperluan atau pilihan khusus...'
                          : 'Let us know if you have any specific requirements or preferences...'
                      }
                      className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-sage-500"
                      rows={4}
                    />
                  </div>

                  {/* Submit */}
                  <GlassButton
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={submitting || contactPreferences.length === 0 || preferredLanguages.length === 0}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {locale === 'ms' ? 'Menghantar...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {locale === 'ms' ? 'Hantar Rujukan' : 'Submit Referral'}
                      </>
                    )}
                  </GlassButton>
                </div>
              </GlassCard>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ReferralRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
      </div>
    }>
      <ReferralRequestForm />
    </Suspense>
  );
}
