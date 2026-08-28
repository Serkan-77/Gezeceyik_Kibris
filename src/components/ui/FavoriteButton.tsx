'use client';
// components/ui/FavoriteButton.tsx
// Heart toggle backed by useFavorites (localStorage). Thin wrapper around
// IconToggleButton — this file only owns the favorites-specific wiring.

import { useFavorites } from '@/hooks/useFavorites';
import { IconToggleButton } from './IconButton';
import { HeartIcon } from './icons';

interface FavoriteButtonProps {
  placeSlug: string;
  placeName: string;
  large?: boolean;
  className?: string;
}

export function FavoriteButton({ placeSlug, placeName, large, className }: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(placeSlug);

  return (
    <IconToggleButton
      icon={<HeartIcon filled={active} className="h-4 w-4" />}
      active={active}
      onToggle={() => toggle(placeSlug)}
      aria-label={active ? `${placeName} favorilerden çıkar` : `${placeName} favorilere ekle`}
      large={large}
      label={{ active: 'Favorilerden Çıkar', inactive: 'Favorilere Ekle' }}
      tone="rose"
      className={className}
    />
  );
}
