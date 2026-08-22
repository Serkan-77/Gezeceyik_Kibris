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

export function getPlacesByRegion(region: Region): Place[] {
  return places.filter((p) => p.region === region);
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

// ─── Filter ──────────────────────────────────────────────────

export interface PlaceFilterOptions {
  region?: Region;
  category?: Category;
  isFree?: boolean;
  query?: string;
}

export function filterPlaces(filters: PlaceFilterOptions): Place[] {
  return places.filter((p) => {
    if (filters.region && p.region !== filters.region) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.isFree !== undefined) {
      const free = p.admission?.isFree ?? true;
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

// ─── Nearby ──────────────────────────────────────────────────

/** Return nearby places by nearbyPlaceSlugs list. */
export function getNearbyPlaces(place: Place): Place[] {
  if (!place.nearbyPlaceSlugs?.length) return [];
  return place.nearbyPlaceSlugs
    .map((slug) => getPlaceBySlug(slug))
    .filter((p): p is Place => p !== undefined);
}

/**
 * Haversine distance in metres between two WGS-84 coordinates.
 */
export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface PlaceWithDistance extends Place {
  distanceMeters: number;
}

/**
 * Return all places sorted by distance from the given coordinates.
 */
export function getPlacesNearCoordinates(
  lat: number,
  lon: number,
  limitKm?: number
): PlaceWithDistance[] {
  return places
    .map((p) => ({
      ...p,
      distanceMeters: haversineMeters(lat, lon, p.latitude, p.longitude),
    }))
    .filter((p) => (limitKm ? p.distanceMeters <= limitKm * 1000 : true))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

// ─── Display helpers ──────────────────────────────────────────

/** Format admission for Turkish display. */
export function formatAdmission(place: Place): string {
  const a = place.admission;
  if (!a) return 'Bilinmiyor';
  if (a.isFree) return 'Ücretsiz';
  const currency = a.currency ?? 'TRY';
  const adult =
    a.adultPrice !== undefined ? `${a.adultPrice.toLocaleString('tr-TR')} ${currency}` : '';
  const child =
    a.childPrice !== undefined ? `${a.childPrice.toLocaleString('tr-TR')} ${currency}` : '';
  if (adult && child) return `${adult} / ${child} (çocuk)`;
  if (adult) return adult;
  return 'Ücretli';
}

/** Format a day's opening hours for display (Turkish). */
export function formatDay(value: string | null | undefined): string {
  if (value === null) return 'Kapalı';
  if (!value) return 'Bilinmiyor';
  return value;
}

/** Get today's opening hours for a place. Returns null if closed, undefined if unknown. */
export function getTodayHours(
  place: Place
): string | null | undefined {
  if (!place.openingHours) return undefined;
  const dayKeys: (keyof NonNullable<Place['openingHours']>)[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ];
  const todayKey = dayKeys[new Date().getDay()];
  return place.openingHours[todayKey];
}

/** Returns whether a place is currently open. Returns undefined if opening hours unknown. */
export function isOpenNow(place: Place): boolean | undefined {
  const todayHours = getTodayHours(place);
  if (todayHours === undefined) return undefined;
  if (todayHours === null) return false;
  const [open, close] = todayHours.split('\u2013').map((t) => t.trim());
  if (!open || !close) return undefined;
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  return currentMins >= oh * 60 + om && currentMins <= ch * 60 + cm;
}

/** Format distance in metres for Turkish display. */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Format visit duration in minutes for Turkish display. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} sa ${m} dk` : `${h} sa`;
}

/** Get place count per region. */
export function getPlaceCountByRegion(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of places) {
    counts[p.region] = (counts[p.region] ?? 0) + 1;
  }
  return counts;
}

/** Get place count per category. */
export function getPlaceCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of places) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}
