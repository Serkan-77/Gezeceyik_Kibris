'use client';
// components/places/PlaceEssentials.tsx
// A sticky sidebar card — not a horizontal strip under the hero. Shows
// only fields that genuinely exist for this place; never invents a
// value (estimated visit time only appears when estimatedVisitMinutes
// is real data).

import { ReactNode } from 'react';
import { Place } from '@/types/place';
import { AddToTripButton } from '@/components/ui/AddToTripButton';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { Button } from '@/components/ui/Button';
import { PlaceOpenStatus } from './PlaceOpenStatus';
import { DirectionsIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

interface PlaceEssentialsProps {
  place: Place;
}

interface Row {
  label: string;
  value: ReactNode;
}

export function PlaceEssentials({ place }: PlaceEssentialsProps) {
  const mapsQuery = encodeURIComponent(`${place.name}, ${place.address}`);

  const admissionLabel = place.admission
    ? place.admission.isFree
      ? tr.place.free
      : place.admission.adultPrice !== undefined
        ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
        : null
    : null;

  const accessibilityFeatures = [
    place.accessibility?.wheelchairAccessible ? 'Tekerlekli sandalye' : '',
    place.accessibility?.audioGuide ? 'Sesli rehber' : '',
    place.accessibility?.guidedTours ? 'Rehberli tur' : '',
  ].filter(Boolean);

  const rows: Row[] = [{ label: tr.filter.region, value: `${place.city}, ${tr.regions[place.region]}` }];

  if (place.openingHours) {
    rows.push({ label: tr.place.openingHours, value: <PlaceOpenStatus openingHours={place.openingHours} /> });
  }
  if (admissionLabel) {
    rows.push({
      label: tr.place.admission,
      value: <span className={place.admission?.isFree ? 'font-medium text-success' : undefined}>{admissionLabel}</span>,
    });
  }
  if (place.estimatedVisitMinutes) {
    rows.push({ label: tr.place.estimatedVisit, value: tr.place.duration(place.estimatedVisitMinutes) });
  }
  if (place.phone) {
    rows.push({
      label: tr.place.contact,
      value: (
        <a href={`tel:${place.phone}`} className="hover:text-brand">
          {place.phone}
        </a>
      ),
    });
  }
  if (accessibilityFeatures.length > 0) {
    rows.push({ label: tr.place.accessibility, value: accessibilityFeatures.join(' · ') });
  }

  return (
    <div className="rounded-md border border-line bg-surface p-5">
      <h2 className="mb-1 font-display text-block-title font-semibold text-strong">{tr.place.visitorInfo}</h2>
      <dl className="mt-3 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 py-3 first:pt-0">
            <dt className="shrink-0 text-label font-medium uppercase tracking-wider text-subtle">{row.label}</dt>
            <dd className="text-right text-body-sm font-medium text-strong">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
        <Button
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="ink"
          icon={<DirectionsIcon className="h-4 w-4" />}
          className="w-full"
        >
          {tr.place.getDirections}
          <span className="sr-only">(yeni sekmede açılır)</span>
        </Button>
        <div className="flex gap-2.5">
          <AddToTripButton slug={place.slug} name={place.name} large />
          <FavoriteButton slug={place.slug} name={place.name} className="border border-line bg-surface shadow-none" />
        </div>
      </div>
    </div>
  );
}
