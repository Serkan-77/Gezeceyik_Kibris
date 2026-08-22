// lib/places.ts
// Data access layer for the places data.
// All reads go through these helper functions.
// To migrate to Supabase later, replace this file's implementation —
// the rest of the codebase remains unchanged.

import { places } from '@/data/places';
import { Category, Place, Region } from '@/types/place';

/** Return all places. */
export function getAllPlaces(): Place[] {
  return places;
}

/** Return a single place by slug, or undefined if not found. */
export function getPlaceBySlug(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}

/** Return all places in a given category. */
export function getPlacesByCategory(category: Category): Place[] {
  return places.filter((p) => p.category === category);
}

/** Return all places in a given region. */
export function getPlacesByRegion(region: Region): Place[] {
  return places.filter((p) => p.region === region);
}

/** Return all featured places. */
export function getFeaturedPlaces(): Place[] {
  return places.filter((p) => p.featured);
}

/** Return places that match a set of filter criteria. */
export interface PlaceFilters {
  region?: Region;
  category?: Category;
  isFree?: boolean;
  query?: string; // simple name search
}

export function filterPlaces(filters: PlaceFilters): Place[] {
  return places.filter((p) => {
    if (filters.region && p.region !== filters.region) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.isFree !== undefined) {
      const free = p.admission?.isFree ?? true; // no admission info → treat as free
      if (filters.isFree !== free) return false;
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.city.toLowerCase().includes(q) &&
        !p.shortDescription.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

/** Return all unique slugs — used by generateStaticParams. */
export function getAllPlaceSlugs(): string[] {
  return places.map((p) => p.slug);
}

/** Return nearby places for a given place. */
export function getNearbyPlaces(place: Place): Place[] {
  if (!place.nearbyPlaceSlugs?.length) return [];
  return place.nearbyPlaceSlugs
    .map((slug) => getPlaceBySlug(slug))
    .filter((p): p is Place => p !== undefined);
}

/** Return all distinct categories present in the data. */
export function getAllCategories(): Category[] {
  return [...new Set(places.map((p) => p.category))].sort();
}

/** Return all distinct regions present in the data. */
export function getAllRegions(): Region[] {
  return [...new Set(places.map((p) => p.region))].sort();
}

/** Format admission for display. Returns e.g. "€5 / €2.50" or "Free". */
export function formatAdmission(place: Place): string {
  const a = place.admission;
  if (!a || a.isFree) return 'Free';
  const adult = a.adultPrice !== undefined ? `€${a.adultPrice}` : '';
  const child = a.childPrice !== undefined ? `€${a.childPrice}` : '';
  if (adult && child) return `${adult} / ${child} child`;
  if (adult) return adult;
  return 'Paid entry';
}

/** Format a day's opening hours for display. */
export function formatDay(value: string | null | undefined): string {
  if (value === null) return 'Closed';
  if (!value) return 'Hours not available';
  return value;
}
