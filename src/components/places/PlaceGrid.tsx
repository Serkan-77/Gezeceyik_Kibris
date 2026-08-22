// components/places/PlaceGrid.tsx
// Responsive grid of PlaceCards. Accepts any array of Place objects.

import { Place } from '@/types/place';
import { PlaceCard } from './PlaceCard';

interface PlaceGridProps {
  places: Place[];
  emptyMessage?: string;
}

export function PlaceGrid({ places, emptyMessage = 'No places found.' }: PlaceGridProps) {
  if (places.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#6b7280]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
