// components/places/MobileActionBar.tsx
// Mobile is a primary use case here (someone walking around Cyprus), so
// the actions that matter most in the moment — save it, add to trip, get
// directions — stay reachable without scrolling back up.

import { Place } from '@/types/place';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { AddToTripButton } from '@/components/ui/AddToTripButton';
import { Button } from '@/components/ui/Button';
import { DirectionsIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

export function MobileActionBar({ place }: { place: Place }) {
  const mapsQuery = encodeURIComponent(`${place.name}, ${place.address}`);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-overlay flex items-center gap-2 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <FavoriteButton slug={place.slug} name={place.name} />
      <AddToTripButton slug={place.slug} name={place.name} />
      <Button
        href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="ink"
        icon={<DirectionsIcon className="h-4 w-4" />}
        className="flex-1"
      >
        {tr.place.getDirections}
        <span className="sr-only">(yeni sekmede açılır)</span>
      </Button>
    </div>
  );
}
