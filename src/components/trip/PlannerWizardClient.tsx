'use client';
// components/trip/PlannerWizardClient.tsx
// 5-step wizard that collects PlannerInput and generates a TripItinerary.
// Steps: Accommodation → Duration → Transport → Interests → Pace → Result
// Wizard logic is unchanged from the original — this pass redesigns the
// presentation: a real icon system (no emoji), larger touch targets, and a
// restrained forward/back slide between steps.

import { useState } from 'react';
import { Category } from '@/types/place';
import { PlannerInput, TripItinerary } from '@/lib/trip-planner/types';
import { generateItinerary } from '@/lib/trip-planner/planner';
import { useTripSelection } from '@/hooks/useTripSelection';
import { ItineraryView } from './ItineraryView';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { tr } from '@/lib/i18n/tr';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  PinIcon,
  CarIcon,
  WalkIcon,
  BusIcon,
  CompassIcon,
} from '@/components/ui/icons';

// Preset accommodation options (city centres of KKTC)
const ACCOMMODATION_OPTIONS = [
  { label: 'Girne Merkez', city: 'Girne', lat: 35.3406, lng: 33.3193 },
  { label: 'Gazimağusa Merkez', city: 'Gazimağusa', lat: 35.1264, lng: 33.9421 },
  { label: 'Lefkoşa (Kuzey)', city: 'Lefkoşa', lat: 35.1857, lng: 33.3823 },
  { label: 'İskele / Long Beach', city: 'İskele', lat: 35.2912, lng: 33.8878 },
  { label: 'Güzelyurt Merkez', city: 'Güzelyurt', lat: 35.1985, lng: 32.9951 },
  { label: 'Lefke Merkez', city: 'Lefke', lat: 35.1157, lng: 32.8475 },
];

const TRANSPORT_OPTIONS = [
  { value: 'car', label: 'Araç', icon: CarIcon, desc: 'En esnek ulaşım' },
  { value: 'walking', label: 'Yürüyüş', icon: WalkIcon, desc: 'Kısa mesafeler için' },
  { value: 'public', label: 'Toplu Taşıma', icon: BusIcon, desc: 'Dolmuş ve otobüs' },
] as const;

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Sakin', desc: 'Günde 2 yer, derin keşif' },
  { value: 'balanced', label: 'Dengeli', desc: 'Günde 3 yer, iyi tempo' },
  { value: 'intensive', label: 'Yoğun', desc: 'Günde 4 yer, tam tur' },
] as const;

interface Props {
  categories: Category[];
}

type Step = 'accommodation' | 'duration' | 'transport' | 'interests' | 'pace' | 'result';

const STEPS: Step[] = ['accommodation', 'duration', 'transport', 'interests', 'pace', 'result'];
const STEP_LABELS = ['Konaklama', 'Süre', 'Ulaşım', 'İlgi', 'Tempo', 'Plan'];

