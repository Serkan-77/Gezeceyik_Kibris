// lib/trip-planner/curatedRouteItinerary.ts
// Turns a curated route's admin-authored data (accommodation + transport +
// one ordered list of place SLUGS per day — see lib/db/curatedRouteSchema.ts)
// into a real TripItinerary, by resolving those slugs against the current
// place list and running each day through the exact same scheduleDay engine
// /gezi-planla uses. Deliberately NOT pre-computed and stored: running it at
// render time means a curated route always reflects today's place data
// (opening hours, coordinates) and today's bus timetables, never a frozen
// snapshot that silently drifts out of date.
//
// Pure and framework-free (no 'server-only', no Supabase) so it's directly
// unit-testable — lib/curatedRoutes.ts is the thin server-only wrapper that
// feeds it real data.

import { Place } from '@/types/place';
import { BusRoute } from '@/types/transit';
import { CuratedRouteRow } from '@/lib/db/curatedRouteSchema';
import { TripItinerary } from './types';
import { scheduleDay } from './scheduleDay';

export function buildCuratedItinerary(route: CuratedRouteRow, allPlaces: Place[], transitRoutes: BusRoute[]): TripItinerary {
  const bySlug = new Map(allPlaces.map((p) => [p.slug, p]));

  const dayPlaceLists = route.days
    .map((slugs, dayIndex) =>
      slugs
        .map((slug) => {
          const place = bySlug.get(slug);
          if (!place) {
            console.warn(`[curatedRouteItinerary] "${route.slug}" day ${dayIndex + 1} references unknown place slug "${slug}" — skipped.`);
          }
          return place;
        })
        .filter((p): p is Place => p !== undefined)
    )
    // A day that resolved to zero real places (all slugs unknown/stale) is dropped rather than
    // shown as an empty day — the remaining days renumber to stay a clean, gap-free sequence.
    .filter((places) => places.length > 0);

  let totalCost = 0;
  let totalKm = 0;
  let totalDurationMin = 0;
  let totalPlaces = 0;

  const days = dayPlaceLists.map((places, i) => {
    const day = scheduleDay(places, i + 1, route.transport, route.accommodation, transitRoutes);
    totalCost += day.totalCost;
    totalKm += day.totalKm;
    totalDurationMin += day.totalVisitMin + day.totalTravelMin;
    totalPlaces += day.stops.length;
    return day;
  });

  return {
    days,
    totalPlaces,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalKm: parseFloat(totalKm.toFixed(1)),
    totalDurationMin,
    input: {
      accommodation: route.accommodation,
      days: days.length,
      transport: route.transport,
      pace: 'balanced',
      preferredCategories: [],
      onlyFree: false,
      mustVisitSlugs: [],
    },
    generatedAt: new Date().toISOString(),
  };
}
