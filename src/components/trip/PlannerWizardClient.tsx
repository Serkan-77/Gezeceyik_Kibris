'use client';
// components/trip/PlannerWizardClient.tsx
// 5-step wizard that collects PlannerInput and generates a TripItinerary.
// Steps: Accommodation → Duration → Transport → Interests → Pace → Result

import { useState } from 'react';
import { Place } from '@/types/place';
import { Category } from '@/types/place';
import { PlannerInput, TripItinerary } from '@/lib/trip-planner/types';
import { generateItinerary } from '@/lib/trip-planner/planner';
import { ItineraryView } from './ItineraryView';

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
  { value: 'car', label: 'Araç', icon: '🚗', desc: 'En esnek ulaşım' },
  { value: 'walking', label: 'Yürüyüş', icon: '🚶', desc: 'Kısa mesafeler için' },
  { value: 'public', label: 'Toplu Taşıma', icon: '🚌', desc: 'Dolmuş ve otobüs' },
] as const;

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Sakin', desc: 'Günde 2 yer, derin keşif' },
  { value: 'balanced', label: 'Dengeli', desc: 'Günde 3 yer, iyi tempo' },
  { value: 'intensive', label: 'Yoğun', desc: 'Günde 4 yer, tam tur' },
] as const;

interface Props {
  allPlaces: Place[];
  categories: Category[];
}

type Step = 'accommodation' | 'duration' | 'transport' | 'interests' | 'pace' | 'result';

const STEPS: Step[] = ['accommodation', 'duration', 'transport', 'interests', 'pace', 'result'];

