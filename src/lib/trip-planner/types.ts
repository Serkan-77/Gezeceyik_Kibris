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
  /** The accommodation's region — every day's morning departure and evening return are measured from here. */
  region: Region;
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

/** Real inter-city bus leg used for the "next stop" hop, when one was found. */
export interface TransitDetail {
  operator: string;
  fromStopName: string;
  toStopName: string;
  /** Walking time to/from the bus stop on each end, in minutes. */
  walkToStopMin: number;
  walkFromStopMin: number;
  rideMinutes: number;
  waitMinutes: number;
  /** Undefined when the operator publishes no fixed timetable. */
  departureTime?: string;
  arrivalTime?: string;
  fareTRY?: number;
}

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
  /** Present only when transport is 'public' and a real bus route covers this hop. */
  transitDetail?: TransitDetail;
}

/** A single travel leg to/from the accommodation, at the start or end of a day. */
export interface DayTransitLeg {
  travelMin: number;
  distanceKm: number;
  /** Present only when transport is 'public' and a real bus route covers this leg. */
  transitDetail?: TransitDetail;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  /** The first stop's region — the day's primary region. */
  region: Region;
  /** Every distinct region visited this day, in visiting order. Length > 1 means the day crosses regions mid-day. */
  regions: Region[];
  stops: ItineraryStop[];
  /**
   * The morning leg from the accommodation to the first stop. Only
   * modelled (non-undefined) when the first stop is outside the
   * accommodation's own region — a same-region day is assumed to start
   * right at the first stop, same as before.
   */
  startTravel?: DayTransitLeg;
  /** The evening leg back to the accommodation, modelled under the same rule as startTravel. */
  endTravel?: DayTransitLeg;
  /** Total travel time for the day in minutes, including startTravel/endTravel when present */
  totalTravelMin: number;
  /** Total visit time in minutes */
  totalVisitMin: number;
  /** Total estimated cost (admission only) */
  totalCost: number;
  /** Total km driven, including startTravel/endTravel when present */
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

