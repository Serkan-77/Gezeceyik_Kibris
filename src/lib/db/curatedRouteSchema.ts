// lib/db/curatedRouteSchema.ts
// The Supabase/Postgres persistence shape for an editorial "hazır rota"
// (curated, admin-authored multi-day itinerary shown on the homepage and
// /rotalar), plus Zod validation. Mirrors placeSchema.ts/transitRouteSchema.ts's
// split between a DB-facing Input/Update schema and a domain shape — see
// lib/curatedRoutes.ts for how `days` (plain place slugs) gets turned into
// a real, scheduled itinerary at render time.

import { z } from 'zod';
import { REGIONS } from './placeSchema';

export const CURATED_ROUTE_TRANSPORT_MODES = ['car', 'walking', 'public'] as const;

const curatedRouteAccommodationSchema = z.object({
  label: z.string().min(1),
  city: z.string().min(1),
  region: z.enum(REGIONS),
  lat: z.number(),
  lng: z.number(),
});

/** Shape of a curated route row as it should be written to Supabase (no id/timestamps — those are server-assigned). */
export const curatedRouteInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase, hyphen-separated (e.g. "magusada-3-gun")'),
  title: z.string().min(1),
  summary: z.string().min(1),
  coverImage: z.string().optional(),
  accommodation: curatedRouteAccommodationSchema,
  transport: z.enum(CURATED_ROUTE_TRANSPORT_MODES),
  /** One entry per day, each an ordered list of place slugs (not ids — matches how PlaceForm's nearbyPlaceSlugs works). */
  days: z.array(z.array(z.string().min(1)).min(1, 'a day needs at least one place')).min(1, 'a route needs at least one day'),
  published: z.boolean().default(false),
  /** Lower sorts first on the homepage/list. */
  displayOrder: z.number().int().default(0),
});

export type CuratedRouteInput = z.infer<typeof curatedRouteInputSchema>;

/** Partial input for updates — every field optional, but still validated when present. */
export const curatedRouteUpdateSchema = curatedRouteInputSchema.partial();
export type CuratedRouteUpdate = z.infer<typeof curatedRouteUpdateSchema>;

/** The full row shape as stored in and read back from the `curatedRoutes` table. */
export interface CuratedRouteRow extends CuratedRouteInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
