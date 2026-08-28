// lib/places.ts
// Data access layer for the Cyprus Discovery platform.
// All reads go through these helpers — migrate to Supabase by replacing this file.

import { places } from '@/data/places';
import { Category, Place, Region } from '@/types/place';

// ─── Core queries ─────────────────────────────────────────────

export function getAllPlaces(): Place[] {
  return places;
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}

export function getPlacesByCategory(category: Category): Place[] {
  return places.filter((p) => p.category === category);
}

export function getFeaturedPlaces(): Place[] {
  return places.filter((p) => p.featured);
}

export function getAllPlaceSlugs(): string[] {
  return places.map((p) => p.slug);
}

export function getAllCategories(): Category[] {
  return [...new Set(places.map((p) => p.category))].sort();
}

export function getAllRegions(): Region[] {
  return [...new Set(places.map((p) => p.region))].sort();
}

// ─── Nearby ──────────────────────────────────────────────────

/** Return nearby places by nearbyPlaceSlugs list. */
export function getNearbyPlaces(place: Place): Place[] {
  if (!place.nearbyPlaceSlugs?.length) return [];
  return place.nearbyPlaceSlugs
    .map((slug) => getPlaceBySlug(slug))
    .filter((p): p is Place => p !== undefined);
}

// ─── Display helpers ──────────────────────────────────────────

/** Format distance in metres for Turkish display. */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Get place count per region. */
export function getPlaceCountByRegion(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of places) {
    counts[p.region] = (counts[p.region] ?? 0) + 1;
  }
  return counts;
}
