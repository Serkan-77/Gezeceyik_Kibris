// types/rating.ts
// Domain shape for a place's aggregated community rating ("Gezeceyik
// Puanı"). Computed on read from the placeRatings table — see
// lib/repositories/ratingRepository.ts — never stored as a column.

export interface RatingSummary {
  /** Rounded to 1 decimal for display; undefined when count is 0 (no fake placeholder average). */
  average: number | undefined;
  count: number;
  /** The current visitor's own rating, if they've voted. */
  myRating: number | null;
}

/** Minimum votes before a community consensus descriptor ("Kesin görülmeli" etc.) is shown. */
export const MIN_VOTES_FOR_DESCRIPTOR = 5;