function StepIndicator({ current }: { current: Step }) {
  const stepIdx = STEPS.indexOf(current);
  return (
    <nav aria-label="Adımlar" className="mb-8">
      <ol className="flex items-center gap-1">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-1 last:flex-none">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-[var(--duration-base)] ${
                i < stepIdx ? 'bg-brand text-white' : i === stepIdx ? 'bg-ink text-white' : 'bg-surface-muted text-subtle'
              }`}
              aria-current={i === stepIdx ? 'step' : undefined}
            >
              {i < stepIdx ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <span className={`h-px flex-1 ${i < stepIdx ? 'bg-brand' : 'bg-line'}`} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-meta text-subtle">{STEP_LABELS[stepIdx]}</p>
    </nav>
  );
}

export function PlannerWizardClient({ categories }: Props) {
  const { selected: selectedTripSlugs, hydrated: tripHydrated } = useTripSelection();
  const [step, setStep] = useState<Step>('accommodation');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [accommodationIdx, setAccommodationIdx] = useState(0);
  const [days, setDays] = useState(2);
  const [transport, setTransport] = useState<PlannerInput['transport']>('car');
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [pace, setPace] = useState<PlannerInput['pace']>('balanced');
  const [onlyFree, setOnlyFree] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);

  const accommodation = ACCOMMODATION_OPTIONS[accommodationIdx];

  function goTo(next: Step, dir: 'forward' | 'back') {
    setDirection(dir);
    setStep(next);
  }

  function handleGenerate() {
    const input: PlannerInput = {
      accommodation: {
        lat: accommodation.lat,
        lng: accommodation.lng,
        label: accommodation.label,
        city: accommodation.city,
      },
      days,
      transport,
      pace,
      preferredCategories,
      onlyFree,
      mustVisitSlugs: selectedTripSlugs,
    };
    const result = generateItinerary(input);
    setItinerary(result);
    goTo('result', 'forward');
  }

  function toggleCategory(cat: Category) {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const motionAttr = { 'data-step-motion': direction === 'forward' ? 'forward-enter' : 'back-enter' } as const;

  const choiceBase =
    'rounded-sm border px-4 py-3.5 text-left text-sm transition-colors duration-[var(--duration-fast)]';
  const choiceActive = 'border-brand bg-brand/5 font-medium text-brand';
  const choiceInactive = 'border-line text-muted hover:border-brand/40';

  if (step === 'result' && itinerary) {
    return (
      <div {...motionAttr}>
        <button
          type="button"
          onClick={() => { goTo('pace', 'back'); setItinerary(null); }}
          className="mb-6 flex items-center gap-2 text-sm text-subtle transition-colors hover:text-strong"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Yeniden Planla
        </button>
        <ItineraryView itinerary={itinerary} />
      </div>
    );
  }

  return (
    <Surface tone="surface" padding="lg" radius="md" className="mx-auto max-w-2xl">
      <StepIndicator current={step} />

      {tripHydrated && selectedTripSlugs.length > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-sm border border-brand/30 bg-brand/5 px-4 py-2.5 text-meta text-brand-strong">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>
            &quot;Geziye Ekle&quot; ile işaretlediğiniz <strong className="font-semibold">{selectedTripSlugs.length}</strong>{' '}
            yer bu planda önceliklendirilecek.
          </span>
        </div>
      )}

      {/* Step 1: Accommodation */}
      {step === 'accommodation' && (
        <div {...motionAttr}>
          <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Nerede kalıyorsunuz?</h2>
          <p className="mb-5 text-body-sm text-subtle">Konaklamanıza en yakın şehri seçin.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ACCOMMODATION_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAccommodationIdx(i)}
                className={`flex items-center gap-3 ${choiceBase} ${accommodationIdx === i ? choiceActive : choiceInactive}`}
              >
                <PinIcon className="h-4 w-4 shrink-0" />
                {opt.label}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('duration', 'forward')}>
              Devam
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Duration */}
      {step === 'duration' && (
        <div {...motionAttr}>
          <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Kaç gün gezeceksiniz?</h2>
          <p className="mb-5 text-body-sm text-subtle">Tam gün sayısını girin (1–14).</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDays(Math.max(1, days - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-line text-lg font-bold text-strong transition-colors hover:border-brand hover:text-brand"
              aria-label="Gün azalt"
            >
              −
            </button>
            <Input
              type="number"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(Math.min(14, Math.max(1, Number(e.target.value))))}
              className="w-24 text-center text-lg font-bold"
              aria-label="Gün sayısı"
            />
            <button
              type="button"
              onClick={() => setDays(Math.min(14, days + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-line text-lg font-bold text-strong transition-colors hover:border-brand hover:text-brand"
              aria-label="Gün artır"
            >
              +
            </button>
            <span className="text-sm text-subtle">gün</span>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('accommodation', 'back')}>
              Geri
            </Button>
            <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('transport', 'forward')}>
              Devam
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Transport */}
      {step === 'transport' && (
        <div {...motionAttr}>
          <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Nasıl ulaşacaksınız?</h2>
          <p className="mb-5 text-body-sm text-subtle">Birincil ulaşım aracınızı seçin.</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TRANSPORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTransport(opt.value)}
                  className={`flex flex-col items-center gap-1.5 py-5 ${choiceBase} ${transport === opt.value ? choiceActive : choiceInactive}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-[11px] text-subtle">{opt.desc}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('duration', 'back')}>
              Geri
            </Button>
            <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('interests', 'forward')}>
              Devam
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Interests */}
      {step === 'interests' && (
        <div {...motionAttr}>
          <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Neleri seviyorsunuz?</h2>
          <p className="mb-5 text-body-sm text-subtle">Birden fazla seçebilirsiniz. Boş bırakırsanız her şeyi dahil ederiz.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`${choiceBase} ${preferredCategories.includes(cat) ? choiceActive : choiceInactive}`}
              >
                {tr.categories[cat]}
              </button>
            ))}
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Yalnızca ücretsiz yerler
          </label>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('transport', 'back')}>
              Geri
            </Button>
            <Button size="lg" icon={<ArrowRightIcon className="h-4 w-4" />} onClick={() => goTo('pace', 'forward')}>
              Devam
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Pace */}
      {step === 'pace' && (
        <div {...motionAttr}>
          <h2 className="mb-1 font-display text-block-title font-semibold text-strong">Gezi temponuz?</h2>
          <p className="mb-5 text-body-sm text-subtle">Günde kaç yer görmek istiyorsunuz?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {PACE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPace(opt.value)}
                className={`flex flex-col gap-1 py-4 ${choiceBase} ${pace === opt.value ? choiceActive : choiceInactive}`}
              >
                <span className="font-semibold">{opt.label}</span>
                <span className="text-[11px] text-subtle">{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" size="lg" icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="leading" onClick={() => goTo('interests', 'back')}>
              Geri
            </Button>
            <Button size="lg" icon={<CompassIcon className="h-4 w-4" />} onClick={handleGenerate}>
              Plan Oluştur
            </Button>
          </div>
        </div>
      )}
    </Surface>
  );
}
