// lib/db/placeSchema.ts
// The Supabase/Postgres persistence shape for a place, plus Zod validation
// for data entering the database (createPlace/updatePlace and the seed
// script share this schema). Replaces lib/db/placeDocument.ts.
//
// The `places` table uses the exact same field names as this schema
// (camelCase, quoted in the DDL — see supabase/schema.sql) — deliberately
// mirroring the app's existing domain-shape conventions instead of
// converting to snake_case, so PlaceInput and the table row are the same
// shape field-for-field (row = input + id/createdAt/updatedAt). See
// placeMapper.ts for the (now very thin) conversion to/from the domain
// `Place` type (src/types/place.ts).

import { z } from 'zod';
import { Category, Region, VerificationStatus } from '@/types/place';

export const CATEGORIES = [
  'Museum',
  'Historical Place',
  'Castle',
  'Archaeological Site',
  'Monastery',
  'Church',
  'Natural Attraction',
  'Beach',
  'Viewpoint',
  'Cultural Site',
  'Family Activity',
] as const satisfies readonly Category[];

export const REGIONS = [
  'Lefkoşa',
  'Girne',
  'Gazimağusa',
  'İskele',
  'Güzelyurt',
  'Lefke',
] as const satisfies readonly Region[];

export const VERIFICATION_STATUSES = ['sample', 'unverified', 'verified'] as const satisfies readonly VerificationStatus[];

const openingHoursSchema = z
  .object({
    monday: z.string().nullish(),
    tuesday: z.string().nullish(),
    wednesday: z.string().nullish(),
    thursday: z.string().nullish(),
    friday: z.string().nullish(),
    saturday: z.string().nullish(),
    sunday: z.string().nullish(),
  })
  .partial()
  .optional();

const admissionSchema = z
  .object({
    isFree: z.boolean(),
    adultPrice: z.number().nonnegative().optional(),
    childPrice: z.number().nonnegative().optional(),
    currency: z.enum(['TRY', 'EUR']).optional(),
    notes: z.string().optional(),
  })
  .optional();

const accessibilitySchema = z
  .object({
    wheelchairAccessible: z.boolean().optional(),
    audioGuide: z.boolean().optional(),
    guidedTours: z.boolean().optional(),
    notes: z.string().optional(),
  })
  .optional();

/** Shape of a place row as it should be written to Supabase (no id/timestamps — those are server-assigned). */
export const placeInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase, hyphen-separated (e.g. "girne-kalesi")'),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  history: z.string().optional(),
  category: z.enum(CATEGORIES),
  region: z.enum(REGIONS),
  city: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  image: z.string().min(1),
  gallery: z.array(z.string()).default([]),
  openingHours: openingHoursSchema,
  admission: admissionSchema,
  phone: z.string().optional(),
  website: z.string().url().optional(),
  estimatedVisitMinutes: z.number().int().positive().optional(),
  accessibility: accessibilitySchema,
  nearbyPlaceSlugs: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
  verificationStatus: z.enum(VERIFICATION_STATUSES),
  sourceUrl: z.string().url().optional(),
  lastVerifiedAt: z.string().optional(),
});

export type PlaceInput = z.infer<typeof placeInputSchema>;

/** Partial input for updates — every field optional, but still validated when present. */
export const placeUpdateSchema = placeInputSchema.partial();
export type PlaceUpdate = z.infer<typeof placeUpdateSchema>;

/** The full row shape as stored in and read back from the `places` table. */
export interface PlaceRow extends PlaceInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
