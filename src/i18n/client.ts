/**
 * Client-side i18n utilities
 */

'use client';

import { useTranslations as useNextIntlTranslations } from 'next-intl';

export { useNextIntlTranslations as useTranslations };

export function useLocale(): string {
  // This will be provided by NextIntlClientProvider
  // For now, we can access it from the cookie on client side
  if (typeof window === 'undefined') return 'en';

  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('mymental-locale='));

  return cookie?.split('=')[1] || 'en';
}

export async function setLocale(locale: string): Promise<void> {
  // Set cookie with 1 year expiry
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `mymental-locale=${locale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

  // Reload to apply new locale
  window.location.reload();
}
