// components/curated-routes/CuratedRouteSpotlight.tsx
// Single-route layout for CuratedRoutesBand — a wide, split specimen card
// rather than one grid cell stranded next to empty columns. Reuses the
// framed-photo language from PlaceCard/CuratedRouteCard (border, grayscale
// hover) but at feature scale, with the route's real stops laid out as a
// pipeline instead of hidden behind "view route".

import Image from 'next/image';
import Link from 'next/link';
import { CuratedTrip } from '@/lib/curatedRoutes';
import { tr } from '@/lib/i18n/tr';
import { CarIcon, WalkIcon, BusIcon, PinIcon, RouteIcon, ArrowRightIcon } from '@/components/ui/icons';

const TRANSPORT_ICON = { car: CarIcon, walking: WalkIcon, public: BusIcon } as const;
const TRANSPORT_LABEL = { car: 'Araç', walking: 'Yürüyüş', public: 'Toplu Taşıma' } as const;

// Enough stops to read as a route at a glance without turning into a list.
const MAX_STOP_CHIPS = 5;

interface CuratedRouteSpotlightProps {
  trip: CuratedTrip;
}

export function CuratedRouteSpotlight({ trip }: CuratedRouteSpotlightProps) {
  const { itinerary } = trip;
  const TransportIcon = TRANSPORT_ICON[itinerary.input.transport];
  const stopNames = itinerary.days.flatMap((day) => day.stops.map((stop) => stop.place.name));
  const shownStops = stopNames.slice(0, MAX_STOP_CHIPS);
  const remainingStops = stopNames.length - shownStops.length;

  return (
    <Link
      href={`/rotalar/${trip.slug}`}
      className="group grid overflow-hidden border border-line bg-surface transition-colors hover:border-ink sm:grid-cols-2"
    >
      <div className="relative min-h-[260px] overflow-hidden border-b border-line bg-surface-muted sm:min-h-[420px] sm:border-b-0 sm:border-r">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover grayscale-[15%] transition-[filter,transform] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <span className="font-display text-lg text-white/25">Gezeceyik</span>
          </div>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-1.5 border border-line bg-surface/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle backdrop-blur-sm">
          <span>{tr.curatedRoutes.days(itinerary.days.length)}</span>
          <span aria-hidden="true">·</span>
          <TransportIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{TRANSPORT_LABEL[itinerary.input.transport]}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-5 p-6 sm:p-9 lg:p-12">
        <div>
          <h3 className="font-display text-2xl leading-tight text-strong sm:text-[28px]">{trip.title}</h3>
          <p className="mt-2.5 max-w-md font-serif text-body leading-relaxed text-muted text-pretty">{trip.summary}</p>
        </div>

        {shownStops.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {shownStops.map((name, i) => (
              <span key={`${name}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 shrink-0 rounded-full bg-line" aria-hidden="true" />}
                <span className="flex items-center gap-1 font-mono text-[11px] text-subtle">
                  {i === 0 && <PinIcon className="h-3 w-3 shrink-0 text-brand" />}
                  {name}
                </span>
              </span>
            ))}
            {remainingStops > 0 && (
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-line" aria-hidden="true" />
                <span className="font-mono text-[11px] text-subtle">+{remainingStops}</span>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col items-start gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] text-subtle">
            <RouteIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tr.curatedRoutes.startsFrom(itinerary.input.accommodation.label)}</span>
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 border border-brand-fill bg-brand-fill px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white shadow-[3px_3px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-[var(--duration-fast)] group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-none">
            {tr.curatedRoutes.viewRoute}
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
