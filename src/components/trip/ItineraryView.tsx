'use client';
// components/trip/ItineraryView.tsx
// Renders a full TripItinerary (Phase 7) — real day-tick navigation, a
// sticky real route map, and borderless editorial stop rows with real
// photography. All numbers come straight from the planner's output;
// nothing invented. Public transport is shown at its real confidence:
// a matched real bus connection reads with full confidence; an
// estimated hop (public with no match, or car/walking) always carries
// an explicit "tahmini" qualifier — visual confidence never exceeds
// data confidence.

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { TripItinerary, ItineraryDay, AccommodationLocation, TransportMode } from '@/lib/trip-planner/types';
import { RouteMapWrapper } from './RouteMapWrapper';
import { PhotoTreatment } from '@/components/ui/PhotoTreatment';
import { FlagEndIcon, CarIcon, WalkIcon, BusIcon, DirectionsIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

const TRANSPORT_LABEL: Record<TransportMode, string> = {
  car: 'Araç',
  walking: 'Yürüyüş',
  public: 'Toplu Taşıma',
};

const TRANSPORT_ICON: Record<TransportMode, typeof CarIcon> = {
  car: CarIcon,
  walking: WalkIcon,
  public: BusIcon,
};

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}dk`;
  if (m === 0) return `${h}sa`;
  return `${h}sa ${m}dk`;
}

interface Props {
  itinerary: TripItinerary;
}

export function ItineraryView({ itinerary }: Props) {
  const [activeDay, setActiveDay] = useState(0);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);
  const [panRequest, setPanRequest] = useState<{ slug: string; token: number }>({ slug: '', token: 0 });

  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);
  const day = itinerary.days[activeDay];

  // Passive scroll focus — highlights the in-view stop on the map, never
  // moves the camera. Re-observes whenever the active day's stops change.
  useEffect(() => {
    const container = listRef.current;
    if (!container || !day) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setFocusedSlug((visible.target as HTMLElement).dataset.slug ?? null);
      },
      { root: null, rootMargin: '-35% 0px -50% 0px', threshold: [0, 0.5, 1] }
    );
    day.stops.forEach((stop) => {
      const el = rowRefs.current.get(stop.place.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [day]);

  function selectFromMap(slug: string) {
    setFocusedSlug(slug);
    rowRefs.current.get(slug)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function selectFromRow(slug: string) {
    setFocusedSlug(slug);
    setPanRequest({ slug, token: panRequest.token + 1 });
  }

  if (!day) return null;

  const TransportIcon = TRANSPORT_ICON[itinerary.input.transport];

  return (
    <div>
      {/* Trip summary — mono metadata row, not boxed stat tiles */}
      <p className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs tabular-nums text-subtle">
        <span>{itinerary.days.length} gün</span>
        <span className="h-3 w-px bg-line" aria-hidden="true" />
        <span>{itinerary.totalPlaces} yer</span>
        <span className="h-3 w-px bg-line" aria-hidden="true" />
        <span>{itinerary.totalKm} km (tahmini)</span>
        <span className="h-3 w-px bg-line" aria-hidden="true" />
        <span>{itinerary.totalCost > 0 ? `${itinerary.totalCost.toLocaleString('tr-TR')} TRY giriş` : 'giriş ücretsiz'}</span>
      </p>

      {/* Day navigation — real per-day facts, not tab pills */}
      <nav aria-label="Gün seçimi" className="mb-8 border-y border-line">
        <ol className="flex gap-6 overflow-x-auto sm:gap-10">
          {itinerary.days.map((d, i) => {
            const current = i === activeDay;
            return (
              <li key={d.dayNumber} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveDay(i)}
                  className={`flex flex-col items-start gap-1 border-b-2 py-3 text-left transition-colors ${
                    current ? 'border-brand' : 'border-transparent'
                  }`}
                >
                  <span className={`font-display text-lg font-semibold ${current ? 'text-brand' : 'text-strong'}`}>
                    {String(d.dayNumber).padStart(2, '0')}
                  </span>
                  <span className="whitespace-nowrap text-meta text-subtle">
                    {d.region} · {tr.trip.stops(d.stops.length)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Day summary strip */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta">
        <Metric label="Ziyaret" value={formatMinutes(day.totalVisitMin)} />
        <Metric label="Yol (tahmini)" value={formatMinutes(day.totalTravelMin)} />
        <Metric label="Mesafe (tahmini)" value={`${day.totalKm} km`} />
        {day.totalCost > 0 && <Metric label="Giriş ücreti" value={`${day.totalCost.toLocaleString('tr-TR')} TRY`} />}
        <div className="ml-auto flex items-center gap-1.5 font-medium text-strong">
          <TransportIcon className="h-4 w-4 text-brand" />
          {TRANSPORT_LABEL[itinerary.input.transport]}
        </div>
      </div>

      {/* Map + stops — breathing composition, map stays present while scrolling */}
      <div className="grid gap-8 lg:grid-cols-[1fr_45%] lg:items-start">
        <div ref={listRef} className="order-2 lg:order-1">
          <p className="mb-3 flex items-center gap-2 text-meta text-subtle">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-ink text-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
                <path d="M6 3v18m0-16.5h10l-2 3 2 3H6" />
              </svg>
            </span>
            {accLabel(itinerary.input.accommodation)}
          </p>

          {day.stops.map((stop, i) => {
            const isLast = i === day.stops.length - 1;
            const isFocused = stop.place.slug === focusedSlug;
            return (
              <div key={stop.place.slug}>
              <div
                data-slug={stop.place.slug}
                ref={(el) => {
                  if (el) rowRefs.current.set(stop.place.slug, el);
                  else rowRefs.current.delete(stop.place.slug);
                }}
                className={`flex items-stretch gap-4 border-t border-line py-4 transition-colors ${isFocused ? 'bg-brand/5' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => selectFromRow(stop.place.slug)}
                  aria-label={`${stop.place.name}, haritada göster`}
                  className="flex min-w-0 flex-1 items-stretch gap-4 text-left"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full border-2 border-brand bg-surface font-mono text-xs font-bold text-brand">
                    {i + 1}
                  </span>
                  <PhotoTreatment
                    src={stop.place.image}
                    alt=""
                    verificationStatus={stop.place.verificationStatus}
                    sizes="112px"
                    className="h-24 w-28 shrink-0 rounded-sm sm:w-36"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-mono text-[11px] tabular-nums text-subtle">
                      {stop.arrivalTime} – {stop.departureTime}
                    </span>
                    <span className="mt-0.5 block font-display text-card-title font-semibold leading-tight text-strong">
                      {stop.place.name}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-meta text-muted">{stop.place.shortDescription}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta">
                      {stop.admissionCost > 0 ? (
                        <span className="font-medium text-muted">{stop.admissionCost.toLocaleString('tr-TR')} TRY</span>
                      ) : (
                        <span className="font-medium text-success">Ücretsiz</span>
                      )}
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 flex-col items-center justify-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.place.name}, ${stop.place.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${stop.place.name}, ${tr.place.getDirections}`}
                    className="flex h-10 w-10 items-center justify-center rounded-sm text-subtle transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <DirectionsIcon className="h-4 w-4" />
                  </a>
                  <Link
                    href={`/places/${stop.place.slug}`}
                    aria-label={`${stop.place.name}, ${tr.place.viewDetails}`}
                    className="flex h-10 w-10 items-center justify-center rounded-sm text-subtle transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    →
                  </Link>
                </div>
              </div>

              {!isLast && <TravelSegment stop={stop} transport={itinerary.input.transport} />}
              </div>
            );
          })}

          <div className="flex items-center gap-3 border-t border-line py-4 text-meta text-subtle">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-line bg-surface-muted text-subtle">
              <FlagEndIcon className="h-3.5 w-3.5" />
            </span>
            Gün sonu
          </div>
        </div>

        <div className="order-1 h-72 w-full overflow-hidden rounded-lg border border-line sm:h-96 lg:sticky lg:top-20 lg:order-2 lg:h-[calc(100vh-8rem)]">
          <RouteMapWrapper
            day={day}
            accommodation={itinerary.input.accommodation}
            focusedSlug={focusedSlug}
            onSelectStop={selectFromMap}
            panToken={panRequest.token}
            panSlug={panRequest.slug}
          />
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-meta leading-relaxed text-warning">
        Bu program tahmini süreler ve örnek veriler kullanılarak otomatik oluşturulmuştur.
        Ziyaret öncesi açılış saatlerini ve fiyatları resmi kaynaklardan doğrulayın.
      </p>
    </div>
  );
}

function accLabel(accommodation: AccommodationLocation): string {
  return `Başlangıç: ${accommodation.label}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-subtle">{label}</span> <span className="font-semibold text-strong">{value}</span>
    </div>
  );
}

