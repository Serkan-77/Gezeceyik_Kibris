'use client';
// components/pages/GezilerimClient.tsx
// Lists locally-saved trip itineraries. Purely client-side — each saved
// record already carries its full TripItinerary, so nothing to fetch.

import { useState } from 'react';
import { useSavedTrips } from '@/hooks/useSavedTrips';
import { ItineraryView } from '@/components/trip/ItineraryView';
import { EmptyState } from '@/components/ui/EmptyState';
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
    <div className="space-y-3">
      {trips.map((trip) => {
        const isOpen = expandedId === trip.id;
        const { itinerary } = trip;
        return (
          <div key={trip.id} className="overflow-hidden rounded-md border border-line bg-surface">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : trip.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-expanded={isOpen}
              >
                <ChevronDownIcon className={`h-4 w-4 shrink-0 text-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                <div className="min-w-0">
                  <p className="truncate font-display text-card-title font-semibold text-strong">{trip.label}</p>
                  <p className="text-meta text-subtle">
                    {formatDate(trip.createdAt)} · {itinerary.days.length} gün · {itinerary.totalPlaces} yer
                  </p>
                </div>
              </button>
              <button type="button" onClick={() => removeTrip(trip.id)} className="shrink-0 text-meta text-subtle transition-colors hover:text-brand">
                Sil
              </button>
            </div>
            {isOpen && (
              <div className="border-t border-line px-5 py-5">
                <ItineraryView itinerary={itinerary} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