function StepIndicator({ current }: { current: Step }) {
  const stepIdx = STEPS.indexOf(current);
  const labels = ['Konaklama', 'Süre', 'Ulaşım', 'İlgi', 'Tempo', 'Plan'];
  return (
    <nav aria-label="Adımlar" className="mb-8">
      <ol className="flex items-center gap-1">
        {labels.map((label, i) => (
          <li key={label} className="flex items-center gap-1">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i < stepIdx
                  ? 'bg-[#e8651a] text-white'
                  : i === stepIdx
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-[#f5f2ee] text-[#9ca3af]'
              }`}
              aria-current={i === stepIdx ? 'step' : undefined}
            >
              {i < stepIdx ? '✓' : i + 1}
            </span>
            {i < labels.length - 1 && (
              <span className={`h-px w-6 flex-1 sm:w-10 ${i < stepIdx ? 'bg-[#e8651a]' : 'bg-[#e8e4de]'}`} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-[#9ca3af]">{labels[stepIdx]}</p>
    </nav>
  );
}

export function PlannerWizardClient({ categories }: Props) {
  const [step, setStep] = useState<Step>('accommodation');
  const [accommodationIdx, setAccommodationIdx] = useState(0);
  const [days, setDays] = useState(2);
  const [transport, setTransport] = useState<PlannerInput['transport']>('car');
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [pace, setPace] = useState<PlannerInput['pace']>('balanced');
  const [onlyFree, setOnlyFree] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);

  const accommodation = ACCOMMODATION_OPTIONS[accommodationIdx];

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
      mustVisitSlugs: [],
    };
    const result = generateItinerary(input);
    setItinerary(result);
    setStep('result');
  }

  function toggleCategory(cat: Category) {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const inputClass =
    'w-full rounded-sm border border-[#e8e4de] bg-white px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#e8651a] focus:outline-none focus:ring-1 focus:ring-[#e8651a]';

  const btnPrimary =
    'rounded-sm bg-[#e8651a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9540e] disabled:opacity-40';

  const btnSecondary =
    'rounded-sm border border-[#e8e4de] px-6 py-3 text-sm font-medium text-[#4b5563] transition-colors hover:border-[#1a1a1a]';

  if (step === 'result' && itinerary) {
    return (
      <div>
        <button
          type="button"
          onClick={() => { setStep('pace'); setItinerary(null); }}
          className="mb-6 flex items-center gap-2 text-sm text-[#9ca3af] transition-colors hover:text-[#1a1a1a]"
        >
          ← Yeniden Planla
        </button>
        <ItineraryView itinerary={itinerary} />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[#e8e4de] bg-white p-6 sm:p-8">
      <StepIndicator current={step} />

      {/* Step 1: Accommodation */}
      {step === 'accommodation' && (
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-[#1a1a1a]">Nerede kalıyorsunuz?</h2>
          <p className="mb-5 text-sm text-[#9ca3af]">Konaklamanıza en yakın şehri seçin.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ACCOMMODATION_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAccommodationIdx(i)}
                className={`flex items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                  accommodationIdx === i
                    ? 'border-[#e8651a] bg-[#e8651a]/5 font-medium text-[#e8651a]'
                    : 'border-[#e8e4de] text-[#4b5563] hover:border-[#e8651a]/40'
                }`}
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" className={btnPrimary} onClick={() => setStep('duration')}>
              Devam →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Duration */}
      {step === 'duration' && (
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-[#1a1a1a]">Kaç gün gezeceğiniz?</h2>
          <p className="mb-5 text-sm text-[#9ca3af]">Tam gün sayısını girin (1–14).</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDays(Math.max(1, days - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#e8e4de] text-lg font-bold text-[#1a1a1a] transition-colors hover:border-[#e8651a] hover:text-[#e8651a]"
              aria-label="Gün azalt"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(Math.min(14, Math.max(1, Number(e.target.value))))}
              className={`${inputClass} w-24 text-center text-lg font-bold`}
              aria-label="Gün sayısı"
            />
            <button
              type="button"
              onClick={() => setDays(Math.min(14, days + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#e8e4de] text-lg font-bold text-[#1a1a1a] transition-colors hover:border-[#e8651a] hover:text-[#e8651a]"
              aria-label="Gün artır"
            >
              +
            </button>
            <span className="text-sm text-[#9ca3af]">
              {days === 1 ? 'gün' : 'gün'}
            </span>
          </div>
          <div className="mt-6 flex justify-between">
            <button type="button" className={btnSecondary} onClick={() => setStep('accommodation')}>← Geri</button>
            <button type="button" className={btnPrimary} onClick={() => setStep('transport')}>Devam →</button>
          </div>
        </div>
      )}

      {/* Step 3: Transport */}
      {step === 'transport' && (
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-[#1a1a1a]">Nasıl ulaşacaksınız?</h2>
          <p className="mb-5 text-sm text-[#9ca3af]">Birincil ulaşım aracınızı seçin.</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TRANSPORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTransport(opt.value)}
                className={`flex flex-col items-center gap-1 rounded-sm border px-4 py-4 text-sm transition-colors ${
                  transport === opt.value
                    ? 'border-[#e8651a] bg-[#e8651a]/5 font-medium text-[#e8651a]'
                    : 'border-[#e8e4de] text-[#4b5563] hover:border-[#e8651a]/40'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-semibold">{opt.label}</span>
                <span className="text-[11px] text-[#9ca3af]">{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button type="button" className={btnSecondary} onClick={() => setStep('duration')}>← Geri</button>
            <button type="button" className={btnPrimary} onClick={() => setStep('interests')}>Devam →</button>
          </div>
        </div>
      )}

      {/* Step 4: Interests */}
      {step === 'interests' && (
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-[#1a1a1a]">Neleri seviyorsunuz?</h2>
          <p className="mb-5 text-sm text-[#9ca3af]">Birden fazla seçebilirsiniz. Boş bırakırsanız her şeyi dahil ederiz.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                  preferredCategories.includes(cat)
                    ? 'border-[#e8651a] bg-[#e8651a]/5 font-medium text-[#e8651a]'
                    : 'border-[#e8e4de] text-[#4b5563] hover:border-[#e8651a]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#4b5563]">
              <input
                type="checkbox"
                checked={onlyFree}
                onChange={(e) => setOnlyFree(e.target.checked)}
                className="h-4 w-4 rounded-sm border-[#e8e4de] accent-[#e8651a]"
              />
              Yalnızca ücretsiz yerler
            </label>
          </div>
          <div className="mt-6 flex justify-between">
            <button type="button" className={btnSecondary} onClick={() => setStep('transport')}>← Geri</button>
            <button type="button" className={btnPrimary} onClick={() => setStep('pace')}>Devam →</button>
          </div>
        </div>
      )}

      {/* Step 5: Pace */}
      {step === 'pace' && (
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-[#1a1a1a]">Gezi temponuz?</h2>
          <p className="mb-5 text-sm text-[#9ca3af]">Günde kaç yer görmek istiyorsunuz?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {PACE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPace(opt.value)}
                className={`flex flex-col gap-1 rounded-sm border px-4 py-4 text-left text-sm transition-colors ${
                  pace === opt.value
                    ? 'border-[#e8651a] bg-[#e8651a]/5 font-medium text-[#e8651a]'
                    : 'border-[#e8e4de] text-[#4b5563] hover:border-[#e8651a]/40'
                }`}
              >
                <span className="font-semibold">{opt.label}</span>
                <span className="text-[11px] text-[#9ca3af]">{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button type="button" className={btnSecondary} onClick={() => setStep('interests')}>← Geri</button>
            <button
              type="button"
              className={btnPrimary}
              onClick={handleGenerate}
            >
              Plan Oluştur 🗺
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
