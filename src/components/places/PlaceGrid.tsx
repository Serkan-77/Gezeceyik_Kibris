// components/places/PlaceGrid.tsx
// Responsive grid of PlaceCards. Accepts any array of Place objects.

import { Place } from '@/types/place';
import { PlaceCard } from './PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchIcon } from '@/components/ui/icons';

interface PlaceGridProps {
  places: Place[];
  emptyMessage?: string;
}

export function PlaceGrid({ places, emptyMessage = 'Yer bulunamadı.' }: PlaceGridProps) {
  if (places.length === 0) {
    return (
      <EmptyState
        icon={<SearchIcon className="h-6 w-6" />}
        title="Sonuç yok"
        description={emptyMessage}
      />
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
