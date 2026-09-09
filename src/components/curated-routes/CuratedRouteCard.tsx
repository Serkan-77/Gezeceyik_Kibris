// components/curated-routes/CuratedRouteCard.tsx
// A specimen-plate card for one "hazır rota" — mirrors PlaceCard.tsx's
// framed-photo-then-caption-strip language so curated routes read as part
// of the same catalogue, not a bolted-on widget.

import Image from 'next/image';
import Link from 'next/link';
import { CuratedTrip } from '@/lib/curatedRoutes';
import { tr } from '@/lib/i18n/tr';
import { CarIcon, WalkIcon, BusIcon, ArrowRightIcon } from '@/components/ui/icons';

const TRANSPORT_ICON = { car: CarIcon, walking: WalkIcon, public: BusIcon } as const;
const TRANSPORT_LABEL = { car: 'Araç', walking: 'Yürüyüş', public: 'Toplu Taşıma' } as const;

interface CuratedRouteCardProps {
  trip: CuratedTrip;
  priority?: boolean;
}

export function CuratedRouteCard({ trip, priority }: CuratedRouteCardProps) {
  const { itinerary } = trip;
  const TransportIcon = TRANSPORT_ICON[itinerary.input.transport];

  return (
    <Link
      href={`/rotalar/${trip.slug}`}
      className="group relative flex h-full flex-col border border-line bg-surface transition-colors hover:border-ink"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-line bg-surface-muted">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale-[15%] transition-[filter,transform] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <span className="font-display text-lg text-white/25">Gezeceyik</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-4.5">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">
          <span>{tr.curatedRoutes.days(itinerary.days.length)}</span>
          <span aria-hidden="true">·</span>
          <TransportIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{TRANSPORT_LABEL[itinerary.input.transport]}</span>
        </p>
        <h3 className="font-serif text-[18px] font-semibold leading-tight text-strong">{trip.title}</h3>
        <p className="line-clamp-2 flex-1 text-body-sm leading-relaxed text-muted">{trip.summary}</p>
        <p className="mt-1 flex items-center justify-between font-mono text-[11px] text-subtle">
          <span>{tr.curatedRoutes.startsFrom(itinerary.input.accommodation.label)}</span>
          <span className="flex items-center gap-1 font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
            {tr.curatedRoutes.viewRoute}
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        </p>
      </div>
    </Link>
  );
}
