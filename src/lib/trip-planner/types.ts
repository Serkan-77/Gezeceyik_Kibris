// lib/trip-planner/types.ts
// All trip planner domain types — shared between engine and UI.

import { Place, Category, Region } from '@/types/place';
import { LatLng } from './distance';

// ── Planner Input ─────────────────────────────────────────────

export type TransportMode = 'car' | 'walking' | 'public';

export type Pace = 'relaxed' | 'balanced' | 'intensive';

export type AccommodationLocation = LatLng & {
  label: string;
  city: string;
};

export interface PlannerInput {
  /** Where the visitor is staying */
  accommodation: AccommodationLocation;
  /** Number of full days available */
  days: number;
  /** Primary transport mode */
  transport: TransportMode;
  /** Visitor pace */
  pace: Pace;
  /** Preferred categories — empty = no preference */
  preferredCategories: Category[];
  /** Only include free places */
  onlyFree: boolean;
  /** Manually selected places by slug */
  mustVisitSlugs: string[];
  /** Maximum daily drive distance in km */
  maxDailyKm?: number;
}

// ── Itinerary ─────────────────────────────────────────────────

export interface ItineraryStop {
  place: Place;
  /** Arrival time as HH:MM string, e.g. "09:30" */
  arrivalTime: string;
  /** Departure time as HH:MM string */
  departureTime: string;
  /** Travel time to next stop in minutes */
  travelToNextMin: number;
  /** Distance to next stop in km */
  distanceToNextKm: number;
  /** Estimated admission cost for one adult */
  admissionCost: number;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  region: Region;
  stops: ItineraryStop[];
  /** Total travel time for the day in minutes */
  totalTravelMin: number;
  /** Total visit time in minutes */
  totalVisitMin: number;
  /** Total estimated cost (admission only) */
  totalCost: number;
  /** Total km driven */
  totalKm: number;
}

export interface TripItinerary {
  days: ItineraryDay[];
  totalPlaces: number;
  totalCost: number;
  totalKm: number;
  totalDurationMin: number;
  input: PlannerInput;
  generatedAt: string;
}

