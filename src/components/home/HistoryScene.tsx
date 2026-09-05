'use client';
// components/home/HistoryScene.tsx
// Layers of History — cycles through real, well-documented eras (a genuine
// place per era, sourced from that place's own history text; no invented
// pairing). Miken has no genuinely Mycenaean-era place in the dataset yet,
// so it stays in the chronology strip as a real date range but is never
// one of the featured (clickable/auto-advancing) slides — showing it
// would mean fabricating a place/era match. Auto-advances every 6s;
// clicking a timeline era jumps straight to it and resets the timer.

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { isImageRepresentative } from '@/lib/format';

const ERAS: { label: string; range: string }[] = [
  { label: 'Miken', range: 'MÖ 1600-1050' },
  { label: 'Yunan', range: 'MÖ 750-58' },
  { label: 'Roma', range: 'MÖ 58-MS 330' },
  { label: 'Bizans', range: '330-1191' },
  { label: 'Lüzinyan', range: '1192-1489' },
  { label: 'Venedik', range: '1489-1571' },
  { label: 'Osmanlı', range: '1571-1878' },
];

// Real place per era, each one's own documented history text.
const FEATURED_SLUGS: Record<string, string> = {
  Yunan: 'soli-antik-kenti',
  Roma: 'salamis-antik-kenti',
  Bizans: 'st-barnabas-manastiri',
  Lüzinyan: 'bellapais-manastiri',
  Venedik: 'othello-kalesi',
  Osmanlı: 'buyuk-han',
};

const ROTATION_MS = 6000;

interface HistorySceneProps {
  places: Place[];
}

export function HistoryScene({ places }: HistorySceneProps) {
  const slides = useMemo(
    () =>
      ERAS.filter((era) => FEATURED_SLUGS[era.label])
        .map((era) => {
          const place = places.find((p) => p.slug === FEATURED_SLUGS[era.label] && p.history);
          return place ? { era, place } : null;
        })
        .filter((s): s is { era: (typeof ERAS)[number]; place: Place } => s !== null),
    [places]
  );

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % slides.length), ROTATION_MS);
    return () => clearInterval(id);
  }, [slides.length, activeIdx]);

  if (slides.length === 0) return null;
  const { era, place } = slides[activeIdx];
  const representative = isImageRepresentative(place.verificationStatus);
  const statement = place.history!.split(/(?<=[.!?])\s+/)[0];

  return (
    <section className="border-t border-line bg-surface" aria-labelledby="history-scene-heading">
      <div className="grid lg:grid-cols-[minmax(0,44%)_1fr]">
        <div className="flex flex-col justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-0 xl:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">{era.range}</p>
          <h2 id="history-scene-heading" className="mt-2 font-display text-display font-bold leading-[0.9] text-strong transition-opacity duration-500">
            {era.label}
          </h2>
          <p key={place.slug} className="mt-6 max-w-md font-display italic text-block-title leading-relaxed text-ink-soft text-pretty">
            &ldquo;{statement}&rdquo;
          </p>
          <Link
            href={`/places/${place.slug}`}
            className="mt-7 inline-flex w-fit items-center gap-1.5 border-b border-brand/40 pb-0.5 text-sm font-semibold text-strong transition-colors hover:border-brand hover:text-brand"
          >
            {place.name} ↗
          </Link>
        </div>

        <div className="relative min-h-[360px] sm:min-h-[480px] lg:min-h-[620px]">
          {/* All slide images stay mounted, stacked, and crossfade via opacity —
              swapping the <Image> itself (previously keyed by src) unmounted/
              remounted it on every era change, which reads as an instant cut
              rather than a transition ("ışınlanıyor gibi"). */}
          {slides.map((slide, i) => (
            <div
              key={slide.place.slug}
              className="absolute inset-0 transition-opacity duration-1000 ease-[var(--ease-out)]"
              style={{ opacity: i === activeIdx ? 1 : 0 }}
              aria-hidden={i === activeIdx ? undefined : true}
            >
              {slide.place.image && (
                <Image
                  src={slide.place.image}
                  alt={`${slide.place.name}, ${slide.place.city}, Kuzey Kıbrıs`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover"
                  priority={i === 0}
                />
              )}
            </div>
          ))}
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{ background: 'linear-gradient(0deg, rgb(13 46 66 / 0.5) 0%, transparent 100%)' }}
            aria-hidden="true"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {representative && (
              <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-medium text-ink-soft shadow-card">Temsili görsel</span>
            )}
            <span className="rounded-full bg-deep/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">{place.name}</span>
          </div>
        </div>
      </div>

      <Container className="py-8 sm:py-10">
        <div className="relative hidden sm:block">
          <div className="absolute left-0 right-0 top-2.5 h-px bg-line" aria-hidden="true" />
          <ol className="relative flex justify-between" aria-label="Tarihsel dönemler, kronolojik sırayla">
            {ERAS.map((e) => {
              const current = e.label === era.label;
              const slideIdx = slides.findIndex((s) => s.era.label === e.label);
              const clickable = slideIdx !== -1;
              return (
                <li key={e.label} className="flex flex-col items-start gap-3">
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => clickable && setActiveIdx(slideIdx)}
                    className={`flex flex-col items-start gap-3 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                    aria-current={current ? 'true' : undefined}
                    aria-label={e.label}
                  >
                    <span
                      className={current ? 'h-[11px] w-[11px] rounded-full bg-brand' : 'h-[9px] w-[9px] rounded-full border-2 border-line bg-surface'}
                      aria-hidden="true"
                    />
                    <span>
                      <span className={`block font-display text-base font-semibold ${current ? 'text-brand' : 'text-strong'}`}>{e.label}</span>
                      <span className="block font-mono text-[10px] tabular-nums text-subtle">{e.range}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <ol className="grid grid-cols-2 gap-x-5 gap-y-3 sm:hidden" aria-label="Tarihsel dönemler, kronolojik sırayla">
          {ERAS.map((e) => (
            <li key={e.label} className="flex items-baseline gap-2">
              <span className={`font-display text-sm font-semibold ${e.label === era.label ? 'text-brand' : 'text-strong'}`}>{e.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-subtle">{e.range}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
