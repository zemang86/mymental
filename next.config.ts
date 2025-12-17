import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Google profile pictures (wildcard)
      },
      {
        protocol: 'https',
        hostname: 'mymental.online', // Partner logos
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // YouTube thumbnails
      },
    ],
  },
};

export default withNextIntl(nextConfig);
