'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, sessionId } = useAssessmentStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [otp, setOtp] = useState('');

  const validatePassword = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*]/.test(pwd),
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid =
    passwordValidation.minLength &&
    passwordValidation.hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // In production, this would call Supabase auth
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: { name, session_id: sessionId },
      //   },
      // });

      // Mock registration - show verification step
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('verify');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // In production, this would verify the OTP
      // const { data, error } = await supabase.auth.verifyOtp({
      //   email,
      //   token: otp,
      //   type: 'email',
      // });

      // Mock verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set user in store
      setUser('mock-user-id', email);

      // Redirect to results or dashboard
      router.push('/my-assessments');
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
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
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Check Your Email
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    We sent a verification code to{' '}
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {email}
                    </span>
                  </p>
                </div>

                <div className="space-y-6">
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
                    type="text"
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest"
                  />

                  <GlassButton
                    variant="primary"
                    className="w-full"
                    loading={isLoading}
                    onClick={handleVerifyOTP}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Verify Email
                  </GlassButton>

                  <p className="text-center text-sm text-neutral-500">
                    Didn&apos;t receive the code?{' '}
                    <button className="text-primary-600 font-medium hover:underline">
                      Resend
                    </button>
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

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
                  Create Account
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Join MyMental to track your mental well-being
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
                  type="text"
                  label="Full Name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-5 h-5" />}
                />

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
                    placeholder="Create a strong password"
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

                {/* Password requirements */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1 text-sm"
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        passwordValidation.minLength
                          ? 'text-green-600'
                          : 'text-neutral-500'
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          passwordValidation.minLength ? 'opacity-100' : 'opacity-30'
                        }`}
                      />
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordValidation.hasNumber
                          ? 'text-green-600'
                          : 'text-neutral-500'
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          passwordValidation.hasNumber ? 'opacity-100' : 'opacity-30'
                        }`}
                      />
                      Contains a number
                    </div>
                  </motion.div>
                )}

                <GlassInput
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  error={
                    confirmPassword && password !== confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-primary-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-primary-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <GlassButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={isLoading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Create Account
                </GlassButton>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-500">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary-600 font-medium hover:underline"
                >
                  Sign in
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
