import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { GradientBackground } from '@/components/layout';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { FloatingThemeToggle } from '@/components/layout/floating-theme-toggle';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mymental-vert.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MyMental - Mental Health Screening Platform',
    template: '%s | MyMental',
  },
  description:
    'MyMental is a mental health screening platform that helps you understand your mental well-being through validated assessments and personalized insights. Take free depression, anxiety, and other mental health tests.',
  keywords: [
    'mental health',
    'mental health screening',
    'depression test',
    'anxiety test',
    'mental wellness',
    'Malaysia mental health',
    'saringan kesihatan mental',
    'PHQ-9',
    'GAD-7',
    'PTSD screening',
    'insomnia test',
    'OCD test',
    'ujian kesihatan mental',
    'ujian kemurungan',
    'ujian kebimbangan',
  ],
  authors: [{ name: 'MyMental' }],
  creator: 'MyMental',
  publisher: 'MyMental',
  openGraph: {
    title: 'MyMental - Mental Health Screening Platform',
    description:
      'Understand your mental well-being through validated assessments and personalized insights. Free mental health screening for Malaysians.',
    url: siteUrl,
    siteName: 'MyMental',
    locale: 'en_MY',
    alternateLocale: 'ms_MY',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyMental - Mental Health Screening Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyMental - Mental Health Screening Platform',
    description:
      'Understand your mental well-being through validated assessments and personalized insights.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-MY': siteUrl,
      'ms-MY': `${siteUrl}/ms`,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <GradientBackground />
            {children}
            <FloatingThemeToggle />
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'glass rounded-xl',
              }}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
