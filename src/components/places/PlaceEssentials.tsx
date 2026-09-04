'use client';
// components/places/PlaceEssentials.tsx
// Data-adaptive essentials strip: shows only fields that genuinely exist
// for this place. Never invents a value — estimated visit time only
// appears when estimatedVisitMinutes is real data.

import { ReactNode } from 'react';
import { Place } from '@/types/place';
import { AddToTripButton } from '@/components/ui/AddToTripButton';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { PlaceOpenStatus } from './PlaceOpenStatus';
import { tr } from '@/lib/i18n/tr';

interface PlaceEssentialsProps {
  place: Place;
}

interface StripItem {
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

  const items: StripItem[] = [{ label: tr.filter.region, value: `${place.city}, ${tr.regions[place.region]}` }];

  if (place.openingHours) {
    items.push({ label: tr.place.openingHours, value: <PlaceOpenStatus openingHours={place.openingHours} /> });
  }
  if (admissionLabel) {
    items.push({
      label: tr.place.admission,
      value: <span className={place.admission?.isFree ? 'font-medium text-success' : undefined}>{admissionLabel}</span>,
    });
  }
  if (place.estimatedVisitMinutes) {
    items.push({ label: tr.place.estimatedVisit, value: tr.place.duration(place.estimatedVisitMinutes) });
  }
  if (place.phone) {
    items.push({
      label: tr.place.contact,
      value: (
        <a href={`tel:${place.phone}`} className="hover:text-brand">
          {place.phone}
        </a>
      ),
    });
  }
  if (accessibilityFeatures.length > 0) {
    items.push({ label: tr.place.accessibility, value: accessibilityFeatures.join(' · ') });
  }

  return (
    <div className="border-y border-line bg-paper">
      <div className="-mx-4 flex items-stretch divide-x divide-line overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {items.map((item) => (
          <div key={item.label} className="flex shrink-0 flex-col justify-center gap-0.5 px-4 py-3.5 first:pl-0 sm:px-5">
            <span className="whitespace-nowrap text-label font-medium uppercase tracking-wider text-subtle">
              {item.label}
            </span>
            <span className="whitespace-nowrap text-body-sm font-medium text-strong">{item.value}</span>
          </div>
        ))}

        <div className="ml-auto flex shrink-0 items-center gap-3 py-3.5 pl-4 sm:pl-5">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-sm font-medium text-brand hover:underline"
          >
            {tr.place.getDirections}
            <span className="sr-only">(yeni sekmede açılır)</span>
          </a>
          <FavoriteButton slug={place.slug} name={place.name} />
          <AddToTripButton slug={place.slug} name={place.name} large />
        </div>
      </div>
    </div>
  );
}
