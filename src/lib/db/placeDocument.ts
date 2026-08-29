// lib/db/placeDocument.ts
// The MongoDB persistence shape for a place, plus Zod validation for data
// entering the database (createPlace/updatePlace and the seed script share
// this schema). This is deliberately a different shape from the app's
// domain `Place` type (src/types/place.ts) — see placeMapper.ts for the
// conversion between the two.

import { z } from 'zod';
import { ObjectId } from 'mongodb';
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

const entranceFeeSchema = z
  .object({
    isFree: z.boolean(),
    adultPrice: z.number().nonnegative().optional(),
    childPrice: z.number().nonnegative().optional(),
    currency: z.enum(['TRY', 'EUR']).optional(),
    notes: z.string().optional(),
  })
  .optional();

const contactSchema = z.object({
  phone: z.string().optional(),
  website: z.string().url().optional(),
});

const accessibilitySchema = z
  .object({
    wheelchairAccessible: z.boolean().optional(),
    audioGuide: z.boolean().optional(),
    guidedTours: z.boolean().optional(),
    notes: z.string().optional(),
  })
  .optional();

const imagesSchema = z.object({
  cover: z.string().min(1),
  gallery: z.array(z.string()).default([]),
});

/** GeoJSON Point — MongoDB requires [longitude, latitude] order. */
export const geoPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90, {
      message: 'coordinates must be [longitude, latitude] within valid WGS-84 ranges',
    }),
});

export type GeoPoint = z.infer<typeof geoPointSchema>;

/** Shape of a place document as it should be written to MongoDB (no _id/timestamps — those are server-assigned). */
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
  location: geoPointSchema,
  images: imagesSchema,
  openingHours: openingHoursSchema,
  entranceFee: entranceFeeSchema,
  contact: contactSchema,
  visitDuration: z.number().int().positive().optional(),
  accessibility: accessibilitySchema,
  nearbyPlaceSlugs: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
  verificationStatus: z.enum(VERIFICATION_STATUSES),
  sources: z.array(z.string().url()).default([]),
  lastVerifiedAt: z.string().optional(),
});

export type PlaceInput = z.infer<typeof placeInputSchema>;

/** Partial input for updates — every field optional, but still validated when present. */
export const placeUpdateSchema = placeInputSchema.partial();
export type PlaceUpdate = z.infer<typeof placeUpdateSchema>;

/** The full document shape as stored in and read back from MongoDB. */
export interface PlaceDocument extends PlaceInput {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
