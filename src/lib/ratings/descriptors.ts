// lib/ratings/descriptors.ts
// Pure, framework-free rating-label logic — the star meanings shown while
// picking a rating, and the community-consensus descriptor shown once
// enough votes exist. Kept separate from UI/DB code so both are trivially
// unit-testable.

import { MIN_VOTES_FOR_DESCRIPTOR } from '@/types/rating';

/** What each star value means, shown on hover/focus while picking a rating. */
export const STAR_MEANINGS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Bana göre değil',
  2: 'Vaktin varsa',
  3: 'Görmeye değer',
  4: 'Çok iyi',
  5: 'Kesin görülmeli',
};

export function starMeaning(value: number): string {
  const rounded = Math.min(5, Math.max(1, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
  return STAR_MEANINGS[rounded];
}

/**
 * A short community-consensus phrase for an aggregate score — only
 * meaningful once enough votes exist (Section "Community Descriptors" —
 * a single 5-star vote must never read as "Kesin görülmeli"). Below the
 * threshold, or with no votes, returns null and callers should fall back
 * to the neutral "Henüz puanlanmadı" / raw count instead.
 *
 * Below-3.5 wording stays neutral/factual — never dismissive or mocking
 * of the place.
 */
export function communityDescriptor(average: number | undefined, count: number): string | null {
  if (average === undefined || count < MIN_VOTES_FOR_DESCRIPTOR) return null;
  if (average >= 4.5) return 'Kesin görülmeli';
  if (average >= 4.0) return 'Çok öneriliyor';
  if (average >= 3.5) return 'Görmeye değer';
  if (average >= 3.0) return 'Değerlendirmeler karışık';
  return 'Sınırlı ilgi gördü';
}
