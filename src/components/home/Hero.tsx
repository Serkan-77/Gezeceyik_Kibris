'use client';
// components/home/Hero.tsx
// THE SIGNATURE MOMENT — fourth rebuild, "Smooth Mediterranean Futurism."
// The previous hero (an ink-line coastline chart dominating half the
// viewport, hard scrim, word-mask type rise) is gone as a COMPOSITION,
// not just a palette — that was archive/survey language, which this
// direction explicitly rejects. What replaces it: full-bleed cinematic
// photography with a slow continuous drift (never a hard cut), soft
// layered aqua/brand light blooms for atmosphere and depth, a blur-to-
// focus headline reveal (fluid, not a mechanical rise), and the real
// Cyprus coastline (lib/geo/cyprusOutline.ts — same real geometry /harita
// and GeographyBand use) reduced to a small glowing wayfinding mark in
// the corner — a detail that signals "this product knows the geography,"
// not a chart covering the screen. Every place dot on it is still real.
// transform/opacity/filter only; fully visible with no JS and under
// prefers-reduced-motion (see globals.css).

import { useEffect, useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, CompassIcon, BusIcon } from '@/components/ui/icons';
import { isImageRepresentative } from '@/lib/format';
import { CYPRUS_PATH, CYPRUS_VIEWBOX, projectLonLat } from '@/lib/geo/cyprusOutline';

type HeroFeature = Pick<Place, 'name' | 'city' | 'image' | 'verificationStatus'>;
type HeroPin = Pick<Place, 'slug' | 'name' | 'latitude' | 'longitude' | 'featured'>;

interface HeroProps {
  placeCount: number;
  regionCount: number;
  feature: HeroFeature | null;
  places: HeroPin[];
  transitRouteCount: number;
}

