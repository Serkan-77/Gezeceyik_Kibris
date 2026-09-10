// components/home/Hero.tsx
// "Kıbrıs Atlas" rebuild. Replaces the full-bleed gradient-scrim photo
// hero with a split masthead: headline and stats set in ink on plain
// paper at left, a large framed photograph — a specimen plate, not a
// backdrop — at right, annotated like an atlas entry with small bordered
// corner tags (place, coordinates, a call-to-action tag). Every tag reuses
// the existing border/mono/paper-chip pattern — no new shapes, colors, or
// fonts. No dark overlay, no white-on-photo body text.

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
  feature2?: HeroFeature | null;
}

export function Hero({ placeCount, regionCount, feature, feature2 }: HeroProps) {
  const representative = feature ? isImageRepresentative(feature.verificationStatus) : false;

  return (
    <section className="relative overflow-hidden border-b border-ink bg-paper" aria-labelledby="hero-heading">
      {/* Chart-grid wash: blue square grid (--color-brand) as the base
          layer, hand-drawn topographic contour lines in ink black stamped
          on top. Both existing site colors, no new ones. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-brand) 0, var(--color-brand) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, var(--color-brand) 0, var(--color-brand) 1px, transparent 1px, transparent 48px)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/textures/topo-grid-black.webp)' }}
      />
      <Container className="relative grid gap-12 pb-12 pt-10 sm:pt-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16 lg:pb-16 lg:pt-20">
        <div data-motion="fade-up" data-enter="true" className="relative z-10 border border-ink bg-paper p-6 sm:p-8">
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

          <dl className="mt-8 flex items-end gap-6 border-t border-ink pt-5 sm:gap-10">
            {[
              { value: String(placeCount), label: 'yer' },
              { value: String(regionCount), label: 'bölge' },
              { value: '10.000+', label: 'yıllık tarih' },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col ${i > 0 ? 'border-l border-ink pl-6 sm:pl-10' : ''}`}>
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
              Gezi Planla
            </Button>
          </div>
        </div>

        <div data-motion="fade-up" data-enter="true" style={{ transitionDelay: '100ms' }}>
          <div className="relative">
            {/* Second, smaller plate — offset behind the main photo, down
                and to the right, the same hard offset-duplicate motif as the
                button shadows (border-ink, no rotation, no soft SaaS blur —
                just a flat neutral drop for depth). */}
            {feature2?.image && (
              <div className="absolute -bottom-5 -right-5 z-0 hidden aspect-[4/5] w-[42%] overflow-hidden border border-ink shadow-[6px_6px_0_0_rgb(23_20_15_/_0.14)] sm:-bottom-7 sm:-right-7 sm:block sm:aspect-[16/10] lg:-bottom-10 lg:-right-10 lg:aspect-[3/4]">
                <Image
                  src={feature2.image}
                  alt={`${feature2.name}, ${feature2.city}, Kuzey Kıbrıs`}
                  fill
                  sizes="(max-width: 1024px) 30vw, 20vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="relative z-10 aspect-[4/5] w-full overflow-hidden border border-ink bg-paper sm:aspect-[16/10] lg:aspect-[3/4]">
              {feature?.image ? (
                <Image src={feature.image} alt={`${feature.name}, ${feature.city}, Kuzey Kıbrıs`} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-deep">
                  <span className="font-display text-2xl text-white/20">Gezeceyik</span>
                </div>
              )}

              {representative && (
                <span className="absolute left-3 top-3 border border-ink bg-surface/95 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-subtle">
                  Temsili görsel
                </span>
              )}

              <span className="absolute right-3 top-3 border border-ink bg-paper/95 px-2.5 py-1.5 text-right font-mono text-[10px] uppercase leading-tight tracking-[0.06em] text-strong">
                Keşfet · Hisset
                <br />
                Planla
              </span>

              {feature && (
                <span className="absolute bottom-3 left-3 max-w-[65%] truncate border border-ink bg-surface/95 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-strong">
                  {feature.name}, {feature.city}
                </span>
              )}

              <span className="absolute bottom-3 right-3 hidden border border-ink bg-surface/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-faint sm:block">
                N35° E33° · 1:250.000
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 border border-ink bg-paper p-6 sm:flex-row sm:items-center sm:p-8 lg:col-span-2">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">Rota planlayıcı</p>
            <p className="mt-2 font-serif text-lg leading-relaxed text-ink-soft text-pretty">
              Kendi rotanı rahatça oluştur. Kıbrıs&apos;ta gezmek hiç bu kadar kolay olmamıştı — en yüksek Gezeceyik
              puanlı yerleri incele, günün planını dakikalar içinde çıkar.
            </p>
          </div>
          <Button href="/rotam" size="lg" variant="secondary" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Rota Oluştur
          </Button>
        </div>
      </Container>
    </section>
  );
}
