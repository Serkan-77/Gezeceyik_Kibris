'use client';
// components/home/HistoryScene.tsx
// "Kıbrıs Atlas" rebuild. Layers of History — cycles through real,
// well-documented eras (a genuine place per era, sourced from that
// place's own history text; no invented pairing). Miken has no genuinely
// Mycenaean-era place in the dataset yet, so it stays in the chronology
// strip as a real date range but is never one of the featured
// (clickable/auto-advancing) slides. Auto-advances every 4.5s; clicking a
// timeline era jumps straight to it and resets the timer. The photograph
// is a framed plate with its own caption strip below it, matching the
// card grammar used everywhere else — no gradient scrim, no floating
// badge chips on the image.

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
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

const ROTATION_MS = 4500;

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
  // Alternates the image side per era instead of always pinning it right —
  // reads as a livelier, less templated rhythm as the slides advance.
  const imageOnLeft = activeIdx % 2 === 1;

  return (
    <section className="border-t border-line bg-surface" aria-labelledby="history-scene-heading">
      <Container className="py-14 sm:py-20 lg:py-24">
        <div className={`grid gap-8 lg:items-center lg:gap-16 xl:gap-20 ${imageOnLeft ? 'lg:grid-cols-[1fr_minmax(0,42%)]' : 'lg:grid-cols-[minmax(0,42%)_1fr]'}`}>
        <Reveal className={`flex flex-col justify-center ${imageOnLeft ? 'lg:order-2' : 'lg:order-1'}`}>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§03 — Tarihin Katmanları · {era.range}</p>
          <h2 id="history-scene-heading" className="mt-2 font-display text-display leading-[0.86] text-strong transition-opacity duration-500">
            {era.label}
          </h2>
          <p key={place.slug} className="mt-6 max-w-md font-serif text-xl italic leading-relaxed text-ink-soft text-pretty">
            &ldquo;{statement}&rdquo;
          </p>
          <Link
            href={`/places/${place.slug}`}
            className="mt-7 inline-flex w-fit items-center gap-1.5 border-b border-brand pb-0.5 font-mono text-xs uppercase tracking-[0.05em] text-strong transition-colors hover:text-brand"
          >
            {place.name} ↗
          </Link>
        </Reveal>

        <div className={imageOnLeft ? 'lg:order-1' : 'lg:order-2'}>
          <div className="relative min-h-[320px] w-full overflow-hidden border border-line sm:min-h-[420px] lg:aspect-[4/5] lg:min-h-0">
            {/* All slide images stay mounted, stacked, and crossfade via opacity —
                swapping the <Image> itself (previously keyed by src) unmounted/
                remounted it on every era change, which reads as an instant cut
                rather than a transition ("ışınlanıyor gibi"). */}
            {slides.map((slide, i) => (
              <div
                key={slide.place.slug}
                className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)]"
                style={{ opacity: i === activeIdx ? 1 : 0 }}
                aria-hidden={i === activeIdx ? undefined : true}
              >
                {slide.place.image && (
                  <Image
                    src={slide.place.image}
                    alt={`${slide.place.name}, ${slide.place.city}, Kuzey Kıbrıs`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border border-t-0 border-line bg-surface px-3 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-strong">{place.name}</span>
            {representative && (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint">Temsili görsel</span>
            )}
          </div>
        </div>
        </div>
      </Container>

      <Container className="border-t border-line py-8 sm:py-10">
        <div className="relative hidden sm:block">
          <div className="absolute left-0 right-0 top-[5px] h-px bg-line" aria-hidden="true" />
          <ol className="relative flex justify-between" aria-label="Tarihsel dönemler, kronolojik sırayla">
            {ERAS.map((e, i) => {
              const current = e.label === era.label;
              const slideIdx = slides.findIndex((s) => s.era.label === e.label);
              const clickable = slideIdx !== -1;
              const isFirst = i === 0;
              const isLast = i === ERAS.length - 1;
              const align = isFirst ? 'items-start text-left' : isLast ? 'items-end text-right' : 'items-center text-center';
              return (
                <li key={e.label} className={`flex flex-col ${align} gap-3`}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => clickable && setActiveIdx(slideIdx)}
                    className={`flex flex-col ${align} gap-3 transition-transform duration-200 ${clickable ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'}`}
                    aria-current={current ? 'true' : undefined}
                    aria-label={e.label}
                  >
                    <span
                      className={current ? 'h-[10px] w-[10px] bg-brand ring-2 ring-offset-2 ring-brand/25 ring-offset-surface' : 'h-[8px] w-[8px] border border-line bg-surface'}
                      aria-hidden="true"
                    />
                    <span>
                      <span className={`block whitespace-nowrap font-mono text-[12px] font-semibold uppercase tracking-[0.04em] ${current ? 'text-brand' : 'text-strong'}`}>{e.label}</span>
                      <span className="block whitespace-nowrap font-mono text-[10px] tabular-nums text-subtle">{e.range}</span>
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
              <span className={`font-mono text-xs font-semibold uppercase tracking-[0.04em] ${e.label === era.label ? 'text-brand' : 'text-strong'}`}>{e.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-subtle">{e.range}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