export function Hero({ placeCount, regionCount, feature, places, transitRouteCount }: HeroProps) {
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setEnter(true));
  }, []);

  const representative = feature ? isImageRepresentative(feature.verificationStatus) : false;
  const featuredPins = places.filter((p) => p.featured && Number.isFinite(p.latitude) && Number.isFinite(p.longitude)).slice(0, 12);

  return (
    <section
      className="on-ink relative isolate -mt-16 min-h-[100svh] overflow-hidden bg-deep lg:-mt-20"
      aria-labelledby="hero-heading"
    >
      {/* ── Photography: full-bleed, slow continuous drift ── */}
      <div className="absolute inset-0" data-motion="fade" data-enter={enter}>
        {feature?.image ? (
          <SafeImage
            src={feature.image}
            alt={`${feature.name}, ${feature.city}, Kuzey Kıbrıs`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_30%] md:object-[68%_50%]"
            style={{ animation: 'hero-drift 26s ease-in-out infinite alternate' }}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,var(--color-brand-strong),var(--color-deep)_75%)]" />
        )}
        {/* Soft layered atmosphere instead of a hard directional scrim —
            two overlapping radial blooms (brand + aqua) plus a gentle
            bottom-to-top fade so type stays legible without flattening
            the photo into a silhouette. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 60% at 18% 85%, color-mix(in oklab, var(--color-deep) 92%, transparent) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 85% 10%, color-mix(in oklab, var(--color-aqua) 22%, transparent) 0%, transparent 65%), linear-gradient(0deg, var(--color-deep) 0%, color-mix(in oklab, var(--color-deep) 55%, transparent) 32%, transparent 60%)',
          }}
        />
      </div>

      {/* Dedicated header-legibility scrim — the transparent header (see
          Navbar.tsx) needs this photo darkened at the very top regardless
          of what's in frame there (a bright sky, pale sand); the softer
          atmosphere gradient above isn't reliably dark enough on its own.
          Always present (not gated by `enter`) so the header is readable
          from the very first paint, animation or not. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-36"
        style={{ backgroundImage: 'linear-gradient(180deg, color-mix(in oklab, var(--color-deep) 75%, transparent) 0%, transparent 100%)' }}
      />

      {/* ── Small glowing wayfinding mark — the real coastline, real
          featured places, tucked in a corner as a detail rather than
          the dominant graphic. Anchored top-right (not bottom-right) so
          it never collides with the content below, which now grows with
          the planner/transport card pair. ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-24 hidden w-[180px] opacity-70 sm:block lg:right-8 lg:top-28 lg:w-[220px]"
        style={{ filter: 'drop-shadow(0 0 16px color-mix(in oklab, var(--color-aqua) 50%, transparent))' }}
      >
        <svg viewBox={CYPRUS_VIEWBOX} className="h-auto w-full" fill="none">
          <path
            d={CYPRUS_PATH}
            pathLength={1}
            data-hero-coastline
            data-enter={enter}
            stroke="var(--color-aqua)"
            strokeWidth={2.2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {featuredPins.map((p, i) => {
            const [x, y] = projectLonLat(p.longitude, p.latitude);
            return (
              <circle
                key={p.slug}
                data-marker-enter
                style={{ animationDelay: `${900 + i * 60}ms`, transformOrigin: `${x}px ${y}px` }}
                cx={x}
                cy={y}
                r={7}
                fill="var(--color-sand)"
              />
            );
          })}
        </svg>
      </div>

      {/* ── Content ── */}
      <Container className="relative z-10 pb-14 pt-28 sm:pb-16 sm:pt-32">
        <span
          data-motion="fade"
          data-enter={enter}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-on-ink-muted backdrop-blur-md"
        >
          §01 — Kuzey Kıbrıs gezi rehberi
        </span>

        <h1
          id="hero-heading"
          data-motion="blur-in"
          data-enter={enter}
          style={{ transitionDelay: '80ms' }}
          className="mt-6 max-w-4xl font-display text-display leading-[0.92] text-on-ink-strong text-balance pb-[0.12em]"
        >
          Kuzey Kıbrıs&rsquo;ı <span className="font-display-accent">keşfet.</span>
        </h1>

        <p
          data-motion="fade-up"
          data-enter={enter}
          style={{ transitionDelay: '220ms' }}
          className="mt-8 max-w-md text-lg leading-relaxed text-on-ink-muted text-pretty"
        >
          Tarihi kaleler, masmavi koylar ve saklı seyir noktaları — {placeCount} yeri kendi elinle işaretle,
          rotanı çiz.
        </p>

        {/* Stats, folded into a quiet inline row instead of a separate
            floating bar competing with the cards below. */}
        <div
          data-motion="fade-up"
          data-enter={enter}
          style={{ transitionDelay: '280ms' }}
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-on-ink-subtle"
        >
          <span><span className="font-display text-sm normal-case tracking-normal text-on-ink-strong">{placeCount}</span> yer</span>
          <span aria-hidden="true">·</span>
          <span><span className="font-display text-sm normal-case tracking-normal text-on-ink-strong">{regionCount}</span> bölge</span>
          <span aria-hidden="true">·</span>
          <span><span className="font-display text-sm normal-case tracking-normal text-on-ink-strong">10.000+</span> yıllık tarih</span>
          {feature && (
            <span className="hidden sm:inline">
              {representative && <span className="text-on-ink-subtle">· Temsili: </span>}
              {!representative && <span aria-hidden="true">·</span>} {feature.name}, {feature.city}
            </span>
          )}
        </div>

        <div
          data-motion="fade-up"
          data-enter={enter}
          style={{ transitionDelay: '340ms' }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Button href="/places" size="lg" variant="white" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Keşfet
          </Button>
          <Button href="/gezi-planla" size="lg" variant="outline-on-ink">
            Gezi Planla
          </Button>
        </div>

        {/* ── Rota Planlayıcı + Ulaşım — the same two entry points as the
            old hero's route-planner band, now a matched glass card pair
            still inside the immersive dark scene rather than handed off
            to a separate white section right below it. ── */}
        <div
          data-motion="fade-up"
          data-enter={enter}
          style={{ transitionDelay: '440ms' }}
          className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2"
        >
          <a
            href="/gezi-planla"
            className="group flex flex-col justify-between gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl transition-[background-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:bg-white/15 sm:p-7"
          >
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-on-ink-strong">
                <CompassIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-xl leading-tight text-on-ink-strong">Rota Planlayıcı</h2>
              <p className="mt-2 max-w-sm text-body-sm leading-relaxed text-on-ink-muted">
                Kendi rotanı rahatça oluştur — en yüksek Gezeceyik puanlı yerleri incele, günün planını
                dakikalar içinde çıkar.
              </p>
            </div>
            <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-brand-bright">
              Planlamaya başla
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>

          <a
            href="/ulasim"
            className="group flex flex-col justify-between gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl transition-[background-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:bg-white/15 sm:p-7"
          >
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-on-ink-strong">
                <BusIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-xl leading-tight text-on-ink-strong">Ulaşım</h2>
              <p className="mt-2 max-w-sm text-body-sm leading-relaxed text-on-ink-muted">
                Şehirlerarası otobüs/dolmuş seferleri: {transitRouteCount} hat için gerçek kalkış saatleri,
                ücretler ve duraklar.
              </p>
            </div>
            <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-brand-bright">
              Sefer saatlerini gör
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
