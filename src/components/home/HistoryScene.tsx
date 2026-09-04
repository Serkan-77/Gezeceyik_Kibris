// components/home/HistoryScene.tsx
// Scene 4 — Layers of History (revised per approval: cinematic and
// spatial, not a triptych of equal text columns). One real place and one
// real, well-documented era are paired: a split canvas — large real
// photography bled to one edge, a giant serif period label and one real
// sentence lifted verbatim from the place's own history text on the
// other — with a continuous chronology filmstrip threading both zones
// together at the base. No invented dates, eras, or metadata: the
// place/era pairing is editorial curation of real, established history
// (Büyük Han was built in 1572-73 under Ottoman rule), the same pattern
// the pre-redesign homepage already used for its excerpt picks.

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

const FEATURED_SLUG = 'buyuk-han';
const FEATURED_ERA_LABEL = 'Osmanlı';

interface HistorySceneProps {
  places: Place[];
}

export function HistoryScene({ places }: HistorySceneProps) {
  const place = places.find((p) => p.slug === FEATURED_SLUG && p.history);
  if (!place?.history) return null;

  const representative = isImageRepresentative(place.verificationStatus);
  // The place's own first real sentence — never paraphrased or invented.
  const statement = place.history.split(/(?<=[.!?])\s+/)[0];

  return (
    <section className="bg-paper" aria-labelledby="history-scene-heading">
      <div className="grid lg:grid-cols-[minmax(0,42%)_1fr]">
        <Reveal className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-0">
          <h2
            id="history-scene-heading"
            className="mb-3 font-display text-display font-bold leading-[0.9] text-strong"
          >
            {FEATURED_ERA_LABEL}
          </h2>
          <p className="max-w-md font-display text-block-title leading-relaxed text-ink-soft text-pretty">
            {statement}
          </p>
          <Link
            href={`/places/${place.slug}`}
            className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-strong transition-colors hover:text-brand"
          >
            {place.name} ↗
          </Link>
        </Reveal>

        <Reveal delayMs={80} className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
          {place.image && (
            <Image
              src={place.image}
              alt={`${place.name}, ${place.city}, Kuzey Kıbrıs`}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          )}
          {representative && (
            <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-medium text-ink-soft shadow-[var(--shadow-card)] backdrop-blur-sm">
              Temsili görsel
            </span>
          )}
        </Reveal>
      </div>

      {/* Chronology filmstrip — continuous device threading both zones together */}
      <Container className="py-8 sm:py-10">
        <div className="relative hidden sm:block">
          <div className="absolute left-0 right-0 top-2.5 h-px bg-line" aria-hidden="true" />
          <ol className="relative flex justify-between" aria-label="Tarihsel dönemler, kronolojik sırayla">
            {ERAS.map((era) => {
              const current = era.label === FEATURED_ERA_LABEL;
              return (
                <li key={era.label} className="flex flex-col items-start gap-3">
                  <span
                    className={
                      current
                        ? 'h-[11px] w-[11px] rounded-full bg-brand'
                        : 'h-[9px] w-[9px] rounded-full border-2 border-line bg-surface'
                    }
                    aria-hidden="true"
                  />
                  <span>
                    <span className={`block font-display text-base font-semibold ${current ? 'text-brand' : 'text-strong'}`}>
                      {era.label}
                    </span>
                    <span className="block font-mono text-[10px] tabular-nums text-subtle">{era.range}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <ol className="grid grid-cols-2 gap-x-5 gap-y-3 sm:hidden" aria-label="Tarihsel dönemler, kronolojik sırayla">
          {ERAS.map((era) => (
            <li key={era.label} className="flex items-baseline gap-2">
              <span
                className={`font-display text-sm font-semibold ${era.label === FEATURED_ERA_LABEL ? 'text-brand' : 'text-strong'}`}
              >
                {era.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-subtle">{era.range}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
