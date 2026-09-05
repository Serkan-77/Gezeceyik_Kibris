// app/sitemap.ts — Dynamic sitemap generated from place data.
//
// Only genuinely public, indexable URLs belong here — see app/robots.ts
// and each page's own `robots` metadata for the personal/system routes
// (/rotam, /rotam/[id], /favoriler, /gezilerim, /admin, /api) that are
// deliberately excluded.
//
// `lastModified` is only ever set where it reflects something real:
// place pages use the place row's actual `updatedAt` from Supabase.
// Static pages have no equivalent per-page "last changed" fact recorded
// anywhere in the app, so they omit `lastModified` entirely rather than
// stamping a fabricated "today" on every build — a wrong date is worse
// than no date.

import { MetadataRoute } from 'next';
import { getAllPlaceSlugsWithUpdatedAt } from '@/lib/places';
import { SITE_URL as BASE_URL } from '@/lib/config';

interface StaticPageEntry {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}

const STATIC_PAGES: StaticPageEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/places', changeFrequency: 'daily', priority: 0.9 },
  { path: '/museums', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/castles', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/beaches', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/historical-places', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/harita', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/gezi-planla', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/hakkimizda', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/sss', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/veri-kaynaklari', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/iletisim', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/gizlilik', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Same reasoning as generateStaticParams in places/[slug]/page.tsx: an
  // unreachable database shouldn't take down sitemap generation (and with
  // it, the build) entirely — a sitemap missing place URLs is a degraded
  // but real result, not a silent lie the way serving fake place content
  // would be.
  let placeEntries: { slug: string; updatedAt: string }[] = [];
  try {
    placeEntries = await getAllPlaceSlugsWithUpdatedAt();
  } catch (err) {
    console.warn(
      '[sitemap] Could not list place slugs — sitemap will include static pages only. ' +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  const placePages: MetadataRoute.Sitemap = placeEntries.map(({ slug, updatedAt }) => ({
    url: `${BASE_URL}/places/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...placePages];
}
