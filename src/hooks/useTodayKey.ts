'use client';
// hooks/useTodayKey.ts
// Returns today's opening-hours day key, computed client-side after mount.
//
// Pages in this project are statically pre-rendered (SSG). Computing
// `new Date().getDay()` directly during render bakes the *build day* into
// the static HTML, which then mismatches the visitor's actual day on
// hydration (and stays wrong until the next rebuild). Computing it in an
// effect avoids the SSR/client mismatch: server and first client render
// both return `undefined`, then the real value fills in after mount.

import { useEffect, useState } from 'react';

// A plain literal union, not `keyof OpeningHours` — that type also carries
// non-day flags like `alwaysOpen` (see types/place.ts), which must never
// be treated as a weekday key.
export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_KEYS: DayKey[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

export function useTodayKey(): DayKey | undefined {
  const [key, setKey] = useState<DayKey | undefined>(undefined);

  useEffect(() => {
    // Batch into a microtask — same pattern as useFavorites,
    // avoids the "setState synchronously within an effect" lint rule.
    Promise.resolve().then(() => {
      setKey(DAY_KEYS[new Date().getDay()]);
    });
  }, []);

  return key;
}
