import 'server-only';
// lib/curatedRoutes.ts
// Data-access seam for editorial "hazır rota" itineraries (see
// supabase/schema.sql's curatedRoutes table) — the curated-route equivalent
// of lib/places.ts / lib/transitRoutes.ts. Every page/component reads
// curated routes through this, never directly from the repository.
//
// A curated route's `days` are just place slugs (admin-authored, fixed);
// the actual schedule (times, bus legs) is computed fresh on every call via
// buildCuratedItinerary, from whatever getAllPlaces()/getActiveTransitRoutes()
// return right now — see curatedRouteItinerary.ts for why that's deliberate.

import { getAllPlaces } from '@/lib/places';
import { getActiveTransitRoutes } from '@/lib/transitRoutes';
import * as curatedRouteRepository from '@/lib/repositories/curatedRouteRepository';
import { CuratedRouteRow } from '@/lib/db/curatedRouteSchema';
import { buildCuratedItinerary } from '@/lib/trip-planner/curatedRouteItinerary';
import { Place } from '@/types/place';
import { BusRoute } from '@/types/transit';
import { TripItinerary } from '@/lib/trip-planner/types';

export interface CuratedTrip {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Admin-set cover image, falling back to the first real stop's photo — never a placeholder. */
  coverImage: string | null;
  itinerary: TripItinerary;
}

function toCuratedTrip(row: CuratedRouteRow, allPlaces: Place[], transitRoutes: BusRoute[]): CuratedTrip {
  const itinerary = buildCuratedItinerary(row, allPlaces, transitRoutes);
  const firstStopImage = itinerary.days[0]?.stops[0]?.place.image;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    coverImage: row.coverImage || firstStopImage || null,
    itinerary,
  };
}

/**
 * Every published curated route, ordered for display. A route whose slugs
 * all failed to resolve (nothing left to show) is dropped rather than
 * rendered empty.
 *
 * Unlike lib/places.ts/lib/transitRoutes.ts, this never propagates a
 * Supabase read failure even in production: curated routes are optional,
 * supplementary homepage content with no local-data fallback of their own
 * (see CuratedRoutesBand, which already renders nothing for an empty
 * list) — the `curatedRoutes` table not existing yet (e.g. the migration
 * in supabase/schema.sql hasn't been run against this project) must never
 * take the whole homepage down.
 */
export async function getPublishedCuratedTrips(): Promise<CuratedTrip[]> {
  try {
    const [rows, places, transitRoutes] = await Promise.all([
      curatedRouteRepository.findPublished(),
      getAllPlaces(),
      getActiveTransitRoutes(),
    ]);
    return rows.map((row) => toCuratedTrip(row, places, transitRoutes)).filter((trip) => trip.itinerary.days.length > 0);
  } catch (err) {
    console.warn('[lib/curatedRoutes] getPublishedCuratedTrips failed — showing none.', err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getPublishedCuratedTripBySlug(slug: string): Promise<CuratedTrip | null> {
  try {
    const row = await curatedRouteRepository.findBySlugPublished(slug);
    if (!row) return null;

    const [places, transitRoutes] = await Promise.all([getAllPlaces(), getActiveTransitRoutes()]);
    const trip = toCuratedTrip(row, places, transitRoutes);
    return trip.itinerary.days.length > 0 ? trip : null;
  } catch (err) {
    console.warn(
      `[lib/curatedRoutes] getPublishedCuratedTripBySlug(${slug}) failed.`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
