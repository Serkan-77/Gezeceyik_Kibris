// lib/repositories/ratingRepository.ts
// Data-access layer over the `placeRatings` table. One rating per (place,
// voter) is enforced both here (upsert on the unique constraint) and at
// the database level (UNIQUE("placeId","voterId")) — see
// supabase/schema.sql. Aggregates (average/count) are computed here from
// the raw rows rather than read from a denormalized column, per the
// product decision not to cache averages onto `places`.

import { getSupabaseClient } from '@/lib/db/supabase';
import { RatingSummary } from '@/types/rating';
import { computeAggregate } from '@/lib/ratings/aggregate';

const TABLE = 'placeRatings';

function unwrap<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) throw new Error(`Supabase error (${context}): ${error.message}`);
  return data as T;
}

/** Aggregate + the current visitor's own rating (null if they haven't voted or voterId is null). */
export async function getRatingSummary(placeId: string, voterId: string | null): Promise<RatingSummary> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('rating, voterId').eq('placeId', placeId);
  const rows = unwrap(data, error, 'getRatingSummary') ?? [];

  const { average, count } = computeAggregate(rows.map((r) => r.rating as number));
  const myRating = voterId ? ((rows.find((r) => r.voterId === voterId)?.rating as number | undefined) ?? null) : null;

  return { average, count, myRating };
}

/**
 * Batch aggregate lookup for discovery/listing surfaces — one query for
 * many places instead of one round-trip per card. Does not include
 * myRating (listing rows don't need it); use getRatingSummary for a
 * single place detail page.
 */
export async function getRatingAggregates(placeIds: string[]): Promise<Map<string, { average: number | undefined; count: number }>> {
  const result = new Map<string, { average: number | undefined; count: number }>();
  if (placeIds.length === 0) return result;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('placeId, rating').in('placeId', placeIds);
  const rows = unwrap(data, error, 'getRatingAggregates') ?? [];

  const byPlace = new Map<string, number[]>();
  for (const row of rows) {
    const list = byPlace.get(row.placeId as string) ?? [];
    list.push(row.rating as number);
    byPlace.set(row.placeId as string, list);
  }
  for (const placeId of placeIds) {
    result.set(placeId, computeAggregate(byPlace.get(placeId) ?? []));
  }
  return result;
}

/** Creates or updates the voter's rating for a place — never a second row (Section "One user, one rating"). */
export async function upsertRating(placeId: string, voterId: string, rating: number): Promise<RatingSummary> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from(TABLE)
    .upsert({ placeId, voterId, rating, updatedAt: new Date().toISOString() }, { onConflict: 'placeId,voterId' });
  if (error) throw new Error(`Supabase error (upsertRating): ${error.message}`);

  return getRatingSummary(placeId, voterId);
}
