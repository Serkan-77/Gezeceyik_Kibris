'use client';
// components/ui/AddToTripButton.tsx
// Plus/check toggle backed by useTripSelection (localStorage). Thin
// wrapper around IconToggleButton — this file only owns trip-specific wiring.

import { useTripSelection } from '@/hooks/useTripSelection';
import { IconToggleButton } from './IconButton';
import { PlusIcon, CheckIcon } from './icons';

interface AddToTripButtonProps {
  placeSlug: string;
  placeName: string;
  large?: boolean;
  className?: string;
}

export function AddToTripButton({ placeSlug, placeName, large, className }: AddToTripButtonProps) {
  const { isSelected, toggle, hydrated } = useTripSelection();
  const active = hydrated && isSelected(placeSlug);

  return (
    <IconToggleButton
      icon={active ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      active={active}
      onToggle={() => toggle(placeSlug)}
      aria-label={active ? `${placeName} geziden çıkar` : `${placeName} geziye ekle`}
      large={large}
      label={{ active: 'Geziden Çıkar', inactive: 'Geziye Ekle' }}
      tone="brand"
      className={className}
    />
  );
}
