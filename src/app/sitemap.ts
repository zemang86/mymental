import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mymental-vert.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/start`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/interventions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Assessment types
  const assessmentTypes = [
    'depression',
    'anxiety',
    'ptsd',
    'ocd',
    'insomnia',
    'suicidal',
    'psychosis',
    'sexual-addiction',
    'marital-distress',
  ];

  const assessmentRoutes = assessmentTypes.map((type) => ({
    url: `${siteUrl}/test/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...assessmentRoutes];
}
