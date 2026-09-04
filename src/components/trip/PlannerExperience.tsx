'use client';
// components/trip/PlannerExperience.tsx
// Phase 6 — the planner as journey preparation, not a form. Two things
// stay visible through every step: a growing sentence assembled from real
// answers (the progress device — no step tracker, no circles), and a
// living geographic panel on the right showing the chosen accommodation
// and any already-selected must-visit places. Every clause in the
// sentence is clickable, jumping straight back to that question.
//
// Real inputs only (Phase 9A audit): accommodation (6 real presets),
// days (1-14), transport, pace, preferred categories, only-free, and
// must-visit slugs. generateItinerary/scoring/scheduling are untouched —
// this file only changes how the same real inputs are collected.
//
// The map is an SVG device (IslandLineArt + real projected coordinates),
// not a Leaflet instance — the planner's job here is illustrative
// selection, not full pan/zoom exploration (that's /harita's job), and
// per Phase 6 Correction 1, days are represented purely temporally (a
// tick ruler) — nothing is ever drawn on the map to represent day count.

import { useState } from 'react';
import Image from 'next/image';
import { Category, Place } from '@/types/place';
import { BusRoute } from '@/types/transit';
import { PlannerInput, TripItinerary } from '@/lib/trip-planner/types';
import { generateItinerary } from '@/lib/trip-planner/planner';
import { useTripSelection } from '@/hooks/useTripSelection';
import { useSavedTrips } from '@/hooks/useSavedTrips';
import { ItineraryView } from './ItineraryView';
import { Button } from '@/components/ui/Button';
import { IslandLineArt } from '@/components/graphics/IslandLineArt';
import { projectLonLat, CYPRUS_VIEWBOX_WIDTH, CYPRUS_VIEWBOX_HEIGHT } from '@/lib/geo/cyprusOutline';
import { tr } from '@/lib/i18n/tr';
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon, CarIcon, WalkIcon, BusIcon, CompassIcon } from '@/components/ui/icons';

const ACCOMMODATION_OPTIONS = [
  { label: 'Girne Merkez', city: 'Girne', lat: 35.3406, lng: 33.3193 },
  { label: 'Gazimağusa Merkez', city: 'Gazimağusa', lat: 35.1264, lng: 33.9421 },
  { label: 'Lefkoşa (Kuzey)', city: 'Lefkoşa', lat: 35.1857, lng: 33.3823 },
  { label: 'İskele / Long Beach', city: 'İskele', lat: 35.2912, lng: 33.8878 },
  { label: 'Güzelyurt Merkez', city: 'Güzelyurt', lat: 35.1985, lng: 32.9951 },
  { label: 'Lefke Merkez', city: 'Lefke', lat: 35.1157, lng: 32.8475 },
] as const;

const TRANSPORT_OPTIONS = [
  { value: 'car', label: 'Araç', icon: CarIcon, sig: 'car' as const },
  { value: 'walking', label: 'Yürüyüş', icon: WalkIcon, sig: 'walk' as const },
  { value: 'public', label: 'Toplu Taşıma', icon: BusIcon, sig: 'public' as const },
] as const;

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Sakin', perDay: 2, gap: 'gap-3' },
  { value: 'balanced', label: 'Dengeli', perDay: 3, gap: 'gap-2' },
  { value: 'intensive', label: 'Yoğun', perDay: 4, gap: 'gap-1' },
] as const;

type Step = 'accommodation' | 'duration' | 'transport' | 'interests' | 'pace' | 'confirm' | 'result';
const STEPS: Step[] = ['accommodation', 'duration', 'transport', 'interests', 'pace', 'confirm', 'result'];
const MAX_DAYS = 14;

interface Props {
  categories: Category[];
  places: Place[];
  transitRoutes: BusRoute[];
}

function projectPercent(lon: number, lat: number) {
  const [x, y] = projectLonLat(lon, lat);
  return { left: `${(x / CYPRUS_VIEWBOX_WIDTH) * 100}%`, top: `${(y / CYPRUS_VIEWBOX_HEIGHT) * 100}%` };
}

