'use client';
// components/pages/FavorilerClient.tsx
// Reads favorites from localStorage and renders the same borderless
// editorial row (DiscoveryRow) used at place detail's nearby strip — a
// compact personal list, not a card grid.

import { useFavorites } from '@/hooks/useFavorites';
import { Place } from '@/types/place';
import { DiscoveryRow } from '@/components/places/DiscoveryRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/icons';

interface FavorilerClientProps {
  places: Place[];
}

export function FavorilerClient({ places }: FavorilerClientProps) {
  const { favorites, hydrated, clear } = useFavorites();
  const favoritePlaces = places.filter((p) => favorites.includes(p.slug));

  if (!hydrated) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 border-t border-line py-4">
            <div className="h-24 w-32 shrink-0 animate-pulse rounded-sm bg-surface-muted sm:w-44" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-24 animate-pulse rounded-sm bg-surface-muted" />
              <div className="h-5 w-1/2 animate-pulse rounded-sm bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favoritePlaces.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="h-6 w-6" />}
        title="Henüz favori eklemediniz"
        description="Beğendiğiniz yerlerin kalp simgesine tıklayarak buraya kaydedebilirsiniz."
        action={<Button href="/places">Tüm yerlere göz at</Button>}
      />
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between border-b border-line pb-3">
        <p className="text-body-sm text-subtle">{favoritePlaces.length} yer kaydedildi</p>
        <button type="button" onClick={clear} className="text-meta text-subtle transition-colors hover:text-brand">
          Tümünü temizle
        </button>
      </div>
      {favoritePlaces.map((place) => (
        <DiscoveryRow key={place.slug} place={place} />
      ))}
    </div>
  );
}
