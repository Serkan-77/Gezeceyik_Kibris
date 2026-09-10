// components/home/Hero.tsx
// "Kıbrıs Atlas" rebuild. Replaces the full-bleed gradient-scrim photo
// hero with a split masthead: headline and stats set in ink on plain
// paper at left, a single framed photograph — a specimen plate, not a
// backdrop — at right, captioned like an atlas entry. No dark overlay,
// no white-on-photo text.

import Image from 'next/image';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { isImageRepresentative } from '@/lib/format';

type HeroFeature = Pick<Place, 'name' | 'city' | 'image' | 'verificationStatus'>;

interface HeroProps {
  placeCount: number;
  regionCount: number;
  feature: HeroFeature | null;
}

export function Hero({ placeCount, regionCount, feature }: HeroProps) {
  const representative = feature ? isImageRepresentative(feature.verificationStatus) : false;

  return (
    <section className="border-b border-line bg-paper" aria-labelledby="hero-heading">
      <Container className="grid gap-12 pb-12 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16 lg:pb-16 lg:pt-20">
        <div data-motion="fade-up" data-enter="true">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§01 — Kuzey Kıbrıs gezi rehberi</p>

          <h1
            id="hero-heading"
            className="mt-3 font-display text-display leading-[0.86] text-strong text-balance pt-[0.12em] pb-[0.28em]"
          >
            Kuzey Kıbrıs&apos;ı
            <br />
            keşfet.
          </h1>

          <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-ink-soft text-pretty">
            Tarihi kaleler, masmavi koylar ve saklı seyir noktaları. {placeCount} yeri keşfet, kendi rotanı
            oluştur.
          </p>

          <dl className="mt-8 flex items-end gap-6 border-t border-line pt-5 sm:gap-10">
            {[
              { value: String(placeCount), label: 'yer' },
              { value: String(regionCount), label: 'bölge' },
              { value: '10.000+', label: 'yıllık tarih' },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col ${i > 0 ? 'border-l border-line pl-6 sm:pl-10' : ''}`}>
                <dd className="font-mono text-2xl font-semibold tabular-nums text-strong sm:text-3xl">{stat.value}</dd>
                <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/places" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
              Keşfet
            </Button>
            <Button href="/gezi-planla" size="lg" variant="secondary">
              Rota Oluştur
            </Button>
          </div>
        </div>

        <div data-motion="fade-up" data-enter="true" style={{ transitionDelay: '100ms' }}>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line sm:aspect-[16/11] lg:aspect-[4/5]">
            {feature?.image ? (
              <Image src={feature.image} alt={`${feature.name}, ${feature.city}, Kuzey Kıbrıs`} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-deep">
                <span className="font-display text-2xl text-white/20">Gezeceyik</span>
              </div>
            )}
            {representative && (
              <span className="absolute left-0 top-0 border-b border-r border-line bg-surface/95 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-subtle">
                Temsili görsel
              </span>
            )}
          </div>
          {feature && (
            <div className="flex items-center justify-between gap-3 border border-t-0 border-line bg-surface px-3 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-strong">
                {feature.name}, {feature.city}
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-faint sm:inline">N35° E33°</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
