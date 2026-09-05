'use client';
// components/ui/AddToTripButton.tsx
// Toggles a place's membership in the ONE canonical current draft route
// (context/DraftRouteContext.tsx — Supabase-backed, not localStorage, so
// it survives refreshes and is shared across place detail / discovery /
// map / the route builder).

import { Place } from '@/types/place';
import { useDraftRoute } from '@/context/DraftRouteContext';
import { PlusIcon, CheckIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';

interface AddToTripButtonProps {
  place: Place;
  large?: boolean;
}

export function AddToTripButton({ place, large }: AddToTripButtonProps) {
  const { isSelected, isPending, add, remove, hydrated } = useDraftRoute();
  const active = hydrated && isSelected(place.slug);
  const pending = isPending(place.slug);

  return (
    <Button
      type="button"
      variant={active ? 'ink' : 'secondary'}
      size={large ? 'md' : 'sm'}
      icon={active ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      iconPosition="leading"
      onClick={() => (active ? remove(place.slug) : add(place))}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? `${place.name} rotadan çıkar` : `${place.name} rotaya ekle`}
    >
      {active ? 'Rotada' : 'Rotaya Ekle'}
    </Button>
  );
}
