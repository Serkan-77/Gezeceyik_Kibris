// types/transit.ts
// Inter-city bus/dolmuş route data for Northern Cyprus — sourced from
// operator sites and independent travel guides, not an official government
// timetable. Used by the trip planner's "public" transport mode to compute
// real departure times instead of a flat speed estimate.

import { Region, VerificationStatus } from './place';

export interface TransitStop {
  /** Human-readable stop/terminal name, e.g. "Çağlayan İtimat ofisi". */
  name: string;
  city: string;
}

/**
 * A route's timetable is either a fixed list of departure times, or a
 * first/last window with a roughly regular interval (typical for dolmuş
 * lines that run "every 30 minutes" rather than at fixed clock times).
 */
export type TransitSchedule =
  | { type: 'fixed'; times: string[] }
  | {
      type: 'frequency';
      firstDeparture: string;
      lastDeparture: string;
      intervalMinutes: number;
    }
  /** Operator runs the line but publishes no clock-time timetable (e.g. app-only). */
  | { type: 'unpublished' };

export interface BusRoute {
  id: string;
  operator: string;
  fromRegion: Region;
  toRegion: Region;
  fromStop: TransitStop;
  toStop: TransitStop;
  /** Approximate one-way ride duration in minutes. */
  durationMinutes: number;
  fareTRY?: number;
  schedule: TransitSchedule;
  phone?: string[];
  /** Caveats not captured by the schedule, e.g. reduced weekend service. */
  notes?: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
}
