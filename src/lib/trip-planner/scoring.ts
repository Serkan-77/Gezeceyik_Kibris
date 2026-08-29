// lib/trip-planner/scoring.ts
// Scores each candidate Place for a given PlannerInput.
// Higher score = more recommended.

import { Place } from '@/types/place';
import { PlannerInput, TransportMode } from './types';
import { haversineKm } from './distance';

/**
 * Hard ceiling on one-way distance from accommodation, by transport mode.
 * Below this a place is a candidate at all; above it, it's physically
 * impractical for that mode and must never be suggested — no amount of
 * category/featured/must-visit bonus should be able to override this, or a
 * "walking" trip could still recommend a place an hour's drive away.
 * `car` covers the whole island (KKTC's longest span is well under 120km),
 * so it's effectively a sanity ceiling rather than a real constraint.
 */
const MAX_REACHABLE_KM: Record<TransportMode, number> = {
  walking: 3,
  public: 80,
  car: 120,
};

/**
 * Score a single place for the given planner input.
 * Returns a number 0–100, or exactly 0 if the place is beyond what's
 * physically reachable from the accommodation for the chosen transport mode.
 */
export function scorePlaceForInput(place: Place, input: PlannerInput): number {
  if (place.latitude && place.longitude && input.accommodation) {
    const kmFromAccommodation = haversineKm(
      { lat: input.accommodation.lat, lng: input.accommodation.lng },
      { lat: place.latitude, lng: place.longitude }
    );
    if (kmFromAccommodation > MAX_REACHABLE_KM[input.transport]) {
      return 0;
    }
  }

  let score = 50; // base

  // 1. Category preference bonus
  if (input.preferredCategories.length > 0) {
    if (input.preferredCategories.includes(place.category)) {
      score += 25;
    } else {
      score -= 15;
    }
  }

  // 2. Distance from accommodation (soft preference within the reachable radius)
  if (place.latitude && place.longitude && input.accommodation) {
    const km = haversineKm(
      { lat: input.accommodation.lat, lng: input.accommodation.lng },
      { lat: place.latitude, lng: place.longitude }
    );
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
