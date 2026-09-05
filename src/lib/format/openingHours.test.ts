import { describe, it, expect } from 'vitest';
import { classifyDayHours, hasAnyDayInfo } from './openingHours';

describe('classifyDayHours', () => {
  it('classifies a well-formed time range as confirmed', () => {
    expect(classifyDayHours('08:00–19:00')).toEqual({ kind: 'confirmed', raw: '08:00–19:00' });
  });

  it('accepts a plain hyphen as well as an en-dash', () => {
    expect(classifyDayHours('09:00-18:00')).toEqual({ kind: 'confirmed', raw: '09:00-18:00' });
  });

  it('trims surrounding whitespace before classifying', () => {
    expect(classifyDayHours('  08:00–19:00  ')).toEqual({ kind: 'confirmed', raw: '08:00–19:00' });
  });

  it('classifies explicit null as closed — never "unknown"', () => {
    expect(classifyDayHours(null)).toEqual({ kind: 'closed' });
  });

  it('classifies an omitted/undefined day as unknown — never "closed"', () => {
    expect(classifyDayHours(undefined)).toEqual({ kind: 'unknown' });
  });

  it('classifies an empty string as unknown, not closed and not confirmed', () => {
    expect(classifyDayHours('')).toEqual({ kind: 'unknown' });
    expect(classifyDayHours('   ')).toEqual({ kind: 'unknown' });
  });

  it('classifies free text as unstructured, preserving the original text, never guessing open/closed', () => {
    expect(classifyDayHours('Randevu ile')).toEqual({ kind: 'unstructured', raw: 'Randevu ile' });
    expect(classifyDayHours('Kışın kapalı')).toEqual({ kind: 'unstructured', raw: 'Kışın kapalı' });
  });

  it('classifies a malformed/partial time-like string as unstructured, not confirmed', () => {
    expect(classifyDayHours('08:00')).toEqual({ kind: 'unstructured', raw: '08:00' });
    expect(classifyDayHours('08:00 - ??')).toEqual({ kind: 'unstructured', raw: '08:00 - ??' });
    expect(classifyDayHours('9-5')).toEqual({ kind: 'unstructured', raw: '9-5' }); // missing minutes — not safely parseable
  });

  it('classifies a split-shift / multi-range string as unstructured rather than guessing which range is "the" hours', () => {
    expect(classifyDayHours('09:00-13:00, 15:00-18:00').kind).toBe('unstructured');
  });
});

describe('hasAnyDayInfo', () => {
  it('is false when every day is unknown (no real data at all)', () => {
    const days = Array(7).fill(null).map(() => classifyDayHours(undefined));
    expect(hasAnyDayInfo(days)).toBe(false);
  });

  it('is true when at least one day is closed, confirmed, or unstructured', () => {
    expect(hasAnyDayInfo([classifyDayHours(undefined), classifyDayHours(null)])).toBe(true);
    expect(hasAnyDayInfo([classifyDayHours(undefined), classifyDayHours('08:00–19:00')])).toBe(true);
    expect(hasAnyDayInfo([classifyDayHours(undefined), classifyDayHours('Randevu ile')])).toBe(true);
  });
});

// ── Scenario coverage required by the data-honesty audit ───────────

describe('real-world place scenarios', () => {
  function weekOf(overrides: Record<string, string | null | undefined>) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return Object.fromEntries(days.map((d) => [d, overrides[d]]));
  }

  it('a place open today: today has a confirmed range', () => {
    const week = weekOf({ monday: '08:00–19:00' });
    expect(classifyDayHours(week.monday)).toEqual({ kind: 'confirmed', raw: '08:00–19:00' });
  });

  it('a place closed today: today is explicit null, distinct from "no data"', () => {
    const week = weekOf({ tuesday: null });
    expect(classifyDayHours(week.tuesday)).toEqual({ kind: 'closed' });
  });

  it('a weekend-closed place: Saturday/Sunday null, weekdays confirmed', () => {
    const week = weekOf({
      monday: '09:00–17:00',
      tuesday: '09:00–17:00',
      wednesday: '09:00–17:00',
      thursday: '09:00–17:00',
      friday: '09:00–17:00',
      saturday: null,
      sunday: null,
    });
    expect(classifyDayHours(week.saturday).kind).toBe('closed');
    expect(classifyDayHours(week.sunday).kind).toBe('closed');
    expect(classifyDayHours(week.monday).kind).toBe('confirmed');
  });

  it('different hours on different days are each classified independently', () => {
    const week = weekOf({ monday: '08:00–15:00', friday: '10:00–20:00' });
    expect(classifyDayHours(week.monday)).toEqual({ kind: 'confirmed', raw: '08:00–15:00' });
    expect(classifyDayHours(week.friday)).toEqual({ kind: 'confirmed', raw: '10:00–20:00' });
  });

  it('missing/incomplete hours: only some days present, the rest are unknown (not fabricated as closed or open)', () => {
    const week = weekOf({ monday: '08:00–19:00' }); // tuesday..sunday all undefined
    expect(classifyDayHours(week.monday).kind).toBe('confirmed');
    expect(classifyDayHours(week.tuesday).kind).toBe('unknown');
    expect(classifyDayHours(week.sunday).kind).toBe('unknown');
  });
});
