'use client';
// components/ui/FavoriteButton.tsx
// Heart toggle button backed by useFavorites localStorage hook.

import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  placeSlug: string;
  placeName: string;
  /** If true, renders a larger standalone button variant */
  large?: boolean;
  className?: string;
}

export function FavoriteButton({ placeSlug, placeName, large, className }: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(placeSlug);

  const baseClass = large
    ? 'flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors'
    : 'flex h-8 w-8 items-center justify-center rounded-sm backdrop-blur-sm transition-colors';

  const activeClass = large
    ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
    : 'bg-white/90 text-rose-500 hover:bg-white';

  const inactiveClass = large
    ? 'border-[#e8e4de] bg-white text-[#6b7280] hover:border-rose-200 hover:text-rose-500'
    : 'bg-white/70 text-[#9ca3af] hover:bg-white hover:text-rose-500';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(placeSlug);
      }}
      aria-label={active ? `${placeName} favorilerden çıkar` : `${placeName} favorilere ekle`}
      aria-pressed={active}
      className={`${baseClass} ${active ? activeClass : inactiveClass} ${className ?? ''}`}
    >
      <svg
        className={large ? 'h-4 w-4' : 'h-4 w-4'}
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {large && (active ? 'Favorilerden Çıkar' : 'Favorilere Ekle')}
    </button>
  );
}
