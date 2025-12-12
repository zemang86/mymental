/**
 * Internationalization configuration
 */

export const locales = ['en', 'ms'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ms: 'Bahasa Malaysia',
};

export const LOCALE_COOKIE_NAME = 'mymental-locale';
