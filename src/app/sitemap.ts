// app/sitemap.ts — Dynamic sitemap generated from place data.

import { MetadataRoute } from 'next';
import { getAllPlaceSlugs } from '@/lib/places';
import { SITE_URL as BASE_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Same reasoning as generateStaticParams in places/[slug]/page.tsx: an
  // unreachable database shouldn't take down sitemap generation (and with
  // it, the build) entirely — a sitemap missing place URLs is a degraded
  // but real result, not a silent lie the way serving fake place content
  // would be.
  let placeSlugs: string[] = [];
  try {
    placeSlugs = await getAllPlaceSlugs();
  } catch (err) {
    console.warn(
      '[sitemap] Could not list place slugs — sitemap will include static pages only. ' +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
    );
  }

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
    {
      url: `${BASE_URL}/harita`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/gezi-planla`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
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
