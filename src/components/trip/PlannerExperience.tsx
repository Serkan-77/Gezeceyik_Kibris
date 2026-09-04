'use client';
// components/trip/PlannerExperience.tsx
// A single, progressive form — not a boxed step-by-step wizard. Every
// choice is visible at once so the visitor always understands what
// they've picked and what effect it has; generating the trip reveals the
// itinerary below without leaving the page. Real inputs only:
// accommodation (6 real presets), days (1-14), transport, pace, preferred
// categories, only-free, and must-visit slugs already chosen elsewhere
// (AddToTripButton). generateItinerary/scoring/scheduling are untouched.

import { useState } from 'react';
import { Category, Place } from '@/types/place';
import { BusRoute } from '@/types/transit';
import { PlannerInput, TripItinerary } from '@/lib/trip-planner/types';
import { generateItinerary } from '@/lib/trip-planner/planner';
import { useTripSelection } from '@/hooks/useTripSelection';
import { useSavedTrips } from '@/hooks/useSavedTrips';
import { ItineraryView } from './ItineraryView';
import { Button } from '@/components/ui/Button';
import { tr } from '@/lib/i18n/tr';
import { CarIcon, WalkIcon, BusIcon, CheckIcon } from '@/components/ui/icons';

const ACCOMMODATION_OPTIONS = [
  { label: 'Girne Merkez', city: 'Girne', lat: 35.3406, lng: 33.3193 },
  { label: 'Gazimağusa Merkez', city: 'Gazimağusa', lat: 35.1264, lng: 33.9421 },
  { label: 'Lefkoşa (Kuzey)', city: 'Lefkoşa', lat: 35.1857, lng: 33.3823 },
  { label: 'İskele / Long Beach', city: 'İskele', lat: 35.2912, lng: 33.8878 },
  { label: 'Güzelyurt Merkez', city: 'Güzelyurt', lat: 35.1985, lng: 32.9951 },
  { label: 'Lefke Merkez', city: 'Lefke', lat: 35.1157, lng: 32.8475 },
] as const;

const TRANSPORT_OPTIONS = [
  { value: 'car', label: 'Araç', icon: CarIcon },
  { value: 'walking', label: 'Yürüyüş', icon: WalkIcon },
  { value: 'public', label: 'Toplu Taşıma', icon: BusIcon },
] as const;

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Sakin', hint: '~2 durak/gün' },
  { value: 'balanced', label: 'Dengeli', hint: '~3 durak/gün' },
  { value: 'intensive', label: 'Yoğun', hint: '~4 durak/gün' },
] as const;

const choiceBase = 'rounded-md border px-4 py-3.5 text-left text-sm transition-colors duration-[var(--duration-fast)]';
const choiceActive = 'border-brand bg-brand/5 font-medium text-brand';
const choiceInactive = 'border-line text-muted hover:border-brand/40';

interface Props {
  categories: Category[];
  places: Place[];
  transitRoutes: BusRoute[];
}

export function PlannerExperience({ categories, places, transitRoutes }: Props) {
  const { selected: selectedTripSlugs, hydrated: tripHydrated } = useTripSelection();
  const { saveTrip } = useSavedTrips();
  const [savedTripId, setSavedTripId] = useState<string | null>(null);

  const [accommodationIdx, setAccommodationIdx] = useState(0);
  const [days, setDays] = useState(2);
  const [transport, setTransport] = useState<PlannerInput['transport']>('car');
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [pace, setPace] = useState<PlannerInput['pace']>('balanced');
  const [onlyFree, setOnlyFree] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);

  const accommodation = ACCOMMODATION_OPTIONS[accommodationIdx];

  function toggleCategory(c: Category) {
    setPreferredCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
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
    requestAnimationFrame(() => document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function handleSave() {
    if (!itinerary || savedTripId) return;
    setSavedTripId(saveTrip(itinerary));
  }

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="font-display text-page-title font-semibold text-strong text-balance">Gezini planla</h1>
        <p className="mt-3 text-body leading-relaxed text-muted text-pretty">
          Konaklamanı, süreni ve ilgi alanlarını seç; günlere bölünmüş, gerçek mesafelerden hesaplanmış bir
          program oluşturalım.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        <FieldGroup label="Nerede konaklıyorsun?">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {ACCOMMODATION_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAccommodationIdx(i)}
                className={`${choiceBase} ${i === accommodationIdx ? choiceActive : choiceInactive}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Kaç gün?">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDays((d) => Math.max(1, d - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg text-strong hover:border-ink"
              aria-label="Bir gün azalt"
            >
              −
            </button>
            <span className="w-20 text-center font-display text-3xl font-semibold text-strong tabular-nums">{days}</span>
            <button
              type="button"
              onClick={() => setDays((d) => Math.min(14, d + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-lg text-strong hover:border-ink"
              aria-label="Bir gün artır"
            >
              +
            </button>
            <span className="text-body-sm text-subtle">gün</span>
          </div>
        </FieldGroup>

        <FieldGroup label="Ulaşım">
          <div className="flex flex-wrap gap-2.5">
            {TRANSPORT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTransport(value)}
                className={`${choiceBase} flex items-center gap-2 ${transport === value ? choiceActive : choiceInactive}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="İlgi alanların (opsiyonel)">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className={`${choiceBase} ${preferredCategories.includes(c) ? choiceActive : choiceInactive}`}
              >
                {tr.categories[c]}
              </button>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Tempo">
          <div className="flex flex-wrap gap-2.5">
            {PACE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPace(opt.value)}
                className={`${choiceBase} ${pace === opt.value ? choiceActive : choiceInactive}`}
              >
                <span className="block">{opt.label}</span>
                <span className="block text-meta text-subtle">{opt.hint}</span>
              </button>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Bütçe">
          <button
            type="button"
            onClick={() => setOnlyFree((v) => !v)}
            aria-pressed={onlyFree}
            className={`${choiceBase} flex items-center gap-2 ${onlyFree ? choiceActive : choiceInactive}`}
          >
            {onlyFree && <CheckIcon className="h-4 w-4" />}
            Sadece ücretsiz yerler
          </button>
        </FieldGroup>

        {tripHydrated && selectedTripSlugs.length > 0 && (
          <p className="text-body-sm text-subtle">
            <span className="font-medium text-strong">{selectedTripSlugs.length} yer</span> rotana eklendi — bu yerler
            programda öncelikli olacak.
          </p>
        )}

        <Button size="lg" onClick={handleGenerate}>
          Programı Oluştur
        </Button>
      </div>

      {itinerary && (
        <div id="itinerary-result" className="mt-16 scroll-mt-20 border-t border-line pt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-section-title font-semibold text-strong">Programın hazır</h2>
            <Button variant={savedTripId ? 'ink' : 'secondary'} onClick={handleSave} disabled={!!savedTripId}>
              {savedTripId ? 'Kaydedildi ✓' : 'Geziyi Kaydet'}
            </Button>
          </div>
          <ItineraryView itinerary={itinerary} />
        </div>
      )}
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-block-title font-semibold text-strong">{label}</h2>
      {children}
    </div>
  );
}
