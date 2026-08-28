'use client';
// components/pages/FavorilerClient.tsx
// Client component — reads favorites from localStorage and renders filtered place grid.

import { useFavorites } from '@/hooks/useFavorites';
import { getAllPlaces } from '@/lib/places';
import { PlaceGrid } from '@/components/places/PlaceGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

export function FavorilerClient() {
  const { favorites, hydrated, clear } = useFavorites();
  const allPlaces = getAllPlaces();
  const favoritePlaces = allPlaces.filter((p) => favorites.includes(p.slug));

  if (!hydrated) {
    return (
      <div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-md bg-surface-muted" />
        ))}
      </div>
    );
  }

  if (favoritePlaces.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="h-6 w-6" />}
        title={tr.favorites.empty}
        description={tr.favorites.emptyHint}
        action={<Button href="/places">{tr.favorites.browseAllPlaces}</Button>}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-body-sm text-subtle">{favoritePlaces.length} yer kaydedildi</p>
        <button
          type="button"
          onClick={clear}
          className="text-meta text-subtle transition-colors hover:text-brand"
        >
          Tümünü temizle
        </button>
      </div>
      <PlaceGrid places={favoritePlaces} />
    </div>
  );
}
