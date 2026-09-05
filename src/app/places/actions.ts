'use server';
// app/places/actions.ts
// Server Action behind the "Gezeceyik Puanı" rating widget on place
// detail pages. Reuses the exact same anonymous identity as the route
// builder (lib/identity/anon.ts) — no second identity system. The rating
// value is validated server-side regardless of what the client sends;
// the database's own CHECK (rating BETWEEN 1 AND 5) is the last line of
// defense if this validation were ever bypassed.

import { getOrCreateAnonId } from '@/lib/identity/anon';
import { ratingValueSchema } from '@/lib/db/ratingSchema';
import * as placeRepository from '@/lib/repositories/placeRepository';
import * as ratingRepository from '@/lib/repositories/ratingRepository';
import { RatingSummary } from '@/types/rating';

export interface RatingActionResult {
  summary?: RatingSummary;
  error?: string;
}

export async function submitRatingAction(placeId: string, rating: number): Promise<RatingActionResult> {
  const parsed = ratingValueSchema.safeParse(rating);
  if (!parsed.success) return { error: 'Geçersiz puan.' };
  if (!placeId) return { error: 'Geçersiz yer.' };

  try {
    const exists = await placeRepository.existsPublishedId(placeId);
    if (!exists) return { error: 'Bu yer bulunamadı.' };

    const voterId = await getOrCreateAnonId();
    const summary = await ratingRepository.upsertRating(placeId, voterId, parsed.data);
    return { summary };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
