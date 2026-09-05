// lib/db/ratingSchema.ts
// Supabase/Postgres persistence shape for place ratings ("Gezeceyik
// Puanı"), plus Zod validation for the rating value entering the
// database. Mirrors the conventions in lib/db/placeSchema.ts.

import { z } from 'zod';

export const ratingValueSchema = z.number().int().min(1).max(5);

/** The `placeRatings` table row shape. */
export interface PlaceRatingRow {
  id: string;
  placeId: string;
  voterId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
