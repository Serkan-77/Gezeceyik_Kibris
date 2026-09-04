// lib/format.ts
// Pure display-formatting helpers with no data-access dependency, safe to
// import from Client Components. Kept separate from lib/places.ts, which is
// now a server-only data-access seam (it imports the Supabase repository).

import { VerificationStatus } from '@/types/place';

/** Format distance in metres for Turkish display. */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Whether a place's photo should carry a "temsili görsel" (representative
 * image) disclaimer.
 *
 * `verificationStatus` is a whole-record trust signal, not an image-specific
 * field — there is no per-image verification metadata in the schema. This
 * deliberately reuses the record-level status rather than inventing one:
 * 'sample' data is explicitly documented as "do NOT display as fact" (see
 * types/place.ts), and 'unverified' explicitly means "not independently
 * confirmed" — both statements already cover the image field, since it's
 * part of the same unconfirmed record. Only 'verified' — "confirmed against
 * official sources" — is treated as clearing the image too. If per-image
 * verification is ever tracked separately, this should switch to that field
 * instead of the record-level status.
 */
export function isImageRepresentative(verificationStatus: VerificationStatus): boolean {
  return verificationStatus !== 'verified';
}
