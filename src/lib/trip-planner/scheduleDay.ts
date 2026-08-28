// lib/trip-planner/scheduleDay.ts
// Converts an ordered list of places into a scheduled ItineraryDay.
// Times start at 09:00 and are computed from visit durations + travel times.

import { Place, Region } from '@/types/place';
import { ItineraryDay, ItineraryStop, TransportMode } from './types';
import { drivingMinutes, walkingMinutes, publicTransitMinutes, haversineKm, LatLng } from './distance';

const START_HOUR = 9; // 09:00
const LUNCH_BREAK_MIN = 60; // 1-hour lunch at midday

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
 * Build a scheduled ItineraryDay from an ordered list of places.
 */
export function scheduleDay(
  places: Place[],
  dayNumber: number,
  transport: TransportMode,
  region: Region
): ItineraryDay {
  const stops: ItineraryStop[] = [];
  let cursor = START_HOUR * 60; // current time in minutes from midnight
  let lunchInserted = false;
  let totalTravelMin = 0;
  let totalVisitMin = 0;
  let totalKm = 0;
  let totalCost = 0;

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const next = places[i + 1];

    // Insert lunch break around 12:00–13:00
    if (!lunchInserted && cursor >= 12 * 60) {
      cursor += LUNCH_BREAK_MIN;
      lunchInserted = true;
    }

    const arrivalTime = minutesToTime(cursor);
    const visitMin = place.estimatedVisitMinutes ?? 60;
    cursor += visitMin;
    totalVisitMin += visitMin;

    const departureTime = minutesToTime(cursor);

    let travelToNextMin = 0;
    let distanceToNextKm = 0;

    if (next?.latitude && next?.longitude && place.latitude && place.longitude) {
      const from = { lat: place.latitude, lng: place.longitude };
      const to = { lat: next.latitude, lng: next.longitude };
      travelToNextMin = getTravelMinutes(from, to, transport);
      distanceToNextKm = parseFloat(haversineKm(from, to).toFixed(1));
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
    });
  }

  return {
    dayNumber,
    region,
    stops,
    totalTravelMin,
    totalVisitMin,
    totalCost,
    totalKm: parseFloat(totalKm.toFixed(1)),
  };
}
