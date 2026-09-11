// components/home/Hero.tsx
// "Kıbrıs Atlas" rebuild, dark variant. Same split masthead — headline/stats
// card at left, framed specimen-plate photo at right, atlas-style corner
// tags — but recast on the immersive-ink ground already used for the
// homepage's map band (see GeographyBand): bg-deep, a brand-blue glow, and
// the same topo contour texture inverted to white-on-dark. No new colors,
// shapes, or fonts — only tokens/patterns already established elsewhere
// on the site (bg-deep, on-ink text scale, Button's white/outline-on-ink
// variants, which already exist for exactly this "hero on dark" case).

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
    <section className="on-ink relative overflow-hidden border-b border-white/10 bg-deep" aria-labelledby="hero-heading">
      {/* Brand-blue glow (the "mavi gradyan" ask), same radial-from-a-corner
          idea as everywhere else, just brand → deep instead of white → paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 90% 65% at 22% -8%, var(--color-brand) 0%, var(--color-brand-strong) 45%, var(--color-deep) 78%)',
        }}
      />
      {/* Same chart-grid wash as before, recolored for dark: brand-bright
          lines instead of brand. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-brand-bright) 0, var(--color-brand-bright) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, var(--color-brand-bright) 0, var(--color-brand-bright) 1px, transparent 1px, transparent 48px)',
        }}
      />
      {/* Same topo-grid-black.webp asset as the paper version — inverted +
          screened so the black lines read as a faint white contour map
          instead of swapping in a new texture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45 mix-blend-screen"
        style={{ backgroundImage: 'url(/textures/topo-grid-black.webp)', filter: 'invert(1)' }}
      />
      <Container className="relative grid gap-12 pb-12 pt-10 sm:pt-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:pb-16 lg:pt-20">
        <div
          data-motion="fade-up"
          data-enter="true"
          className="relative z-10 border border-white/15 bg-deep-soft/50 p-6 backdrop-blur-sm sm:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-bright">§01 — Kuzey Kıbrıs gezi rehberi</p>

          <h1
            id="hero-heading"
            className="mt-3 font-display text-display leading-[0.86] text-white text-balance pt-[0.12em] pb-[0.28em]"
          >
            Kuzey Kıbrıs&apos;ı
            <br />
            keşfet.
          </h1>

          <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-on-ink-muted text-pretty">
            Tarihi kaleler, masmavi koylar ve saklı seyir noktaları. {placeCount} yeri keşfet, kendi rotanı
            oluştur.
          </p>

          <dl className="mt-8 flex items-end gap-6 border-t border-white/15 pt-5 sm:gap-10">
            {[
              { value: String(placeCount), label: 'yer' },
              { value: String(regionCount), label: 'bölge' },
              { value: '10.000+', label: 'yıllık tarih' },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col ${i > 0 ? 'border-l border-white/15 pl-6 sm:pl-10' : ''}`}>
                <dd className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">{stat.value}</dd>
                <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-on-ink-subtle">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/places" size="lg" variant="white" icon={<ArrowRightIcon className="h-4 w-4" />}>
              Keşfet
            </Button>
            <Button href="/gezi-planla" size="lg" variant="outline-on-ink">
              Gezi Planla
            </Button>
          </div>
        </div>

        <div data-motion="fade-up" data-enter="true" style={{ transitionDelay: '100ms' }}>
          <div className="relative">
            <div className="relative z-10 aspect-[4/5] w-full overflow-hidden border border-white/15 bg-deep-soft sm:aspect-[16/10] lg:aspect-[3/4]">
              {feature?.image ? (
                <Image src={feature.image} alt={`${feature.name}, ${feature.city}, Kuzey Kıbrıs`} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-deep-soft">
                  <span className="font-display text-2xl text-white/20">Gezeceyik</span>
                </div>
              )}

              {representative && (
                <span className="absolute left-3 top-3 border border-white/20 bg-deep/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-on-ink-subtle backdrop-blur-sm">
                  Temsili görsel
                </span>
              )}

              <span className="absolute right-3 top-3 border border-white/20 bg-deep/80 px-2.5 py-1.5 text-right font-mono text-[10px] uppercase leading-tight tracking-[0.06em] text-white backdrop-blur-sm">
                Keşfet · Hisset
                <br />
                Planla
              </span>

              {feature && (
                <span className="absolute bottom-3 left-3 max-w-[65%] truncate border border-white/20 bg-deep/80 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-white backdrop-blur-sm">
                  {feature.name}, {feature.city}
                </span>
              )}

              <span className="absolute bottom-3 right-3 hidden border border-white/20 bg-deep/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-on-ink-subtle backdrop-blur-sm sm:block">
                N35° E33° · 1:250.000
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 border border-white/15 bg-deep-soft/50 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:p-8 lg:col-span-2">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-bright">Rota planlayıcı</p>
            <p className="mt-2 font-serif text-lg leading-relaxed text-on-ink-muted text-pretty">
              Kendi rotanı rahatça oluştur. Kıbrıs&apos;ta gezmek hiç bu kadar kolay olmamıştı — en yüksek Gezeceyik
              puanlı yerleri incele, günün planını dakikalar içinde çıkar.
            </p>
          </div>
          <Button href="/rotam" size="lg" variant="outline-on-ink" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Rota Oluştur
          </Button>
        </div>
      </Container>
    </section>
  );
}
