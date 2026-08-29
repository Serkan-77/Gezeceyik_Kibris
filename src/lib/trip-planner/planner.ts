// lib/trip-planner/planner.ts
// Main planner entry-point.
// Selects, clusters, schedules, and returns a full TripItinerary.
//
// Takes the candidate place list as a parameter rather than reading it
// itself: this runs inside PlannerWizardClient, a Client Component, and
// lib/places.ts is now a server-only MongoDB-backed module that a client
// bundle can't import. The server page (app/gezi-planla/page.tsx) fetches
// places once and passes them down.

import { Place, Region } from '@/types/place';
import { PlannerInput, TripItinerary, ItineraryDay } from './types';
import { scorePlaceForInput } from './scoring';
import { scheduleDay } from './scheduleDay';
import { haversineKm } from './distance';

// Pace → places per day
const PLACES_PER_DAY: Record<PlannerInput['pace'], number> = {
  relaxed: 2,
  balanced: 3,
  intensive: 4,
};

/**
 * Sort a list of places into a nearest-neighbour route starting from accommodation.
 */
function nearestNeighbourSort(
  places: Place[],
  startLat: number,
  startLng: number
): Place[] {
  const remaining = [...places];
  const sorted: Place[] = [];
  let currentLat = startLat;
  let currentLng = startLng;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDist = Infinity;

    remaining.forEach((p, i) => {
      if (!p.latitude || !p.longitude) return;
      const d = haversineKm(
        { lat: currentLat, lng: currentLng },
        { lat: p.latitude, lng: p.longitude }
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = i;
      }
    });

    const next = remaining.splice(nearestIndex, 1)[0];
    sorted.push(next);
    if (next.latitude && next.longitude) {
      currentLat = next.latitude;
      currentLng = next.longitude;
    }
  }

  return sorted;
}

/**
 * Generate a deterministic trip itinerary from PlannerInput and the pool of
 * candidate places to schedule from.
 */
export function generateItinerary(input: PlannerInput, allPlaces: Place[]): TripItinerary {
  // 1. Score and filter
  const scored = allPlaces
    .map((place) => ({ place, score: scorePlaceForInput(place, input) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const ppd = PLACES_PER_DAY[input.pace];
  const totalNeeded = input.days * ppd;

  // 2. Select top N places, always including must-visits first
  const mustVisits = scored.filter(({ place }) =>
    input.mustVisitSlugs.includes(place.slug)
  );
  const others = scored.filter(
    ({ place }) => !input.mustVisitSlugs.includes(place.slug)
  );

  const selected: Place[] = [
    ...mustVisits.map(({ place }) => place),
    ...others.map(({ place }) => place).slice(0, Math.max(0, totalNeeded - mustVisits.length)),
  ].slice(0, totalNeeded);

  // 3. Sort using nearest-neighbour from accommodation
  const sorted = nearestNeighbourSort(
    selected,
    input.accommodation.lat,
    input.accommodation.lng
  );

  // 4. Chunk into days
  const days: ItineraryDay[] = [];
  let totalCost = 0;
  let totalKm = 0;
  let totalDurationMin = 0;

  for (let day = 0; day < input.days; day++) {
    const dayPlaces = sorted.slice(day * ppd, (day + 1) * ppd);
    if (dayPlaces.length === 0) continue;

    // Determine the dominant region for the day
    const regionCounts: Partial<Record<Region, number>> = {};
    dayPlaces.forEach((p) => {
      regionCounts[p.region] = (regionCounts[p.region] ?? 0) + 1;
    });
    const dominantRegion = (Object.entries(regionCounts) as [Region, number][]).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const itDay = scheduleDay(dayPlaces, day + 1, input.transport, dominantRegion);
    days.push(itDay);

    totalCost += itDay.totalCost;
    totalKm += itDay.totalKm;
    totalDurationMin += itDay.totalVisitMin + itDay.totalTravelMin;
  }

  return {
    days,
    totalPlaces: selected.length,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalKm: parseFloat(totalKm.toFixed(1)),
    totalDurationMin,
    input,
    generatedAt: new Date().toISOString(),
  };
}
