// lib/db/transitRouteSchema.ts
// The Supabase/Postgres persistence shape for an inter-city bus route, plus
// Zod validation for data entering the database. Replaces
// lib/db/transitRouteDocument.ts. Mirrors placeSchema.ts's split between a
// DB-facing Input/Update schema and the domain BusRoute type
// (src/types/transit.ts) — see transitRouteMapper.ts for the conversion.

import { z } from 'zod';
import { REGIONS, VERIFICATION_STATUSES } from './placeSchema';

const transitStopSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
});

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

const transitScheduleSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('fixed'), times: z.array(z.string().regex(HHMM)).min(1) }),
  z.object({
    type: z.literal('frequency'),
    firstDeparture: z.string().regex(HHMM),
    lastDeparture: z.string().regex(HHMM),
    intervalMinutes: z.number().int().positive(),
  }),
  z.object({ type: z.literal('unpublished') }),
]);

/** Shape of a transit route row as it should be written to Supabase (no id/timestamps — those are server-assigned). */
export const transitRouteInputSchema = z.object({
  operator: z.string().min(1),
  fromRegion: z.enum(REGIONS),
  toRegion: z.enum(REGIONS),
  fromStop: transitStopSchema,
  toStop: transitStopSchema,
  durationMinutes: z.number().int().positive(),
  fareTRY: z.number().nonnegative().optional(),
  schedule: transitScheduleSchema,
  phone: z.array(z.string()).default([]),
  notes: z.string().optional(),
  sourceUrl: z.string().url(),
  lastVerifiedAt: z.string().min(1),
  verificationStatus: z.enum(VERIFICATION_STATUSES),
  /** Lets admin hide a route from the planner without deleting its record. */
  active: z.boolean().default(true),
});

export type TransitRouteInput = z.infer<typeof transitRouteInputSchema>;

/** Partial input for updates — every field optional, but still validated when present. */
export const transitRouteUpdateSchema = transitRouteInputSchema.partial();
export type TransitRouteUpdate = z.infer<typeof transitRouteUpdateSchema>;

/** The full row shape as stored in and read back from the `transitRoutes` table. */
export interface TransitRouteRow extends TransitRouteInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
