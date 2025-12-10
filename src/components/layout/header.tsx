'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { GlassButton } from '@/components/ui';

interface HeaderProps {
  className?: string;
}

const navigation = [
  { name: 'Mental Health Screening', href: '/start' },
  { name: 'About', href: '/about' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
];

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

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

            {/* Login Button */}
            <GlassButton variant="secondary" size="sm">
              <User className="w-4 h-4" />
              Login
            </GlassButton>
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
                        {lang.flag} {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="px-4">
                    <GlassButton variant="secondary" className="w-full">
                      <User className="w-4 h-4" />
                      Login
                    </GlassButton>
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
