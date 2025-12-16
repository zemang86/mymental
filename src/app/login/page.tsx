'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/my-assessments';
  const { setUser } = useAssessmentStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Set user in store
        setUser(data.user.id, data.user.email || email);

        // Redirect to requested page or default to my-assessments
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to connect with Google');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard variant="elevated">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Sign in to access your assessments
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                <GlassInput
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-5 h-5" />}
                />

                <div className="relative">
                  <GlassInput
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-5 h-5" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-300 text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sage-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <GlassButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={isLoading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Sign In
                </GlassButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-neutral-900 text-neutral-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GlassButton
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </GlassButton>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-sage-600 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Loading fallback for the form
function LoginFormSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-md px-4">
          <div className="border bg-white/70 dark:bg-neutral-900/70 border-white/20 dark:border-neutral-700/30 backdrop-blur-lg p-6 rounded-2xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mx-auto" />
              <div className="space-y-4 mt-8">
                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
