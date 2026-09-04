// components/home/HistoryScene.tsx
// Layers of History — one real place and one real, well-documented era,
// paired as a cinematic split: a giant period label and a real sentence
// lifted verbatim from the place's own history text on one side, full-
// bleed photography on the other, with a continuous chronology strip
// threading both zones together at the base. No invented dates, eras,
// or metadata — the place/era pairing is editorial curation of real,
// established history (Büyük Han was built in 1572-73 under Ottoman
// rule).

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

const FEATURED_SLUG = 'buyuk-han';
const FEATURED_ERA_LABEL = 'Osmanlı';

interface HistorySceneProps {
  places: Place[];
}

export function HistoryScene({ places }: HistorySceneProps) {
  const place = places.find((p) => p.slug === FEATURED_SLUG && p.history);
  if (!place?.history) return null;

  const representative = isImageRepresentative(place.verificationStatus);
  const statement = place.history.split(/(?<=[.!?])\s+/)[0];
  const featuredEra = ERAS.find((e) => e.label === FEATURED_ERA_LABEL);

  return (
    <section className="bg-paper" aria-labelledby="history-scene-heading">
      <div className="grid lg:grid-cols-[minmax(0,44%)_1fr]">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-0 xl:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">{featuredEra?.range}</p>
          <h2 id="history-scene-heading" className="mt-2 font-display text-display font-bold leading-[0.9] text-strong">
            {FEATURED_ERA_LABEL}
          </h2>
          <p className="mt-6 max-w-md font-display italic text-block-title leading-relaxed text-ink-soft text-pretty">
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
          {place.image && (
            <Image src={place.image} alt={`${place.name}, ${place.city}, Kuzey Kıbrıs`} fill sizes="(max-width: 1024px) 100vw, 56vw" className="object-cover" />
          )}
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
            {ERAS.map((era) => {
              const current = era.label === FEATURED_ERA_LABEL;
              return (
                <li key={era.label} className="flex flex-col items-start gap-3">
                  <span
                    className={current ? 'h-[11px] w-[11px] rounded-full bg-brand' : 'h-[9px] w-[9px] rounded-full border-2 border-line bg-surface'}
                    aria-hidden="true"
                  />
                  <span>
                    <span className={`block font-display text-base font-semibold ${current ? 'text-brand' : 'text-strong'}`}>{era.label}</span>
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
              <span className={`font-display text-sm font-semibold ${era.label === FEATURED_ERA_LABEL ? 'text-brand' : 'text-strong'}`}>{era.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-subtle">{era.range}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
