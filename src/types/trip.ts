// types/trip.ts
// Trip Planner domain types for Cyprus Discovery.
// All UI components consume these types — the planner engine produces them.

import { Category, Region } from './place';

export type TransportMode = 'walking' | 'driving' | 'transit' | 'mixed';

export type Pace = 'relaxed' | 'normal' | 'intensive';

export type Interest =
  | 'history'
  | 'museums'
  | 'castles'
  | 'archaeology'
  | 'nature'
  | 'beaches'
  | 'monasteries'
  | 'culture'
  | 'viewpoints';

/** Interest → Category mapping used by the planner engine. */
export const INTEREST_CATEGORIES: Record<Interest, Category[]> = {
  history: ['Historical Place', 'Cultural Site'],
  museums: ['Museum'],
  castles: ['Castle'],
  archaeology: ['Archaeological Site'],
  nature: ['Natural Attraction', 'Viewpoint'],
  beaches: ['Beach'],
  monasteries: ['Monastery', 'Church'],
  culture: ['Cultural Site', 'Museum'],
  viewpoints: ['Viewpoint', 'Natural Attraction'],
};

/** Starting accommodation point for the trip. */
export interface Accommodation {
  name: string;
  region: Region;
  city: string;
  latitude: number;
  longitude: number;
}

/** Mock accommodation options shown in the wizard. */
export interface MockAccommodation {
  id: string;
  name: string;
  region: Region;
  city: string;
  latitude: number;
  longitude: number;
}

/** User inputs collected through the planner wizard. */
export interface TripInput {
  accommodation: Accommodation;
  durationDays: number;
  transportMode: TransportMode;
  interests: Interest[];
  pace: Pace;
  /** Daily start time HH:MM. Default '09:00' */
  startTime?: string;
  /** Daily end time HH:MM. Default '18:00' */
  endTime?: string;
  /** Slugs of places the user manually selected / must-visit. */
  mustVisitSlugs?: string[];
  /** Slugs of places to exclude from planning. */
  excludedSlugs?: string[];
}

// ─── Routing ────────────────────────────────────────────────────

export type SegmentMode = 'walking' | 'driving' | 'transit';

/**
 * A single transport segment between two points.
 * All geometry during mock phase is straight-line (isEstimated: true).
 */
export interface RouteSegment {
  mode: SegmentMode;
  fromLabel: string;
  toLabel: string;
  distanceMeters: number;
  durationMinutes: number;
  /** Transit fare or zero for walking/driving estimate. */
  costTRY?: number;
  /** True = approximation, not a real routing API result. */
  isEstimated: boolean;
  /** Transit line name if mode === 'transit'. */
  transitLineName?: string;
}

// ─── Itinerary items ────────────────────────────────────────────

export type ItineraryItemType = 'place' | 'break' | 'transport' | 'accommodation-start' | 'accommodation-end';

export interface ItineraryItem {
  type: ItineraryItemType;
  /** For 'place' items only. */
  placeSlug?: string;
  label: string;
  sublabel?: string;
  /** HH:MM */
  arrivalTime: string;
  /** HH:MM — for 'place' and 'break' items. */
  departureTime?: string;
  durationMinutes: number;
  /** Transport segment from the previous item to this one. */
  routeSegmentBefore?: RouteSegment;
  /** Known admission in TRY. Undefined = unknown. 0 = free. */
  admissionTRY?: number;
  admissionUnknown?: boolean;
  latitude?: number;
  longitude?: number;
  /** 1-based display index on map markers. Only set for 'place' items. */
  markerIndex?: number;
}

// ─── Day plan ───────────────────────────────────────────────────

export interface DayMetrics {
  stopCount: number;
  /** Sum of known admission prices in TRY. */
  knownAdmissionTRY: number;
  hasUnknownAdmission: boolean;
  walkingDistanceMeters: number;
  drivingDistanceMeters: number;
  transitDurationMinutes: number;
  travelDurationMinutes: number;
  visitDurationMinutes: number;
  startTime: string;
  endTime: string;
}

export interface DayPlan {
  dayNumber: number;
  /** Display label e.g. "1. Gün — Gazimağusa Suriçi" */
  label: string;
  /** Short theme/cluster label e.g. "Gazimağusa Suriçi" */
  theme: string;
  items: ItineraryItem[];
  metrics: DayMetrics;
}

// ─── Full trip plan ─────────────────────────────────────────────

export interface TripMetrics {
  totalDays: number;
  totalPlaces: number;
  totalKnownAdmissionTRY: number;
  hasUnknownAdmission: boolean;
  totalWalkingMeters: number;
  totalDrivingMeters: number;
  totalTransitMinutes: number;
  totalVisitMinutes: number;
  totalTravelMinutes: number;
}

export interface TripPlan {
  input: TripInput;
  days: DayPlan[];
  metrics: TripMetrics;
  /** User-facing warnings e.g. "Yalnızca 3 uygun yer bulundu." */
  warnings: string[];
  generatedAt: string;
}