const choiceBase = 'rounded-md border px-4 py-3.5 text-left text-sm transition-colors duration-[var(--duration-fast)]';
const choiceActive = 'border-brand bg-brand/5 font-medium text-brand';
const choiceInactive = 'border-line text-muted hover:border-brand/40';

export function PlannerExperience({ categories, places, transitRoutes }: Props) {
  const { selected: selectedTripSlugs, hydrated: tripHydrated } = useTripSelection();
  const { saveTrip } = useSavedTrips();
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('accommodation');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const [accommodationIdx, setAccommodationIdx] = useState(0);
  const [days, setDays] = useState(2);
  const [transport, setTransport] = useState<PlannerInput['transport']>('car');
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [pace, setPace] = useState<PlannerInput['pace']>('balanced');
  const [onlyFree, setOnlyFree] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);

  const accommodation = ACCOMMODATION_OPTIONS[accommodationIdx];
  const mustVisitPlaces = places.filter(
    (p) => selectedTripSlugs.includes(p.slug) && Number.isFinite(p.latitude) && Number.isFinite(p.longitude)
  );

  function goTo(next: Step, dir: 'forward' | 'back' = 'forward') {
    setDirection(dir);
    setStep(next);
  }

  function handleGenerate() {
    const input: PlannerInput = {
      accommodation: { lat: accommodation.lat, lng: accommodation.lng, label: accommodation.label, city: accommodation.city },
      days,
      transport,
      pace,
      preferredCategories,
      onlyFree,
      mustVisitSlugs: selectedTripSlugs,
    };
    const result = generateItinerary(input, places, transitRoutes);
    setItinerary(result);
    setSavedTripId(null);
    goTo('result');
  }

  function handleSaveTrip() {
    if (!itinerary || savedTripId) return;
    setSavedTripId(saveTrip(itinerary));
  }

  function toggleCategory(cat: Category) {
    setPreferredCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  if (step === 'result' && itinerary) {
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { goTo('confirm', 'back'); setItinerary(null); setSavedTripId(null); }}
            className="flex items-center gap-2 text-sm text-subtle transition-colors hover:text-strong"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Tercihleri düzenle
          </button>
          {savedTripId ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-success">
              <CheckIcon className="h-4 w-4" /> Gezilerim&apos;e kaydedildi
            </span>
          ) : (
            <Button variant="secondary" size="sm" icon={<CheckIcon className="h-4 w-4" />} onClick={handleSaveTrip}>
              Bu Geziyi Kaydet
            </Button>
          )}
        </div>
        <ItineraryView itinerary={itinerary} />
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);
  const reached = (s: Step) => stepIndex >= STEPS.indexOf(s);

  const transportLabel = TRANSPORT_OPTIONS.find((o) => o.value === transport)?.label ?? '';
  const paceOpt = PACE_OPTIONS.find((o) => o.value === pace)!;

  const clauses: { text: string; step: Step }[] = [{ text: `${accommodation.city}'de kalıyorsunuz.`, step: 'accommodation' }];
  if (reached('duration')) clauses.push({ text: `${days} gün.`, step: 'duration' });
  if (reached('transport')) clauses.push({ text: `${transportLabel.toLowerCase()} geziyorsunuz.`, step: 'transport' });
  if (reached('interests') && preferredCategories.length > 0) {
    clauses.push({ text: `${preferredCategories.map((c) => tr.categories[c]).join(', ')} ilgini çekiyor.`, step: 'interests' });
  }
  if (reached('pace')) clauses.push({ text: `${paceOpt.label.toLowerCase()} bir tempoda.`, step: 'pace' });

  const motionAttr = { 'data-step-motion': direction === 'forward' ? 'forward-enter' : 'back-enter' } as const;

  const mapPanel = (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-surface-muted">
      {step === 'interests' ? (
        (() => {
          const activeCategory = hoveredCategory ?? preferredCategories[0] ?? categories[0];
          const image = activeCategory ? places.find((p) => p.category === activeCategory && p.image)?.image : undefined;
          return image ? (
            <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-body-sm text-subtle">
              {activeCategory ? tr.categories[activeCategory] : ''}
            </div>
          );
        })()
      ) : (
        <div className="relative h-full w-full p-6">
          <IslandLineArt className="h-full w-full text-line" strokeWidth={1.75} />
          {mustVisitPlaces.map((p) => {
            const pos = projectPercent(p.longitude, p.latitude);
            return (
              <span
                key={p.slug}
                style={{ left: pos.left, top: pos.top }}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/60"
                aria-hidden="true"
              />
            );
          })}
          {ACCOMMODATION_OPTIONS.map((opt, i) => {
            const pos = projectPercent(opt.lng, opt.lat);
            const isChosen = i === accommodationIdx;
            const dimmed = step !== 'accommodation' && !isChosen;
            return step === 'accommodation' ? (
              <button
                key={opt.city}
                type="button"
                onClick={() => setAccommodationIdx(i)}
                style={{ left: pos.left, top: pos.top }}
                aria-label={opt.label}
                aria-pressed={isChosen}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[var(--duration-fast)] ${
                  isChosen ? 'h-3.5 w-3.5 bg-ink ring-4 ring-brand/25' : 'h-2 w-2 bg-brand hover:h-2.5 hover:w-2.5'
                }`}
              />
            ) : (
              <span
                key={opt.city}
                style={{ left: pos.left, top: pos.top, opacity: dimmed ? 0 : 1 }}
                aria-hidden="true"
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-[var(--duration-base)] ${
                  isChosen ? 'h-3.5 w-3.5 bg-ink ring-4 ring-brand/25' : 'h-2 w-2 bg-brand'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {tripHydrated && selectedTripSlugs.length > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-sm border border-brand/30 bg-brand/5 px-4 py-2.5 text-meta text-brand-strong">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>
            &quot;Geziye Ekle&quot; ile işaretlediğiniz <strong className="font-semibold">{selectedTripSlugs.length}</strong>{' '}
            yer bu planda önceliklendirilecek.
          </span>
        </div>
      )}

      <p className="mb-8 max-w-2xl font-display text-block-title leading-snug text-strong text-balance">
        {clauses.map((c) => (
          <button
            key={c.step}
            type="button"
            onClick={() => goTo(c.step, 'back')}
            className="mr-1.5 underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
          >
            {c.text}
          </button>
        ))}
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,38%)_1fr] lg:items-center lg:gap-14">
        <div className="order-2 lg:order-1" {...motionAttr}>
          {step === 'accommodation' && (
            <div>
              <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Nerede kalıyorsunuz?</h2>
              <p className="mb-5 text-body-sm text-subtle">Konaklamanıza en yakın şehri seçin.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ACCOMMODATION_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAccommodationIdx(i)}
                    className={`${choiceBase} ${accommodationIdx === i ? choiceActive : choiceInactive}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('duration')}>
                  Devam
                </Button>
              </div>
            </div>
          )}

          {step === 'duration' && (
            <div>
              <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Kaç gün gezeceksiniz?</h2>
              <p className="mb-5 text-body-sm text-subtle">Tam gün sayısını girin (1–{MAX_DAYS}).</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg font-bold text-strong transition-colors hover:border-brand hover:text-brand"
                  aria-label="Gün azalt"
                >
                  −
                </button>
                <span className="w-16 text-center font-mono text-3xl font-bold tabular-nums text-strong">{days}</span>
                <button
                  type="button"
                  onClick={() => setDays(Math.min(MAX_DAYS, days + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg font-bold text-strong transition-colors hover:border-brand hover:text-brand"
                  aria-label="Gün artır"
                >
                  +
                </button>
                <span className="text-sm text-subtle">gün</span>
              </div>
              <div className="relative mt-6 h-2" role="img" aria-label={`${days} / ${MAX_DAYS} gün`}>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" aria-hidden="true" />
                <div className="relative flex justify-between">
                  {Array.from({ length: MAX_DAYS }).map((_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${i < days ? 'bg-brand' : 'border-2 border-line bg-surface'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('accommodation', 'back')}>
                  Geri
                </Button>
                <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('transport')}>
                  Devam
                </Button>
              </div>
            </div>
          )}

          {step === 'transport' && (
            <div>
              <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Nasıl ulaşacaksınız?</h2>
              <p className="mb-5 text-body-sm text-subtle">Birincil ulaşım aracınızı seçin — sembolik bir işaret, gerçek bir rota çizimi değil.</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {TRANSPORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTransport(opt.value)}
                      className={`flex flex-col items-center gap-2 py-5 ${choiceBase} ${transport === opt.value ? choiceActive : choiceInactive}`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="font-semibold">{opt.label}</span>
                      <span className={`transport-sig transport-sig-${opt.sig}`} aria-hidden="true">
                        <span className="transport-sig-dot" />
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('duration', 'back')}>
                  Geri
                </Button>
                <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('interests')}>
                  Devam
                </Button>
              </div>
            </div>
          )}

          {step === 'interests' && (
            <div>
              <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Neleri seviyorsunuz?</h2>
              <p className="mb-5 text-body-sm text-subtle">Birden fazla seçebilirsiniz. Boş bırakırsanız her şeyi dahil ederiz.</p>
              <ul className="flex flex-col divide-y divide-line border-y border-line">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      onFocus={() => setHoveredCategory(cat)}
                      className={`flex w-full items-center justify-between gap-3 py-3 text-left transition-colors ${
                        preferredCategories.includes(cat) ? 'font-medium text-brand' : 'text-strong hover:text-brand'
                      }`}
                    >
                      {tr.categories[cat]}
                      {preferredCategories.includes(cat) && <CheckIcon className="h-4 w-4 shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} className="h-4 w-4 rounded-sm border-line accent-brand" />
                Yalnızca ücretsiz yerler
              </label>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('transport', 'back')}>
                  Geri
                </Button>
                <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('pace')}>
                  Devam
                </Button>
              </div>
            </div>
          )}

          {step === 'pace' && (
            <div>
              <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Gezi temponuz?</h2>
              <p className="mb-5 text-body-sm text-subtle">Günde kaç yer görmek istiyorsunuz?</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {PACE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPace(opt.value)}
                    className={`flex flex-col gap-2 py-4 ${choiceBase} ${pace === opt.value ? choiceActive : choiceInactive}`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="font-mono text-[11px] tabular-nums text-subtle">{opt.perDay} yer/gün</span>
                    <span className={`flex items-center ${opt.gap}`} aria-hidden="true">
                      {Array.from({ length: opt.perDay }).map((_, i) => (
                        <span key={i} className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('interests', 'back')}>
                  Geri
                </Button>
                <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('confirm')}>
                  Devam
                </Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Yolculuğunuz hazır.</h2>
              <p className="mb-5 text-body-sm text-subtle">Devam etmeden önce planınızı gözden geçirin.</p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-subtle">
                <span>{days} gün</span>
                <span className="h-3 w-px bg-line" aria-hidden="true" />
                <span>{paceOpt.perDay} yer/gün</span>
                <span className="h-3 w-px bg-line" aria-hidden="true" />
                <span>{preferredCategories.length > 0 ? `${preferredCategories.length} kategori` : 'tüm kategoriler'}</span>
                {onlyFree && (
                  <>
                    <span className="h-3 w-px bg-line" aria-hidden="true" />
                    <span>yalnızca ücretsiz</span>
                  </>
                )}
              </p>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('pace', 'back')}>
                  Geri
                </Button>
                <Button size="lg" icon={<CompassIcon className="h-4 w-4" />} onClick={handleGenerate}>
                  Planımı Oluştur
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="order-1 sticky top-16 z-[var(--z-sticky)] h-48 sm:h-64 lg:order-2 lg:static lg:h-[420px]">{mapPanel}</div>
      </div>
    </div>
  );
}
