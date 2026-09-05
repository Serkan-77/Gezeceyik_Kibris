// lib/db/routeSchema.ts
// Supabase/Postgres persistence shape for manually-built routes, plus Zod
// validation for data entering the database. Mirrors the conventions in
// lib/db/placeSchema.ts: camelCase columns, quoted in supabase/schema.sql.

import { z } from 'zod';

export const ROUTE_STATUSES = ['draft', 'saved'] as const;
export type RouteStatus = (typeof ROUTE_STATUSES)[number];

export const routeNameSchema = z.string().trim().min(1, 'Rota adı boş olamaz.').max(120);

/** The `routes` table row shape as stored in and read back from Supabase. */
export interface RouteRow {
  id: string;
  ownerId: string;
  name: string | null;
  status: RouteStatus;
  createdAt: string;
  updatedAt: string;
}

/** The `routeStops` table row shape. */
export interface RouteStopRow {
  id: string;
  routeId: string;
  placeId: string;
  position: number;
  createdAt: string;
}
