'use client';
// components/trip/ItineraryView.tsx
// Renders a full TripItinerary — day tabs + timeline cards + summary metrics.

import Link from 'next/link';
import { useState } from 'react';
import { TripItinerary, ItineraryDay } from '@/lib/trip-planner/types';

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}dk`;
  if (m === 0) return `${h}sa`;
  return `${h}sa ${m}dk`;
}

function DaySummary({ day }: { day: ItineraryDay }) {
  return (
    <div className="mt-6">
      {/* Day metrics strip */}
      <div className="mb-4 flex flex-wrap gap-4 rounded-sm bg-[#f5f2ee] px-4 py-3 text-xs">
        <div>
          <span className="text-[#9ca3af]">Toplam ziyaret</span>{' '}
          <span className="font-semibold text-[#1a1a1a]">{formatMinutes(day.totalVisitMin)}</span>
        </div>
        <div>
          <span className="text-[#9ca3af]">Seyahat</span>{' '}
          <span className="font-semibold text-[#1a1a1a]">{formatMinutes(day.totalTravelMin)}</span>
        </div>
        <div>
          <span className="text-[#9ca3af]">Mesafe</span>{' '}
          <span className="font-semibold text-[#1a1a1a]">{day.totalKm} km</span>
        </div>
        {day.totalCost > 0 && (
          <div>
            <span className="text-[#9ca3af]">Giriş ücreti</span>{' '}
            <span className="font-semibold text-[#1a1a1a]">{day.totalCost.toLocaleString('tr-TR')} TRY</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <ol className="space-y-0" aria-label={`${day.dayNumber}. Gün programı`}>
        {day.stops.map((stop, i) => (
          <li key={stop.place.slug} className="relative flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#e8651a] bg-white text-xs font-bold text-[#e8651a] z-10">
                {i + 1}
              </div>
              {i < day.stops.length - 1 && (
                <div className="mt-1 mb-1 w-px flex-1 bg-[#e8e4de]" aria-hidden="true" />
              )}
            </div>

            {/* Card */}
            <div className="mb-4 min-w-0 flex-1 rounded-sm border border-[#e8e4de] bg-white px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
                    {stop.arrivalTime} — {stop.departureTime}
                  </p>
                  <h3 className="mt-0.5 font-display text-base font-semibold leading-tight text-[#1a1a1a]">
                    <Link href={`/places/${stop.place.slug}`} className="hover:text-[#e8651a]">
                      {stop.place.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#9ca3af]">{stop.place.city} · {stop.place.category}</p>
                </div>
                {stop.admissionCost > 0 ? (
                  <span className="shrink-0 text-xs font-medium text-[#4b5563]">
                    {stop.admissionCost.toLocaleString('tr-TR')} TRY
                  </span>
                ) : (
                  <span className="shrink-0 text-xs font-medium text-emerald-700">Ücretsiz</span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs text-[#6b7280]">{stop.place.shortDescription}</p>

              {/* Travel to next */}
              {stop.travelToNextMin > 0 && (
                <p className="mt-2 text-[10px] text-[#c4bdb4]">
                  ↓ {formatMinutes(stop.travelToNextMin)} seyahat ({stop.distanceToNextKm} km)
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
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
          <div key={label} className="rounded-sm border border-[#e8e4de] bg-white px-4 py-3 text-center">
            <p className="text-xs text-[#9ca3af]">{label}</p>
            <p className="mt-0.5 font-display text-xl font-bold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-sm border border-[#e8e4de] bg-[#f5f2ee] p-1">
        {itinerary.days.map((day, i) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setActiveDay(i)}
            className={`shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
              activeDay === i
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-[#6b7280] hover:text-[#1a1a1a]'
            }`}
          >
            {day.dayNumber}. Gün
            <span className="ml-1.5 text-[11px] text-[#9ca3af]">{day.region}</span>
          </button>
        ))}
      </div>

      {/* Active day */}
      {itinerary.days[activeDay] && (
        <DaySummary day={itinerary.days[activeDay]} />
      )}

      {/* Note */}
      <p className="mt-6 rounded-sm border border-amber-200/60 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-amber-800">
        Bu program tahmini süreler ve örnek veriler kullanılarak otomatik oluşturulmuştur.
        Ziyaret öncesi açılış saatlerini ve fiyatları resmi kaynaklardan doğrulayın.
      </p>
    </div>
  );
}
