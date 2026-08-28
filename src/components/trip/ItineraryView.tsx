'use client';
// components/trip/ItineraryView.tsx
// Renders a full TripItinerary — day tabs, a route map (the signature
// "sightseeing route" visualization), and a timed timeline underneath it.
// All numbers come straight from the planner's output; nothing invented.

import Link from 'next/link';
import { useState } from 'react';
import { TripItinerary, ItineraryDay, AccommodationLocation, TransportMode } from '@/lib/trip-planner/types';
import { RouteMapWrapper } from './RouteMapWrapper';
import { FlagStartIcon, FlagEndIcon, CarIcon, WalkIcon, BusIcon, ArrowRightIcon } from '@/components/ui/icons';
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

interface DaySummaryProps {
  day: ItineraryDay;
  accommodation: AccommodationLocation;
  transport: TransportMode;
}

function DaySummary({ day, accommodation, transport }: DaySummaryProps) {
  const TransportIcon = TRANSPORT_ICON[transport];

  return (
    <div className="mt-6">
      {/* Route summary strip */}
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 rounded-sm bg-surface-muted px-4 py-3 text-meta">
        <Metric label="Toplam ziyaret" value={formatMinutes(day.totalVisitMin)} />
        <Metric label="Seyahat" value={formatMinutes(day.totalTravelMin)} />
        <Metric label="Mesafe" value={`${day.totalKm} km`} />
        {day.totalCost > 0 && <Metric label="Giriş ücreti" value={`${day.totalCost.toLocaleString('tr-TR')} TRY`} />}
        <div className="ml-auto flex items-center gap-1.5 font-medium text-strong">
          <TransportIcon className="h-4 w-4 text-brand" />
          {TRANSPORT_LABEL[transport]}
        </div>
      </div>

      {/* Route map — the day's sightseeing route at a glance */}
      <div className="mb-6 h-72 w-full overflow-hidden rounded-lg border border-line sm:h-96">
        <RouteMapWrapper day={day} accommodation={accommodation} />
      </div>

      {/* Timeline: start → numbered stops → end of day */}
      <ol className="space-y-0" aria-label={`${day.dayNumber}. Gün programı`}>
        {/* Start node */}
        <li className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink text-white">
              <FlagStartIcon className="h-3.5 w-3.5" />
            </div>
            <div className="mb-1 mt-1 w-px flex-1 bg-line" aria-hidden="true" />
          </div>
          <div className="mb-4 min-w-0 flex-1 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle">Başlangıç</p>
            <p className="mt-0.5 font-display text-body-sm font-semibold text-strong">{accommodation.label}</p>
          </div>
        </li>

        {day.stops.map((stop, i) => {
          const isLast = i === day.stops.length - 1;
          return (
            <li key={stop.place.slug} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-white text-xs font-bold text-brand">
                  {i + 1}
                </div>
                {!isLast && <div className="mb-1 mt-1 w-px flex-1 bg-line" aria-hidden="true" />}
              </div>

              <div className={`min-w-0 flex-1 rounded-sm border border-line bg-surface px-4 py-3 ${isLast ? 'mb-4' : 'mb-4'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle">
                      {stop.arrivalTime} — {stop.departureTime}
                    </p>
                    <h3 className="mt-0.5 font-display text-card-title font-semibold leading-tight text-strong">
                      <Link href={`/places/${stop.place.slug}`} className="hover:text-brand">
                        {stop.place.name}
                      </Link>
                    </h3>
                    <p className="text-meta text-subtle">{stop.place.city} · {tr.categories[stop.place.category]}</p>
                  </div>
                  {stop.admissionCost > 0 ? (
                    <span className="shrink-0 text-meta font-medium text-muted">
                      {stop.admissionCost.toLocaleString('tr-TR')} TRY
                    </span>
                  ) : (
                    <span className="shrink-0 text-meta font-medium text-success">Ücretsiz</span>
                  )}
                </div>
                <p className="mt-1.5 line-clamp-2 text-meta text-muted">{stop.place.shortDescription}</p>

                {stop.travelToNextMin > 0 && (
                  <p className="mt-2 flex items-center gap-1 text-[10px] text-faint">
                    <ArrowRightIcon className="h-3 w-3 rotate-90" />
                    {formatMinutes(stop.travelToNextMin)} seyahat ({stop.distanceToNextKm} km)
                  </p>
                )}
              </div>
            </li>
          );
        })}

        {/* End of day cap */}
        <li className="flex gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-surface-muted text-subtle">
            <FlagEndIcon className="h-3.5 w-3.5" />
          </div>
          <p className="pt-1.5 text-meta text-subtle">Gün sonu</p>
        </li>
      </ol>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-subtle">{label}</span>{' '}
      <span className="font-semibold text-strong">{value}</span>
    </div>
  );
}

interface Props {
  itinerary: TripItinerary;
}

export function ItineraryView({ itinerary }: Props) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div>
      {/* Trip summary metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Gün', value: itinerary.days.length },
          { label: 'Toplam Yer', value: itinerary.totalPlaces },
          { label: 'Toplam Km', value: `${itinerary.totalKm} km` },
          {
            label: 'Tahmini Ücret',
            value: itinerary.totalCost > 0 ? `${itinerary.totalCost.toLocaleString('tr-TR')} TRY` : 'Ücretsiz',
          },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-sm border border-line bg-surface px-4 py-3 text-center">
            <p className="text-meta text-subtle">{label}</p>
            <p className="mt-0.5 font-display text-block-title font-bold text-strong">{value}</p>
          </div>
        ))}
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-sm border border-line bg-surface-muted p-1">
        {itinerary.days.map((day, i) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setActiveDay(i)}
            className={`shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
              activeDay === i ? 'bg-surface text-strong shadow-[var(--shadow-card)]' : 'text-muted hover:text-strong'
            }`}
          >
            {day.dayNumber}. Gün
            <span className="ml-1.5 text-[11px] text-subtle">{day.region}</span>
          </button>
        ))}
      </div>

      {/* Active day */}
      {itinerary.days[activeDay] && (
        <DaySummary
          day={itinerary.days[activeDay]}
          accommodation={itinerary.input.accommodation}
          transport={itinerary.input.transport}
        />
      )}

      {/* Note */}
      <p className="mt-6 rounded-sm border border-warning/20 bg-warning-soft px-4 py-3 text-meta leading-relaxed text-warning">
        Bu program tahmini süreler ve örnek veriler kullanılarak otomatik oluşturulmuştur.
        Ziyaret öncesi açılış saatlerini ve fiyatları resmi kaynaklardan doğrulayın.
      </p>
    </div>
  );
}
