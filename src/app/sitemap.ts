// app/sitemap.ts — Dynamic sitemap generated from place data.

import { MetadataRoute } from 'next';
import { getAllPlaceSlugs } from '@/lib/places';

const BASE_URL = 'https://cyprus-discovery.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const placeSlugs = getAllPlaceSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/places`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/museums`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/castles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/beaches`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/historical-places`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const placePages: MetadataRoute.Sitemap = placeSlugs.map((slug) => ({
    url: `${BASE_URL}/places/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...placePages];
}
