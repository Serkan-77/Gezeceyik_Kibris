// lib/trip-planner/scoring.ts
// Scores each candidate Place for a given PlannerInput.
// Higher score = more recommended.

import { Place } from '@/types/place';
import { PlannerInput } from './types';
import { haversineKm } from './distance';

/**
 * Score a single place for the given planner input.
 * Returns a number 0–100.
 */
export function scorePlaceForInput(place: Place, input: PlannerInput): number {
  let score = 50; // base

  // 1. Category preference bonus
  if (input.preferredCategories.length > 0) {
    if (input.preferredCategories.includes(place.category)) {
      score += 25;
    } else {
      score -= 15;
    }
  }

  // 2. Distance from accommodation
  if (place.latitude && place.longitude && input.accommodation) {
    const km = haversineKm(
      { lat: input.accommodation.lat, lng: input.accommodation.lng },
      { lat: place.latitude, lng: place.longitude }
    );
    // Penalise places far from accommodation (within reason)
    if (km < 20) score += 10;
    else if (km < 40) score += 5;
    else if (km > 80) score -= 10;
  }

  // 3. Free bonus when onlyFree
  if (input.onlyFree && !place.admission?.isFree) {
    score -= 100; // effectively exclude
  }
  if (!input.onlyFree && place.admission?.isFree) {
    score += 5;
  }

  // 4. Must-visit bonus
  if (input.mustVisitSlugs.includes(place.slug)) {
    score += 100; // guaranteed inclusion
  }

  // 5. Featured bonus
  if (place.featured) {
    score += 8;
  }

  return Math.max(0, score);
}
