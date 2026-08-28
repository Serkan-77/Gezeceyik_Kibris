'use client';
// components/places/PlaceInfoPanel.tsx
// Editorial "at a glance" visitor panel — scannable, not a dashboard.
// Verification status is now surfaced explicitly (was previously only
// implied by the generic sample-data disclaimer).

import { Place } from '@/types/place';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { AddToTripButton } from '@/components/ui/AddToTripButton';
import { Badge } from '@/components/ui/Badge';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import { PlaceMiniMapWrapper } from '@/components/map/PlaceMiniMapWrapper';
import { useTodayKey, DayKey } from '@/hooks/useTodayKey';
import { tr } from '@/lib/i18n/tr';
import { PinIcon, TicketIcon, ClockIcon, TimerIcon, PhoneIcon, GlobeIcon, AccessibilityIcon, DirectionsIcon } from '@/components/ui/icons';

interface PlaceInfoPanelProps {
  place: Place;
}

function getTodayStatus(
  hours: Place['openingHours'],
  todayKey: DayKey | undefined
): { isOpen: boolean; label: string } | null {
  if (!hours || !todayKey) return null;
  const val = hours[todayKey];
  if (val === null) return { isOpen: false, label: tr.place.closedToday };
  if (val === undefined) return null;
  return { isOpen: true, label: `${tr.place.openToday} · ${val}` };
}

export function PlaceInfoPanel({ place }: PlaceInfoPanelProps) {
  const todayKey = useTodayKey();
  const todayStatus = getTodayStatus(place.openingHours, todayKey);

  const mapsQuery = encodeURIComponent(`${place.name}, ${place.address}`);

  const visitDuration = place.estimatedVisitMinutes
    ? tr.place.duration(place.estimatedVisitMinutes)
    : null;

  const admissionText = place.admission?.isFree
    ? tr.place.free
    : place.admission?.adultPrice !== undefined
    ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'} (${tr.place.adultPrice})${
        place.admission.childPrice !== undefined
          ? ` · ${place.admission.childPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'} (${tr.place.childPrice})`
          : ''
      }`
    : null;

  const accessibilityFeatures: string[] = [
    place.accessibility?.wheelchairAccessible ? tr.place.wheelchairAccessible : '',
    place.accessibility?.audioGuide ? tr.place.audioGuide : '',
    place.accessibility?.guidedTours ? tr.place.guidedTours : '',
  ].filter(Boolean);

  return (
    <Surface tone="surface" radius="md" as="aside" className="text-sm lg:sticky lg:top-20 lg:self-start" aria-label={tr.place.visitorInfo}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-surface-muted px-5 py-4">
        <div>
          <h2 className="font-display text-card-title font-semibold text-strong">
            {tr.place.visitorInfo}
          </h2>
          {todayStatus && (
            <p className={`mt-0.5 text-meta font-medium ${todayStatus.isOpen ? 'text-success' : 'text-subtle'}`}>
              {todayStatus.label}
            </p>
          )}
        </div>
        <Badge
          label={tr.verification[place.verificationStatus]}
          variant={place.verificationStatus === 'verified' ? 'success' : 'warning'}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 border-b border-surface-muted px-5 py-3">
        <FavoriteButton placeSlug={place.slug} placeName={place.name} large className="flex-1" />
        <AddToTripButton placeSlug={place.slug} placeName={place.name} large className="flex-1" />
      </div>

      <div className="divide-y divide-surface-muted">
        {/* Address */}
        <InfoRow label={tr.place.address} icon={<PinIcon className="h-3.5 w-3.5 shrink-0" />}>
          <span className="text-muted">{place.address}</span>
        </InfoRow>

        {/* Mini map */}
        {place.latitude && place.longitude && (
          <div className="px-5 py-4">
            <div className="h-40 w-full overflow-hidden rounded-sm border border-line">
              <PlaceMiniMapWrapper latitude={place.latitude} longitude={place.longitude} name={place.name} />
            </div>
          </div>
        )}

        {/* Admission */}
        {place.admission && (
          <InfoRow label={tr.place.admission} icon={<TicketIcon className="h-3.5 w-3.5 shrink-0" />}>
            <span className={place.admission.isFree ? 'font-medium text-success' : 'text-muted'}>
              {admissionText}
            </span>
            {place.admission.notes && (
              <p className="mt-0.5 text-meta text-subtle">{place.admission.notes}</p>
            )}
          </InfoRow>
        )}

        {/* Opening hours */}
        {place.openingHours && (
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-label font-semibold uppercase tracking-wider text-subtle">
              <ClockIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{tr.place.openingHours}</span>
            </div>
            <table className="w-full text-xs" role="table" aria-label="Haftalık açılış saatleri">
              <tbody>
                {(Object.keys(tr.days).filter((k) => !k.endsWith('Full')) as DayKey[]).map((day) => {
                  const hours = place.openingHours![day];
                  const isToday = day === todayKey;
                  return (
                    <tr key={day} className={isToday ? 'font-semibold' : ''}>
                      <td className={`w-10 py-[3px] pr-4 ${isToday ? 'text-strong' : 'text-subtle'}`}>
                        {tr.days[day]}
                        {isToday && <span className="ml-1 inline-block h-1 w-1 rounded-full bg-brand align-middle" aria-label="bugün" />}
                      </td>
                      <td className={`tabular-nums py-[3px] text-right ${hours === null ? 'text-faint' : isToday ? 'text-strong' : 'text-muted'}`}>
                        {hours === null ? tr.place.closedDay : hours ?? tr.place.unknownHoursShort}
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
          <InfoRow label={tr.place.estimatedVisit} icon={<TimerIcon className="h-3.5 w-3.5 shrink-0" />}>
            <span className="text-muted">{visitDuration}</span>
          </InfoRow>
        )}

        {/* Contact */}
        {(place.phone || place.website) && (
          <InfoRow label={tr.place.contact} icon={<PhoneIcon className="h-3.5 w-3.5 shrink-0" />}>
            <div className="space-y-1">
              {place.phone && (
                <a href={`tel:${place.phone}`} className="block text-muted hover:text-brand">
                  {place.phone}
                </a>
              )}
              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex max-w-full items-center gap-1 truncate text-brand hover:underline"
                  title={place.website}
                >
                  <GlobeIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{place.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              )}
            </div>
          </InfoRow>
        )}

        {/* Accessibility */}
        {accessibilityFeatures.length > 0 && (
          <InfoRow label={tr.place.accessibility} icon={<AccessibilityIcon className="h-3.5 w-3.5 shrink-0" />}>
            <ul className="space-y-0.5">
              {accessibilityFeatures.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-muted">
                  <span className="h-1 w-1 rounded-full bg-success" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            {place.accessibility?.notes && (
              <p className="mt-1 text-meta text-subtle">{place.accessibility.notes}</p>
            )}
          </InfoRow>
        )}
      </div>

      {/* Get directions CTA */}
      <div className="px-5 py-4">
        <Button
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="ink"
          icon={<DirectionsIcon className="h-4 w-4" />}
          className="w-full"
        >
          {tr.place.getDirections}
          <span className="sr-only">(yeni sekmede açılır)</span>
        </Button>
      </div>
    </Surface>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function InfoRow({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="px-5 py-3.5">
      <div className="mb-1 flex items-center gap-2 text-label font-semibold uppercase tracking-wider text-subtle">
        {icon}
        <span>{label}</span>
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}
