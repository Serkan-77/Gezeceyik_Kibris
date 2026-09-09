// lib/trip-planner/scheduleDay.ts
// Converts an ordered list of places (already grouped for one day by the
// planner — see planner.ts) into a scheduled ItineraryDay. Times start at
// 09:00 and are computed from visit durations + travel times, UNLESS the
// day's first stop is outside the accommodation's own region: then the
// day starts from a real morning departure (see buildDayEdgeLeg) instead
// of pretending the visitor teleports there.

import { Place, Region } from '@/types/place';
import { BusRoute } from '@/types/transit';
import { AccommodationLocation, DayTransitLeg, ItineraryDay, ItineraryStop, TransitDetail, TransportMode } from './types';
import { drivingMinutes, walkingMinutes, publicTransitMinutes, haversineKm, LatLng } from './distance';
import { findBestTransitLeg } from './transitSchedule';

const START_HOUR = 9; // 09:00 — same-region days start visiting right away, as before
const DEPARTURE_READY_HOUR = 8; // 08:00 — assumed "ready to leave accommodation" time for a cross-region morning departure
const LUNCH_BREAK_MIN = 60; // 1-hour lunch at midday

/**
 * Estimated walk time to/from an inter-city bus stop, in minutes. Real
 * terminal coordinates aren't available for most stops in
 * src/data/transitRoutes.ts, so this is a flat approximation rather than a
 * haversine calculation — same spirit as the other rough transit estimates
 * in distance.ts.
 */
const WALK_TO_TERMINAL_MIN = 10;

/**
 * Format total minutes from midnight as HH:MM string.
 */
function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getTravelMinutes(
  from: LatLng,
  to: LatLng,
  transport: TransportMode
): number {
  if (transport === 'walking') return walkingMinutes(from, to);
  if (transport === 'public') return publicTransitMinutes(from, to);
  return drivingMinutes(from, to);
}

function getAdmissionCost(place: Place): number {
  if (place.admission?.isFree) return 0;
  return place.admission?.adultPrice ?? 0;
}

/**
 * Try to build a real bus-based transit hop between two regions. Returns
 * null when no route data covers that region pair (or none departs before
 * the day effectively ends), in which case the caller should fall back to
 * the generic estimate.
 */
function buildIntercityTransit(
  routes: BusRoute[],
  fromRegion: Region,
  toRegion: Region,
  readyToLeaveMin: number
): { travelMin: number; detail: TransitDetail } | null {
  const stopArrivalMin = readyToLeaveMin + WALK_TO_TERMINAL_MIN;
  const leg = findBestTransitLeg(routes, fromRegion, toRegion, stopArrivalMin);
  if (!leg) return null;

  return {
    travelMin: WALK_TO_TERMINAL_MIN + leg.waitMinutes + leg.rideMinutes + WALK_TO_TERMINAL_MIN,
    detail: {
      operator: leg.route.operator,
      fromStopName: leg.route.fromStop.name,
      toStopName: leg.route.toStop.name,
      walkToStopMin: WALK_TO_TERMINAL_MIN,
      walkFromStopMin: WALK_TO_TERMINAL_MIN,
      rideMinutes: leg.rideMinutes,
      waitMinutes: leg.waitMinutes,
      departureTime: leg.departureTime,
      arrivalTime: leg.arrivalTime,
      fareTRY: leg.route.fareTRY,
    },
  };
}

/**
 * Build a travel leg between two regions for the day's start (accommodation
 * → first stop) or end (last stop → accommodation). Prefers a real bus
 * connection when transport is 'public'; falls back to the generic
 * distance-based estimate otherwise or when no route data covers the pair.
 */
function buildEdgeLeg(
  routes: BusRoute[],
  fromRegion: Region,
  toRegion: Region,
  from: LatLng,
  to: LatLng,
  transport: TransportMode,
  readyToLeaveMin: number
): DayTransitLeg {
  const distanceKm = parseFloat(haversineKm(from, to).toFixed(1));

  if (transport === 'public') {
    const intercity = buildIntercityTransit(routes, fromRegion, toRegion, readyToLeaveMin);
    if (intercity) return { travelMin: intercity.travelMin, distanceKm, transitDetail: intercity.detail };
  }

  return { travelMin: getTravelMinutes(from, to, transport), distanceKm };
}

