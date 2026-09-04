// lib/trip-planner/transitSchedule.ts
// Looks up the best real inter-city bus connection between two regions for
// a given "earliest usable" time of day, out of a supplied list of routes
// (see lib/transitRoutes.ts for where that list comes from). Falls back to
// null when no route data covers that region pair, or when the day's last
// departure has already passed — callers should fall back to the generic
// haversine-based estimate in that case.

import { Region } from '@/types/place';
import { BusRoute, TransitSchedule } from '@/types/transit';

export interface TransitLeg {
  route: BusRoute;
  rideMinutes: number;
  waitMinutes: number;
  /** Undefined when the operator publishes no fixed timetable ('unpublished'). */
  departureTime?: string;
  arrivalTime?: string;
}

/** Flat buffer used when a route has no published timetable to compute a real wait from. */
const UNPUBLISHED_WAIT_BUFFER_MIN = 15;

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Next departure (in minutes from midnight) at or after `afterMinutes`, or null if none remain today. */
function nextDepartureAfter(schedule: TransitSchedule, afterMinutes: number): number | null {
  if (schedule.type === 'fixed') {
    const times = [...schedule.times].map(timeToMinutes).sort((a, b) => a - b);
    return times.find((t) => t >= afterMinutes) ?? null;
  }
  if (schedule.type === 'frequency') {
    const first = timeToMinutes(schedule.firstDeparture);
    const last = timeToMinutes(schedule.lastDeparture);
    if (afterMinutes > last) return null;
    if (afterMinutes <= first) return first;
    const slotsAhead = Math.ceil((afterMinutes - first) / schedule.intervalMinutes);
    const candidate = first + slotsAhead * schedule.intervalMinutes;
    return candidate > last ? null : candidate;
  }
  return null; // 'unpublished' — no clock times to compute from
}

/**
 * Find the best usable bus connection from `fromRegion` to `toRegion`,
 * assuming the traveler can reach the departure stop at `afterMinutes`
 * (minutes from midnight). Prefers a route with a real timed departure;
 * falls back to an 'unpublished'-schedule route (real duration/operator,
 * no fabricated clock time) only if no timed option is usable.
 */
export function findBestTransitLeg(
  routes: BusRoute[],
  fromRegion: Region,
  toRegion: Region,
  afterMinutes: number
): TransitLeg | null {
  const candidates = routes.filter(
    (r) => r.fromRegion === fromRegion && r.toRegion === toRegion
  );

  let bestTimed: TransitLeg | null = null;
  let unpublishedFallback: TransitLeg | null = null;

  for (const route of candidates) {
    if (route.schedule.type === 'unpublished') {
      if (!unpublishedFallback) {
        unpublishedFallback = {
          route,
          rideMinutes: route.durationMinutes,
          waitMinutes: UNPUBLISHED_WAIT_BUFFER_MIN,
        };
      }
      continue;
    }

    const departure = nextDepartureAfter(route.schedule, afterMinutes);
    if (departure === null) continue;

    if (!bestTimed || departure < timeToMinutes(bestTimed.departureTime!)) {
      bestTimed = {
        route,
        rideMinutes: route.durationMinutes,
        waitMinutes: departure - afterMinutes,
        departureTime: minutesToTime(departure),
        arrivalTime: minutesToTime(departure + route.durationMinutes),
      };
    }
  }

  return bestTimed ?? unpublishedFallback;
}