/** The three real confidence tiers: a matched real bus leg, an estimated
 * transit hop, or a plain estimated drive/walk — never shown with the
 * same visual confidence. */
function TravelSegment({ stop, transport }: { stop: ItineraryDay['stops'][number]; transport: TransportMode }) {
  if (stop.travelToNextMin <= 0) return null;

  if (stop.transitDetail) {
    const t = stop.transitDetail;
    return (
      <div className="ml-11 flex items-start gap-2 border-l border-line py-3 pl-4 text-meta leading-relaxed text-muted">
        <BusIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
        <span>
          {t.walkToStopMin}dk yürü → <strong className="text-strong">{t.fromStopName}</strong>
          {t.departureTime ? (
            <>
              {' '}
              · {t.operator} ile <strong className="text-strong">{t.departureTime}</strong> kalkış
            </>
          ) : (
            <> · {t.operator} (sabit tarife yok, ~{t.waitMinutes}dk bekleme varsayımı)</>
          )}{' '}
          ({formatMinutes(t.rideMinutes)}) → <strong className="text-strong">{t.toStopName}</strong>, sonra {t.walkFromStopMin}dk yürü
          {t.fareTRY ? <> · {t.fareTRY.toLocaleString('tr-TR')} TRY</> : null}
        </span>
      </div>
    );
  }

  const label = transport === 'public' ? 'toplu taşıma (tahmini)' : `${TRANSPORT_LABEL[transport].toLowerCase()} (tahmini)`;
  return (
    <div className="ml-11 border-l border-line py-3 pl-4 text-meta text-faint">
      ~{formatMinutes(stop.travelToNextMin)} · ~{stop.distanceToNextKm} km · {label}
    </div>
  );
}