/**
 * Build a scheduled ItineraryDay from an ordered list of places, all
 * already selected for this one day by the planner.
 */
export function scheduleDay(
  places: Place[],
  dayNumber: number,
  transport: TransportMode,
  accommodation: AccommodationLocation,
  transitRoutes: BusRoute[] = []
): ItineraryDay {
  const stops: ItineraryStop[] = [];
  let lunchInserted = false;
  let totalTravelMin = 0;
  let totalVisitMin = 0;
  let totalKm = 0;
  let totalCost = 0;

  const accLatLng: LatLng = { lat: accommodation.lat, lng: accommodation.lng };
  const first = places[0];

  let cursor = START_HOUR * 60; // current time in minutes from midnight
  let startTravel: DayTransitLeg | undefined;

  if (first?.latitude && first?.longitude && first.region !== accommodation.region) {
    startTravel = buildEdgeLeg(
      transitRoutes,
      accommodation.region,
      first.region,
      accLatLng,
      { lat: first.latitude, lng: first.longitude },
      transport,
      DEPARTURE_READY_HOUR * 60
    );
    cursor = DEPARTURE_READY_HOUR * 60 + startTravel.travelMin;
    totalTravelMin += startTravel.travelMin;
    totalKm += startTravel.distanceKm;
  }

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const next = places[i + 1];

    // Insert a 1-hour lunch break the moment the schedule reaches midday —
    // but only when it's still genuinely midday. A long travel/transit gap
    // (e.g. a cross-region bus with a real wait) can push the cursor well
    // past 13:00 in one jump; in that case lunch was effectively already
    // covered by that gap, so don't stack another hour on top of it.
    if (!lunchInserted && cursor >= 12 * 60) {
      if (cursor < 13 * 60) cursor += LUNCH_BREAK_MIN;
      lunchInserted = true;
    }

    const arrivalTime = minutesToTime(cursor);
    const visitMin = place.estimatedVisitMinutes ?? 60;
    cursor += visitMin;
    totalVisitMin += visitMin;

    const departureTime = minutesToTime(cursor);

    let travelToNextMin = 0;
    let distanceToNextKm = 0;
    let transitDetail: TransitDetail | undefined;

    if (next?.latitude && next?.longitude && place.latitude && place.longitude) {
      const from = { lat: place.latitude, lng: place.longitude };
      const to = { lat: next.latitude, lng: next.longitude };
      distanceToNextKm = parseFloat(haversineKm(from, to).toFixed(1));

      const intercity =
        transport === 'public' && place.region !== next.region
          ? buildIntercityTransit(transitRoutes, place.region, next.region, cursor)
          : null;

      if (intercity) {
        travelToNextMin = intercity.travelMin;
        transitDetail = intercity.detail;
      } else {
        travelToNextMin = getTravelMinutes(from, to, transport);
      }
    }

    totalTravelMin += travelToNextMin;
    totalKm += distanceToNextKm;
    cursor += travelToNextMin;

    const admissionCost = getAdmissionCost(place);
    totalCost += admissionCost;

    stops.push({
      place,
      arrivalTime,
      departureTime,
      travelToNextMin,
      distanceToNextKm,
      admissionCost,
      transitDetail,
    });
  }

  const last = places[places.length - 1];
  let endTravel: DayTransitLeg | undefined;

  if (last?.latitude && last?.longitude && last.region !== accommodation.region) {
    endTravel = buildEdgeLeg(
      transitRoutes,
      last.region,
      accommodation.region,
      { lat: last.latitude, lng: last.longitude },
      accLatLng,
      transport,
      cursor
    );
    totalTravelMin += endTravel.travelMin;
    totalKm += endTravel.distanceKm;
  }

  const regions: Region[] = [];
  for (const p of places) if (!regions.includes(p.region)) regions.push(p.region);

  return {
    dayNumber,
    region: first?.region ?? accommodation.region,
    regions: regions.length > 0 ? regions : [accommodation.region],
    stops,
    startTravel,
    endTravel,
    totalTravelMin,
    totalVisitMin,
    totalCost,
    totalKm: parseFloat(totalKm.toFixed(1)),
  };
}
