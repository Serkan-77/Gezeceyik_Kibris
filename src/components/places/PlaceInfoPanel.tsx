'use client';
// components/places/PlaceInfoPanel.tsx
// Turkish visitor information sidebar panel with FavoriteButton and AddToTripButton.

import Link from 'next/link';
import { Place } from '@/types/place';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { AddToTripButton } from '@/components/ui/AddToTripButton';

interface PlaceInfoPanelProps {
  place: Place;
}

const DAY_KEYS = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
] as const;

type DayKey = (typeof DAY_KEYS)[number];

const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Pzt',
  tuesday: 'Sal',
  wednesday: 'Çar',
  thursday: 'Per',
  friday: 'Cum',
  saturday: 'Cmt',
  sunday: 'Paz',
};

function getTodayKey(): DayKey {
  return DAY_KEYS[new Date().getDay()];
}

function getTodayStatus(hours: Place['openingHours']): { isOpen: boolean; label: string } | null {
  if (!hours) return null;
  const key = getTodayKey();
  const val = hours[key];
  if (val === null) return { isOpen: false, label: 'Bugün kapalı' };
  if (val === undefined) return null;
  return { isOpen: true, label: `Bugün açık · ${val}` };
}

function formatVisitDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dakika`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} sa ${m} dk` : `${h} saat`;
}

export function PlaceInfoPanel({ place }: PlaceInfoPanelProps) {
  const todayKey = getTodayKey();
  const todayStatus = getTodayStatus(place.openingHours);

  const mapsQuery = encodeURIComponent(`${place.name}, ${place.address}`);

  const visitDuration = place.estimatedVisitMinutes
    ? formatVisitDuration(place.estimatedVisitMinutes)
    : null;

  const admissionText = place.admission?.isFree
    ? 'Ücretsiz Giriş'
    : place.admission?.adultPrice !== undefined
    ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'} (Yetişkin)${
        place.admission.childPrice !== undefined
          ? ` · ${place.admission.childPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'} (Çocuk)`
          : ''
      }`
    : null;

  const accessibilityFeatures: string[] = [
    place.accessibility?.wheelchairAccessible ? 'Tekerlekli Sandalye Erişimi' : '',
    place.accessibility?.audioGuide ? 'Sesli Rehber' : '',
    place.accessibility?.guidedTours ? 'Rehberli Tur' : '',
  ].filter(Boolean);

  return (
    <aside
      className="rounded-md border border-[#e8e4de] bg-white text-sm lg:sticky lg:top-20 lg:self-start"
      aria-label="Ziyaret bilgileri"
    >
      {/* Header */}
      <div className="border-b border-[#f5f2ee] px-5 py-4">
        <h2 className="font-display text-base font-semibold text-[#1a1a1a]">
          Ziyaret Bilgileri
        </h2>
        {todayStatus && (
          <p
            className={`mt-0.5 text-xs font-medium ${
              todayStatus.isOpen ? 'text-emerald-700' : 'text-[#9ca3af]'
            }`}
          >
            {todayStatus.label}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 border-b border-[#f5f2ee] px-5 py-3">
        <FavoriteButton placeSlug={place.slug} placeName={place.name} large className="flex-1" />
        <AddToTripButton placeSlug={place.slug} placeName={place.name} large className="flex-1" />
      </div>

      <div className="divide-y divide-[#f5f2ee]">
        {/* Address */}
        <InfoRow label="Adres" icon={<PinIcon />}>
          <span className="text-[#4b5563]">{place.address}</span>
        </InfoRow>

        {/* Admission */}
        {place.admission && (
          <InfoRow label="Giriş Ücreti" icon={<TicketIcon />}>
            <span className={place.admission.isFree ? 'font-medium text-emerald-700' : 'text-[#4b5563]'}>
              {admissionText}
            </span>
            {place.admission.notes && (
              <p className="mt-0.5 text-[11px] text-[#9ca3af]">{place.admission.notes}</p>
            )}
          </InfoRow>
        )}

        {/* Opening hours */}
        {place.openingHours && (
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              <ClockIcon />
              <span>Açılış Saatleri</span>
            </div>
            <table className="w-full text-xs" role="table" aria-label="Haftalık açılış saatleri">
              <tbody>
                {(Object.keys(DAY_LABELS) as DayKey[]).map((day) => {
                  const hours = place.openingHours![day];
                  const isToday = day === todayKey;
                  return (
                    <tr key={day} className={isToday ? 'font-semibold' : ''}>
                      <td
                        className={`py-[3px] pr-4 w-10 ${
                          isToday ? 'text-[#1a1a1a]' : 'text-[#9ca3af]'
                        }`}
                      >
                        {DAY_LABELS[day]}
                        {isToday && (
                          <span className="ml-1 inline-block h-1 w-1 rounded-full bg-[#e8651a] align-middle" aria-label="bugün" />
                        )}
                      </td>
                      <td
                        className={`py-[3px] text-right tabular-nums ${
                          hours === null
                            ? 'text-[#c4bdb4]'
                            : isToday
                            ? 'text-[#1a1a1a]'
                            : 'text-[#4b5563]'
                        }`}
                      >
                        {hours === null ? 'Kapalı' : hours ?? 'Bilinmiyor'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Estimated visit */}
        {visitDuration && (
          <InfoRow label="Tahmini Ziyaret Süresi" icon={<TimerIcon />}>
            <span className="text-[#4b5563]">{visitDuration}</span>
          </InfoRow>
        )}

        {/* Contact */}
        {(place.phone || place.website) && (
          <InfoRow label="İletişim" icon={<ContactIcon />}>
            <div className="space-y-1">
              {place.phone && (
                <a href={`tel:${place.phone}`} className="block text-[#4b5563] hover:text-[#e8651a]">
                  {place.phone}
                </a>
              )}
              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block max-w-full truncate text-[#e8651a] hover:underline"
                  title={place.website}
                >
                  {place.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          </InfoRow>
        )}

        {/* Accessibility */}
        {accessibilityFeatures.length > 0 && (
          <InfoRow label="Erişilebilirlik" icon={<AccessibilityIcon />}>
            <ul className="space-y-0.5">
              {accessibilityFeatures.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[#4b5563]">
                  <span className="h-1 w-1 rounded-full bg-emerald-600" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            {place.accessibility?.notes && (
              <p className="mt-1 text-[11px] text-[#9ca3af]">{place.accessibility.notes}</p>
            )}
          </InfoRow>
        )}
      </div>

      {/* Get directions CTA */}
      <div className="px-5 py-4">
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e8651a]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Yol Tarifi Al
        </Link>
      </div>
    </aside>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function InfoRow({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="px-5 py-3.5">
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function AccessibilityIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
