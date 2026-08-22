// lib/trip-planner/distance.ts
// Haversine distance calculation between two geo-coordinates.
// Returns distance in kilometres.

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Average driving speed in KKTC — 40 km/h due to mountain roads */
const KKTC_AVG_SPEED_KMH = 40;

/** Estimate drive time in minutes between two points */
export function drivingMinutes(a: LatLng, b: LatLng): number {
  return Math.round((haversineKm(a, b) / KKTC_AVG_SPEED_KMH) * 60);
}

/** Walking speed — 4 km/h */
const WALKING_SPEED_KMH = 4;

/** Estimate walk time in minutes between two points */
export function walkingMinutes(a: LatLng, b: LatLng): number {
  return Math.round((haversineKm(a, b) / WALKING_SPEED_KMH) * 60);
}
