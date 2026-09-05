'use client';
// components/places/PlaceWeeklyHours.tsx
// Full Monday-first weekly schedule for the "Ziyaret Bilgileri" sidebar
// card — every day's hours at a glance, with today's row called out
// (green + "Bugün açık" when open, red + "Bugün kapalı" when closed).
// Distinct from PlaceOpenStatus (a compact single-line "open now" badge
// used in the hero) — this is the full week, not just today.
//
// Data honesty: the "Bugün açık"/"Bugün kapalı" claim and the
// green/red highlight are only ever shown when lib/format/openingHours.ts
// classifies the day's stored value as safely parseable ('confirmed') or
// explicitly closed ('closed'). An omitted day, an empty string, or free
// text (e.g. "Randevu ile") renders as its own honest, neutral state —
// never guessed into "open" or "closed". See openingHours.test.ts for the
// scenarios this is built against.
//
// Computed client-side post-mount, same reasoning as useTodayKey: this
// page is statically pre-rendered, so "today" can only be known safely
// after hydration.

import { OpeningHours } from '@/types/place';
import { useTodayKey, DayKey } from '@/hooks/useTodayKey';
import { classifyDayHours, hasAnyDayInfo } from '@/lib/format/openingHours';
import { tr } from '@/lib/i18n/tr';

const WEEK_ORDER: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const FULL_DAY_LABEL: Record<DayKey, string> = {
  monday: tr.days.mondayFull,
  tuesday: tr.days.tuesdayFull,
  wednesday: tr.days.wednesdayFull,
  thursday: tr.days.thursdayFull,
  friday: tr.days.fridayFull,
  saturday: tr.days.saturdayFull,
  sunday: tr.days.sundayFull,
};

interface PlaceWeeklyHoursProps {
  openingHours: OpeningHours;
}

export function PlaceWeeklyHours({ openingHours }: PlaceWeeklyHoursProps) {
  const todayKey = useTodayKey();

  const classifications = WEEK_ORDER.map((day) => classifyDayHours(openingHours[day]));
  if (!hasAnyDayInfo(classifications)) return null; // no real data for any day — nothing honest to show

  return (
    <div>
      <p className="mb-2 text-label font-medium uppercase tracking-wider text-subtle">{tr.place.openingHours}</p>
      <ul>
        {WEEK_ORDER.map((day, i) => {
          const classification = classifications[i];
          const isToday = day === todayKey;

          let valueText: string;
          let toneClass = 'text-muted';
          let rowClass = '';
          let labelClass = 'text-strong';

          switch (classification.kind) {
            case 'confirmed':
              valueText = isToday ? `${tr.place.openToday} · ${classification.raw}` : classification.raw!;
              if (isToday) {
                toneClass = 'font-medium text-success';
                labelClass = 'font-semibold text-success';
                rowClass = 'bg-success-soft';
              }
              break;
            case 'closed':
              valueText = isToday ? tr.place.closedToday : tr.place.closedDay;
              if (isToday) {
                toneClass = 'font-medium text-danger';
                labelClass = 'font-semibold text-danger';
                rowClass = 'bg-danger-soft';
              }
              break;
            case 'unstructured':
              // Known, real text — shown honestly — but never asserted as a confirmed open/closed verdict.
              valueText = classification.raw!;
              if (isToday) rowClass = 'bg-surface-muted';
              break;
            case 'unknown':
            default:
              valueText = tr.place.unknownHoursShort;
              if (isToday) rowClass = 'bg-surface-muted';
              break;
          }

          return (
            <li key={day} className={`flex items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-body-sm ${rowClass}`}>
              <span className={labelClass}>{FULL_DAY_LABEL[day]}</span>
              <span className={`tabular-nums ${toneClass}`}>{valueText}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
