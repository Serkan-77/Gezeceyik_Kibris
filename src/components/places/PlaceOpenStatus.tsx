'use client';
// components/places/PlaceOpenStatus.tsx
// "Open now" / "closed today" — computed client-side post-mount (see
// useTodayKey) so a statically pre-rendered page never bakes in a stale
// build-day answer. Renders nothing until hydrated rather than guessing.

import { OpeningHours } from '@/types/place';
import { useTodayKey } from '@/hooks/useTodayKey';

interface PlaceOpenStatusProps {
  openingHours?: OpeningHours;
  dark?: boolean;
}

export function PlaceOpenStatus({ openingHours, dark }: PlaceOpenStatusProps) {
  const todayKey = useTodayKey();
  if (!openingHours || !todayKey) return null;

  if (openingHours.alwaysOpen) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${dark ? 'text-white' : 'text-success'}`}>
        <span className="h-[6px] w-[6px] bg-success" aria-hidden="true" />
        Her saat açık
      </span>
    );
  }

  const hoursToday = openingHours[todayKey];

  if (hoursToday === null || hoursToday === undefined) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${dark ? 'text-white/70' : 'text-subtle'}`}>
        <span className="h-[6px] w-[6px] bg-danger" aria-hidden="true" />
        Bugün kapalı
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${dark ? 'text-white' : 'text-success'}`}>
      <span className="h-[6px] w-[6px] bg-success" aria-hidden="true" />
      Bugün açık · {hoursToday}
    </span>
  );
}
