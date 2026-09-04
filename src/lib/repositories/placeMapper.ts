// lib/repositories/placeMapper.ts
// Converts between the Supabase persistence shape (PlaceRow, in
// src/lib/db/placeSchema.ts) and the application's domain shape (Place, in
// src/types/place.ts). This is the one place that needs to know both
// shapes — every UI component only ever sees the domain `Place` type.
//
// Now that the database stores flat latitude/longitude (no GeoJSON) and a
// flat image/gallery pair (no nested `images` object), this mapping is
// close to an identity function — a deliberate simplification over the
// MongoDB version, not a shortcut: Postgres has no reason to carry
// Mongo's document-nesting conventions forward.

import { Place } from '@/types/place';
import { PlaceRow, PlaceInput } from '@/lib/db/placeSchema';

/** Converts a Supabase place row into the domain `Place` shape the UI expects. */
export function toDomainPlace(row: PlaceRow): Place {
  if (typeof row.latitude !== 'number' || typeof row.longitude !== 'number' || !row.image) {
    throw new Error(
      `Place row "${row.slug ?? row.id}" is missing required fields (latitude/longitude and/or image) — cannot map to the domain Place shape.`
    );
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    city: row.city,
    region: row.region,
    shortDescription: row.shortDescription,
    description: row.description,
    history: row.history,
    image: row.image,
    gallery: row.gallery,
    openingHours: row.openingHours,
    admission: row.admission,
    phone: row.phone,
    website: row.website,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    accessibility: row.accessibility,
    estimatedVisitMinutes: row.estimatedVisitMinutes,
    featured: row.featured,
    nearbyPlaceSlugs: row.nearbyPlaceSlugs,
    sourceUrl: row.sourceUrl,
    lastVerifiedAt: row.lastVerifiedAt,
    verificationStatus: row.verificationStatus,
  };
}

/**
 * Maps a list of rows, skipping (and warning about) any single row that
 * fails to map instead of letting one malformed record take down an
 * entire listing page.
 */
export function toDomainPlaces(rows: PlaceRow[]): Place[] {
  const results: Place[] = [];
  for (const row of rows) {
    try {
      results.push(toDomainPlace(row));
    } catch (err) {
      console.warn(
        `[placeMapper] Skipping malformed place row "${row.slug ?? row.id}": ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }
  return results;
}

/**
 * Converts a domain `Place` (the shape used by src/data/places.ts and the
 * rest of the app) into the Supabase write shape. Used by the seed script
 * to migrate the local dataset into the `places` table — the inverse of
 * toDomainPlace, field for field.
 */
export function fromDomainPlace(place: Place, options: { published: boolean }): PlaceInput {
  return {
    slug: place.slug,
    name: place.name,
    shortDescription: place.shortDescription,
    description: place.description,
    history: place.history,
    category: place.category,
    region: place.region,
    city: place.city,
    address: place.address,
    latitude: place.latitude,
    longitude: place.longitude,
    image: place.image,
    gallery: place.gallery ?? [],
    openingHours: place.openingHours,
    admission: place.admission,
    phone: place.phone,
    website: place.website,
    estimatedVisitMinutes: place.estimatedVisitMinutes,
    accessibility: place.accessibility,
    nearbyPlaceSlugs: place.nearbyPlaceSlugs,
    featured: place.featured,
    published: options.published,
    archived: false,
    verificationStatus: place.verificationStatus,
    sourceUrl: place.sourceUrl,
    lastVerifiedAt: place.lastVerifiedAt,
  };
}
