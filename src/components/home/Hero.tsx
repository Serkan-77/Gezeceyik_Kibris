'use client';
// components/home/Hero.tsx
// "Cinematic Editorial" direction (see root layout's opening HTML comment
// for the full contract) — rebuilt from zero per explicit user direction,
// replacing the earlier tile-mosaic execution.
//
// Scene 1 — Arrival. One strong, full-bleed authored photograph — not a
// carousel, not a tiled grid — with a composed GSAP intro: the headline
// rises word by word from below, then the byline and actions settle in.
// The words are authored as spans at build time (never split at runtime),
// so the heading's accessible text is never touched and the page reads
// perfectly with JavaScript off — GSAP only adds motion on top of already-
// correct markup.

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Place } from '@/types/place';
import { Button } from '@/components/ui/Button';
import { IslandLineArt } from '@/components/graphics/IslandLineArt';
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
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = root.querySelectorAll<HTMLElement>('[data-word]');
    const settle = root.querySelectorAll<HTMLElement>('[data-settle]');

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 110 });
      gsap.set(settle, { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
      tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.07 }).to(
        settle,
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
        '-=0.65'
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-deep" aria-labelledby="hero-heading">
      <div className="absolute inset-0">
        {feature?.image ? (
          <Image
            src={feature.image}
            alt={`${feature.name}, ${feature.city}, Kuzey Kıbrıs`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <IslandLineArt className="h-[60%] w-[60%] text-white/20" strokeWidth={2} />
          </div>
        )}

        {/* One quiet reading scrim, left-weighted — the photo stays fully visible past ~60%. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgb(19 35 61 / 0.75) 0%, rgb(19 35 61 / 0.42) 34%, rgb(19 35 61 / 0.08) 60%, rgb(19 35 61 / 0) 82%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(0deg, rgb(19 35 61 / 0.6) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {feature && (
          <p className="absolute bottom-7 right-5 z-10 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-white/70 sm:bottom-9 sm:right-9">
            {representative && (
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] normal-case tracking-normal text-white/90 backdrop-blur-sm">
                Temsili görsel
              </span>
            )}
            <span className="font-mono">{feature.name}</span>
          </p>
        )}
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-end px-6 pb-20 pt-32 sm:px-10 sm:pb-24 lg:px-16">
        <h1
          id="hero-heading"
          className="max-w-3xl font-display text-display font-semibold leading-[0.95] tracking-tight text-white"
        >
          <span className="block overflow-hidden pb-1">
            <span data-word className="inline-block will-change-transform">
              Kuzey Kıbrıs&apos;ı
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span data-word className="inline-block italic text-white/90 will-change-transform">
              keşfet.
            </span>
          </span>
        </h1>

        <div data-settle className="mt-8 max-w-md">
          <p className="text-body leading-relaxed text-white/80 text-pretty">
            Tarihi kaleler, masmavi koylar ve saklı seyir noktaları. {placeCount} yeri keşfet,
            kendi rotanı oluştur.
          </p>
          <p className="mt-5 flex items-center gap-3 font-mono text-xs tabular-nums text-white/55">
            <span>{placeCount} yer</span>
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <span>{regionCount} bölge</span>
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <span>10.000 yıllık tarih</span>
          </p>
        </div>

        <div data-settle className="mt-9 flex flex-wrap items-center gap-4">
          <Button href="/places" size="lg" variant="primary" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Keşfet
          </Button>
          <Button href="/gezi-planla" size="lg" variant="outline-on-ink">
            Rota Oluştur
          </Button>
        </div>

        <div data-settle aria-hidden="true" className="mt-14 h-px w-16 bg-gold/70" />
      </div>
    </section>
  );
}
