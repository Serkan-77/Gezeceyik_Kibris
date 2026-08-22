'use client';
// components/pages/FavorilerClient.tsx
// Client component — reads favorites from localStorage and renders filtered place grid.

import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { getAllPlaces } from '@/lib/places';
import { PlaceGrid } from '@/components/places/PlaceGrid';

export function FavorilerClient() {
  const { favorites, hydrated, clear } = useFavorites();
  const allPlaces = getAllPlaces();
  const favoritePlaces = allPlaces.filter((p) => favorites.includes(p.slug));

  if (!hydrated) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-md bg-[#f5f2ee]" />
        ))}
      </div>
    );
  }

  if (favoritePlaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f2ee]">
          <svg className="h-8 w-8 text-[#c4bdb4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="mb-2 font-display text-xl font-semibold text-[#1a1a1a]">
          Henüz favori eklenmedi
        </h2>
        <p className="mb-6 max-w-sm text-sm text-[#9ca3af]">
          Yerleri keşfederken kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
        </p>
        <Link
          href="/places"
          className="rounded-sm bg-[#e8651a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c9540e]"
        >
          Yerleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#9ca3af]">{favoritePlaces.length} yer kaydedildi</p>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-[#9ca3af] transition-colors hover:text-[#e8651a]"
        >
          Tümünü temizle
        </button>
      </div>
      <PlaceGrid places={favoritePlaces} />
    </div>
  );
}
