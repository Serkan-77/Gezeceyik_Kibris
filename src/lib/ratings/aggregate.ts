// lib/ratings/aggregate.ts
// Pure aggregation math for a place's ratings — kept separate from the
// Supabase query code (ratingRepository.ts) so it's trivially testable.
// Rounds only for display (1 decimal); the underlying sum/count a caller
// works with is exact.

export interface RatingAggregate {
  average: number | undefined;
  count: number;
}

export function computeAggregate(ratings: number[]): RatingAggregate {
  if (ratings.length === 0) return { average: undefined, count: 0 };
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  const average = Math.round((sum / ratings.length) * 10) / 10;
  return { average, count: ratings.length };
}
