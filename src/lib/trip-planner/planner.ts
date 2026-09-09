// lib/trip-planner/planner.ts
// Main planner entry-point.
// Selects, clusters, schedules, and returns a full TripItinerary.
//
// Takes the candidate place list as a parameter rather than reading it
// itself: this runs inside PlannerWizardClient, a Client Component, and
// lib/places.ts is now a server-only Supabase-backed module that a client
// bundle can't import. The server page (app/gezi-planla/page.tsx) fetches
// places once and passes them down.

import { Place, Region } from '@/types/place';
import { BusRoute } from '@/types/transit';
import { AccommodationLocation, PlannerInput, TransportMode, TripItinerary, ItineraryDay } from './types';
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
 * A new stop is never scheduled to arrive after this hour — a candidate
 * that would only be reachable this late (a long cross-region hop eating
 * the whole afternoon, an evening-only bus, etc.) is left for a later day
 * instead, rather than producing a "23:41 — Büyük Han" itinerary. A day is
 * always allowed at least one stop even if it runs past this, so a distant
 * region never produces a silently empty day.
 */
const DAY_END_HOUR = 19;

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Sort a list of places into a nearest-neighbour route starting from a
 * given point (the accommodation, or wherever the previous cluster ended).
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
 * Groups selected places by region and orders the regions by distance from
 * the accommodation — nearest first, farthest last (a car-owner naturally
 * wants to explore close by before committing to a long drive, and a
 * public-transport visitor wants to minimise cross-region bus hops). Within
 * each region, places are then nearest-neighbour sorted from the
 * accommodation so the day's route inside that region is still sensible.
 */
function clusterByRegionNearestFirst(selected: Place[], accommodation: AccommodationLocation): Place[] {
  const regions = [...new Set(selected.map((p) => p.region))];

  const nearestKmInRegion = (region: Region): number => {
    const inRegion = selected.filter((p) => p.region === region && p.latitude && p.longitude);
    if (inRegion.length === 0) return Infinity;
    return Math.min(
      ...inRegion.map((p) =>
        haversineKm({ lat: accommodation.lat, lng: accommodation.lng }, { lat: p.latitude, lng: p.longitude })
      )
    );
  };

  const orderedRegions = regions.sort((a, b) => nearestKmInRegion(a) - nearestKmInRegion(b));

  return orderedRegions.flatMap((region) =>
    nearestNeighbourSort(
      selected.filter((p) => p.region === region),
      accommodation.lat,
      accommodation.lng
    )
  );
}

/**
 * Chunks a region-clustered, nearest-neighbour-ordered place list into up to
 * `maxDays` real, scheduled days — actually re-scheduling (via scheduleDay)
 * after each tentative addition so the decision to close a day is based on
 * what the day would really look like, not just a place count. A day closes
 * early — even under `ppd` places — the moment either:
 *   - a THIRD distinct region would enter it (never more than one
 *     cross-region hop per day: "finish Mağusa this morning, bus to Girne
 *     this afternoon" is fine, a same-day Mağusa → Girne → Lefkoşa chain
 *     is not), or
 *   - the next candidate would only be reachable after DAY_END_HOUR (a long
 *     hop eating the whole afternoon, or only an evening bus available).
 * A day is always given at least one stop so a distant, bus-poor region
 * never produces a silently empty day; any place that still doesn't fit by
 * the last available day is simply left unscheduled rather than crammed in.
 */
function buildDaySchedules(
  ordered: Place[],
  ppd: number,
  maxDays: number,
  transport: TransportMode,
  accommodation: AccommodationLocation,
  transitRoutes: BusRoute[]
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const remaining = [...ordered];
  let dayNumber = 1;

  while (remaining.length > 0 && dayNumber <= maxDays) {
    const dayPlaces: Place[] = [];
    let dayRegions: Region[] = [];

    while (dayPlaces.length < ppd && remaining.length > 0) {
      const candidate = remaining[0];
      const isNewRegion = !dayRegions.includes(candidate.region);
      if (isNewRegion && dayRegions.length >= 2) break; // would be this day's 3rd region

      const trial = scheduleDay([...dayPlaces, candidate], dayNumber, transport, accommodation, transitRoutes);
      const trialArrivalMin = timeToMinutes(trial.stops[trial.stops.length - 1].arrivalTime);

      if (dayPlaces.length > 0 && trialArrivalMin > DAY_END_HOUR * 60) break;

      dayPlaces.push(candidate);
      dayRegions = trial.regions;
      remaining.shift();
    }

    if (dayPlaces.length === 0) break; // shouldn't happen (a day always accepts its first candidate), but never loop forever

    days.push(scheduleDay(dayPlaces, dayNumber, transport, accommodation, transitRoutes));
    dayNumber++;
  }

  return days;
}

/**
 * Generate a deterministic trip itinerary from PlannerInput and the pool of
 * candidate places to schedule from.
 */
export function generateItinerary(
  input: PlannerInput,
  allPlaces: Place[],
  transitRoutes: BusRoute[] = []
): TripItinerary {
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

  // 3. Cluster by region (nearest region first), nearest-neighbour within each
  const ordered = clusterByRegionNearestFirst(selected, input.accommodation);

  // 4. Chunk into real, schedule-aware days — at most one cross-region hop
  // per day, and never a stop scheduled past DAY_END_HOUR
  const days = buildDaySchedules(ordered, ppd, input.days, input.transport, input.accommodation, transitRoutes);

  let totalCost = 0;
  let totalKm = 0;
  let totalDurationMin = 0;
  let totalPlaces = 0;

  for (const itDay of days) {
    totalCost += itDay.totalCost;
    totalKm += itDay.totalKm;
    totalDurationMin += itDay.totalVisitMin + itDay.totalTravelMin;
    totalPlaces += itDay.stops.length;
  }

  return {
    days,
    totalPlaces,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalKm: parseFloat(totalKm.toFixed(1)),
    totalDurationMin,
    input,
    generatedAt: new Date().toISOString(),
  };
}
