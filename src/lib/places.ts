import 'server-only';
// lib/places.ts
// Data-access seam for the Cyprus Discovery platform. Every page/component
// reads place data through these functions — never directly from MongoDB
// and never directly from the local dataset.
//
// Each function tries MongoDB first (via src/lib/repositories/placeRepository.ts).
//
//   - In development, if that read fails (misconfigured/unreachable DB),
//     it falls back to the local static dataset (src/data/places.ts) and
//     logs a clear server-side warning. This keeps `npm run dev` usable
//     without a live database.
//   - In production, a failed read is NOT caught here — it propagates up
//     so the page fails visibly (Next.js's error handling) instead of
//     silently serving stale local sample data as if it were real.
//
// This file is server-only (see the `server-only` import above): it's a
// build-time error, not a broken client bundle, if a Client Component ever
// tries to import it. Client Components that need place data receive it as
// a prop from a Server Component parent instead — see PlaceCard.tsx /
// lib/format.ts for the one pure, non-data helper (formatDistance) that
// client code is allowed to import directly.

import { places as localPlaces } from '@/data/places';
import { Category, Place, Region } from '@/types/place';
import * as placeRepository from '@/lib/repositories/placeRepository';
import { toDomainPlace, toDomainPlaces } from '@/lib/repositories/placeMapper';

export { formatDistance } from '@/lib/format';

const isProduction = process.env.NODE_ENV === 'production';

function warnFallback(context: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  console.warn(
    `[lib/places] MongoDB read failed (${context}) — falling back to local sample data. ` +
      `This fallback only runs outside production. Reason: ${message}`
  );
}

/**
 * Runs a MongoDB-backed read, falling back to the equivalent local-data read
 * in development if it fails. In production, failures propagate instead of
 * silently serving local data.
 */
async function withFallback<T>(context: string, dbRead: () => Promise<T>, localRead: () => T): Promise<T> {
  try {
    return await dbRead();
  } catch (err) {
    if (isProduction) throw err;
    warnFallback(context, err);
    return localRead();
  }
}

// ─── Core queries ─────────────────────────────────────────────

export async function getAllPlaces(): Promise<Place[]> {
  return withFallback(
    'getAllPlaces',
    async () => toDomainPlaces(await placeRepository.findPublished()),
    () => localPlaces
  );
}

export async function getPlaceBySlug(slug: string): Promise<Place | undefined> {
  return withFallback(
    `getPlaceBySlug(${slug})`,
    async () => {
      const doc = await placeRepository.findBySlugPublished(slug);
      if (!doc) return undefined;
      try {
        return toDomainPlace(doc);
      } catch (err) {
        // A malformed document (missing location/images.cover) is treated the
        // same way toDomainPlaces() treats it in a listing: skipped with a
        // warning, surfaced as "not found", rather than crashing the caller —
        // generateStaticParams enumerates every published slug, so one bad
        // document must not be able to take down the whole production build.
        console.warn(
          `[lib/places] Skipping malformed place document "${slug}": ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        return undefined;
      }
    },
    () => localPlaces.find((p) => p.slug === slug)
  );
}

export async function getPlacesByCategory(category: Category): Promise<Place[]> {
  return withFallback(
    `getPlacesByCategory(${category})`,
    async () => toDomainPlaces(await placeRepository.findByCategory(category)),
    () => localPlaces.filter((p) => p.category === category)
  );
}

export async function getFeaturedPlaces(): Promise<Place[]> {
  return withFallback(
    'getFeaturedPlaces',
    async () => toDomainPlaces(await placeRepository.findFeatured()),
    () => localPlaces.filter((p) => p.featured)
  );
}

export async function getAllPlaceSlugs(): Promise<string[]> {
  return withFallback(
    'getAllPlaceSlugs',
    () => placeRepository.findAllSlugs(),
    () => localPlaces.map((p) => p.slug)
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return withFallback(
    'getAllCategories',
    () => placeRepository.findAllCategories(),
    () => [...new Set(localPlaces.map((p) => p.category))].sort()
  );
}

export async function getAllRegions(): Promise<Region[]> {
  return withFallback(
    'getAllRegions',
    () => placeRepository.findAllRegions(),
    () => [...new Set(localPlaces.map((p) => p.region))].sort()
  );
}

// ─── Nearby ──────────────────────────────────────────────────

/** Return nearby places by nearbyPlaceSlugs list. */
export async function getNearbyPlaces(place: Place): Promise<Place[]> {
  const slugs = place.nearbyPlaceSlugs;
  if (!slugs?.length) return [];

  return withFallback(
    `getNearbyPlaces(${place.slug})`,
    async () => toDomainPlaces(await placeRepository.findBySlugs(slugs)),
    () => slugs.map((slug) => localPlaces.find((p) => p.slug === slug)).filter((p): p is Place => p !== undefined)
  );
}

// ─── Display helpers ──────────────────────────────────────────

/** Get place count per region. */
export async function getPlaceCountByRegion(): Promise<Record<string, number>> {
  return withFallback(
    'getPlaceCountByRegion',
    () => placeRepository.countByRegion(),
    () => {
      const counts: Record<string, number> = {};
      for (const p of localPlaces) counts[p.region] = (counts[p.region] ?? 0) + 1;
      return counts;
    }
  );
}
