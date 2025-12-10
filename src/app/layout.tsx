import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { GradientBackground } from '@/components/layout';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'MyMental - Mental Health Screening Platform',
    template: '%s | MyMental',
  },
  description:
    'MyMental is a mental health screening platform that helps you understand your mental well-being through validated assessments and personalized insights.',
  keywords: [
    'mental health',
    'mental health screening',
    'depression test',
    'anxiety test',
    'mental wellness',
    'Malaysia mental health',
    'saringan kesihatan mental',
  ],
  authors: [{ name: 'MyMental' }],
  openGraph: {
    title: 'MyMental - Mental Health Screening Platform',
    description:
      'Understand your mental well-being through validated assessments and personalized insights.',
    url: 'https://mymental.my',
    siteName: 'MyMental',
    locale: 'en_MY',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <GradientBackground />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'glass rounded-xl',
          }}
        />
      </body>
    </html>
  );
}
