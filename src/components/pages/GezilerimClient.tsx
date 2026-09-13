'use client';
// components/pages/GezilerimClient.tsx
// Lists locally-saved trip itineraries. Purely client-side — each saved
// record already carries its full TripItinerary, so nothing to fetch.

import { useState } from 'react';
import { useSavedTrips } from '@/hooks/useSavedTrips';
import { ItineraryView } from '@/components/trip/ItineraryView';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CompassIcon, ChevronDownIcon } from '@/components/ui/icons';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GezilerimClient() {
  const { trips, hydrated, removeTrip } = useSavedTrips();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-md bg-surface-muted" />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        icon={<CompassIcon className="h-6 w-6" />}
        title="Henüz kaydedilmiş bir geziniz yok"
        description="Gezi Planla ile bir program oluşturun, sonuç ekranından kaydedip buradan tekrar ulaşabilirsiniz."
        action={<Button href="/gezi-planla">Gezi Planla</Button>}
      />
    );
  }

  return (
    <div>
      {trips.map((trip, i) => {
        const isOpen = expandedId === trip.id;
        const { itinerary } = trip;
        return (
          <Reveal key={trip.id} delayMs={Math.min(i, 6) * 50} className="border-t border-line first:border-t-0">
            <div className="flex items-center justify-between gap-4 py-4">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : trip.id)}
                className="flex min-w-0 flex-1 items-center gap-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display text-2xl leading-none text-brand tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-card-title font-semibold text-strong">{trip.label}</p>
                  <p className="font-mono text-meta text-subtle">
                    {formatDate(trip.createdAt)} · {itinerary.days.length} gün · {itinerary.totalPlaces} yer
                  </p>
                </div>
                <ChevronDownIcon className={`ml-auto h-4 w-4 shrink-0 text-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <button type="button" onClick={() => removeTrip(trip.id)} className="shrink-0 text-meta text-subtle transition-colors hover:text-danger">
                Sil
              </button>
            </div>
            {isOpen && (
              <div className="border-t border-line pb-6 pt-5">
                <ItineraryView itinerary={itinerary} />
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
