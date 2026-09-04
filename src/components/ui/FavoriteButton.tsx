'use client';
// components/ui/FavoriteButton.tsx
// A small, honest icon-only toggle — no colored badge, no pill chrome.
// Safe pre-hydration: renders an inert outline heart until the
// localStorage-backed hook hydrates, so it never flashes a wrong state.

import { useFavorites } from '@/hooks/useFavorites';
import { HeartIcon } from '@/components/ui/icons';

interface FavoriteButtonProps {
  slug: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function FavoriteButton({ slug, name, className = '', size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(slug);
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconDim = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? `${name} favorilerden çıkar` : `${name} favorilere ekle`}
      className={`flex ${dim} items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur-sm transition-colors hover:bg-white ${className}`}
    >
      <HeartIcon filled={active} className={`${iconDim} ${active ? 'text-terracotta' : ''}`} />
    </button>
  );
}
