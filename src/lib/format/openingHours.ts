// lib/format/openingHours.ts
// Pure, framework-free classification of a single day's raw opening-hours
// value. Exists specifically so the weekly-hours display (see
// components/places/PlaceWeeklyHours.tsx) can never assert "Bugün Açık" /
// "Bugün Kapalı" from data that doesn't actually support that conclusion.
//
// The `openingHours` column is free text per day (see the admin form,
// components/admin/PlaceForm.tsx — a plain <Input>, no format
// enforcement; the Zod schema, lib/db/placeSchema.ts, is `z.string()`
// with no pattern) — so a future record CAN contain something like
// "Randevu ile" or "Kışın kapalı" for a day. This module is the one place
// that decides whether a stored value is trustworthy enough to drive a
// green/red open/closed claim, or must be shown as plain, honest text
// instead.
//
// Per the domain type's own documented contract (types/place.ts):
// null = closed that day. Omitted/undefined key = unknown (NOT closed).
// An empty string carries no real information either, so it's treated
// the same as "unknown" — never as "closed".

/**
 * 'closed'       — explicit `null`: the place is confirmed not to open this day.
 * 'unknown'      — no data for this day (omitted key, undefined, or empty string).
 * 'confirmed'    — a non-empty string that safely parses as a time range (HH:MM–HH:MM).
 *                  Only this state is allowed to produce "Bugün Açık" / a green highlight.
 * 'unstructured' — a non-empty string that does NOT match a safe time-range pattern
 *                  (free text). The value is real and known — shown verbatim — but must
 *                  never be presented as a confirmed "open" or "closed" verdict.
 */
export type DayHoursKind = 'closed' | 'unknown' | 'confirmed' | 'unstructured';

export interface DayHoursClassification {
  kind: DayHoursKind;
  /** The original stored text, present for 'confirmed' and 'unstructured' only. */
  raw?: string;
}

// Deliberately strict and conservative: HH:MM, optional whitespace, a
// hyphen/en-dash/em-dash, HH:MM. Anything else (multi-range "9-13, 15-18",
// "Randevu ile", "Kışın kapalı", a stray "-", etc.) falls through to
// 'unstructured' rather than being guessed at.
const TIME_RANGE_RE = /^\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2}$/;

export function classifyDayHours(value: string | null | undefined): DayHoursClassification {
  if (value === null) return { kind: 'closed' };
  if (value === undefined) return { kind: 'unknown' };

  const trimmed = value.trim();
  if (trimmed === '') return { kind: 'unknown' };
  if (TIME_RANGE_RE.test(trimmed)) return { kind: 'confirmed', raw: trimmed };
  return { kind: 'unstructured', raw: trimmed };
}

/** True if at least one day carries real information (closed, confirmed, or unstructured) — used to decide whether a weekly schedule is worth rendering at all. */
export function hasAnyDayInfo(classifications: DayHoursClassification[]): boolean {
  return classifications.some((c) => c.kind !== 'unknown');
}
