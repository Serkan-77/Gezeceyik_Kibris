'use client';
// components/ui/AddToTripButton.tsx
// Toggles a place's membership in the trip-planner selection
// (useTripSelection — separate from favorites by design: a place can be
// on the trip without being favorited, and vice versa).

import { useTripSelection } from '@/hooks/useTripSelection';
import { PlusIcon, CheckIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';

interface AddToTripButtonProps {
  slug: string;
  name: string;
  large?: boolean;
}

export function AddToTripButton({ slug, name, large }: AddToTripButtonProps) {
  const { isSelected, toggle, hydrated } = useTripSelection();
  const active = hydrated && isSelected(slug);

  return (
    <Button
      type="button"
      variant={active ? 'ink' : 'secondary'}
      size={large ? 'md' : 'sm'}
      icon={active ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      iconPosition="leading"
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={active ? `${name} rotadan çıkar` : `${name} rotaya ekle`}
    >
      {active ? 'Rotada' : 'Rotaya Ekle'}
    </Button>
  );
}
