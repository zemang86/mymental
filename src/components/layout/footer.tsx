'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { EMERGENCY_DISCLAIMER } from '@/lib/constants/hotlines';

interface FooterProps {
  showEmergencyBanner?: boolean;
  className?: string;
}

const footerLinks = {
  register: [
    { name: 'Online Counselling', href: '/counselling/online' },
    { name: 'Offline Counselling', href: '/counselling/offline' },
  ],
  contact: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Customer Service', href: '/support' },
    { name: 'Partnership', href: '/partnership' },
  ],
  needToKnow: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Counselling Guide', href: '/guide' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookies', href: '/cookies' },
  ],
};

export function Footer({ showEmergencyBanner = true, className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('mt-auto', className)}>
      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <div className="bg-red-50/80 dark:bg-red-900/20 border-t border-red-200/50 dark:border-red-800/30 px-4 py-3">
          <p className="text-center text-sm text-red-700 dark:text-red-400 max-w-4xl mx-auto">
            {EMERGENCY_DISCLAIMER.en}
          </p>
        </div>
      )}

      {/* Main Footer */}
      <div
        className={cn(
          'bg-white/50 dark:bg-neutral-900/50',
          'backdrop-blur-lg border-t border-white/20 dark:border-neutral-700/30'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Register */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Register
              </h3>
              <ul className="space-y-2">
                {footerLinks.register.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Contact Us
              </h3>
              <ul className="space-y-2">
                {footerLinks.contact.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need to Know */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Need to Know
              </h3>
              <ul className="space-y-2">
                {footerLinks.needToKnow.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Address */}
          <div className="mt-8 pt-8 border-t border-white/20 dark:border-neutral-700/30">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              No 6, Medan Pusat Bandar 1 Seksyen 9, 43650 Bangi Selangor
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {currentYear} MyMental
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <Link href="/terms" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-primary-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
