'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Globe, ChevronDown, LogOut, LayoutDashboard, CreditCard, BookOpen, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { GlassButton } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  className?: string;
}

const navigation = [
  { name: 'Mental Health Screening', href: '/start' },
  { name: 'About', href: '/about' },
];

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'ms', name: 'Bahasa Melayu', flag: 'BM' },
];

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'bg-white/70 dark:bg-neutral-900/70',
        'backdrop-blur-lg border-b border-white/20 dark:border-neutral-700/30',
        className
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              MyMental
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{currentLang}</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform', isLangMenuOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg border border-white/20 dark:border-neutral-700/30 shadow-lg overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
                          'hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors',
                          currentLang === lang.code && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Button */}
            {isLoading ? (
              <div className="w-20 h-9 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-white/20 dark:border-neutral-700/30 hover:bg-white/90 dark:hover:bg-neutral-700/90 transition-colors"
                >
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <Image
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                      alt="Profile"
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <ChevronDown
                    className={cn('w-4 h-4 text-neutral-500 transition-transform', isUserMenuOpen && 'rotate-180')}
                  />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg border border-white/20 dark:border-neutral-700/30 shadow-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/my-assessments"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          My Assessments
                        </Link>
                        <Link
                          href="/interventions"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Self-Help Courses
                        </Link>
                        <Link
                          href="/chat"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          AI Chat Support
                        </Link>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700 py-1">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Account Settings
                        </Link>
                        <Link
                          href="/billing"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          Billing
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <GlassButton variant="secondary" size="sm">
                  <User className="w-4 h-4" />
                  Login
                </GlassButton>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-white/20 dark:border-neutral-700/30 pt-4 mt-4">
                  {/* Language Options */}
                  <div className="flex gap-2 px-4 mb-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLang(lang.code)}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm',
                          currentLang === lang.code
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                        )}
                      >
                        {lang.flag}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 space-y-2">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 py-2">
                          {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                            <Image
                              src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                              alt="Profile"
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.email?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                              {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/my-assessments"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          My Assessments
                        </Link>
                        <Link
                          href="/interventions"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Self-Help Courses
                        </Link>
                        <Link
                          href="/chat"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          AI Chat Support
                        </Link>
                        <div className="border-t border-neutral-200 dark:border-neutral-700 my-2" />
                        <Link
                          href="/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Account Settings
                        </Link>
                        <Link
                          href="/billing"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          Billing
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <GlassButton variant="secondary" className="w-full">
                          <User className="w-4 h-4" />
                          Login
                        </GlassButton>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
