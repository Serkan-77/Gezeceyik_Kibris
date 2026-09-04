'use client';
// components/places/PlaceOpenStatus.tsx
// Small client leaf for the hero's open/closed dot — status stays a
// semantic success/neutral color, never blue (blue means location/
// interaction on this site, not status). Renders nothing when the data
// doesn't exist rather than guessing.

import { Place } from '@/types/place';
import { useTodayKey, DayKey } from '@/hooks/useTodayKey';
import { tr } from '@/lib/i18n/tr';

export function PlaceOpenStatus({ openingHours, dark = false }: { openingHours: Place['openingHours']; dark?: boolean }) {
  const todayKey = useTodayKey();
  if (!openingHours || !todayKey) return null;
  const val = openingHours[todayKey as DayKey];
  if (val === undefined) return null;
  const isOpen = val !== null;

  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOpen ? 'bg-success' : dark ? 'bg-white/40' : 'bg-faint'}`}
        aria-hidden="true"
      />
      {isOpen ? `${tr.place.openToday} · ${val}` : tr.place.closedToday}
    </span>
  );
}
