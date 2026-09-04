// components/home/Hero.tsx
// Arrival. One confident full-bleed photograph, a destination statement,
// and a clear next step. Server-rendered — no client JS required for the
// entrance to look intentional; CSS-only fade-up (see globals.css).

import Image from 'next/image';
import { Place } from '@/types/place';
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
    <section className="relative overflow-hidden bg-deep" aria-labelledby="hero-heading">
      <div className="absolute inset-0">
        {feature?.image ? (
          <Image src={feature.image} alt={`${feature.name}, ${feature.city}, Kuzey Kıbrıs`} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <span className="font-display text-5xl italic text-white/15">Gezeceyik Kıbrıs</span>
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgb(13 46 66 / 0.78) 0%, rgb(13 46 66 / 0.42) 36%, rgb(13 46 66 / 0.08) 60%, rgb(13 46 66 / 0) 84%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(0deg, rgb(13 46 66 / 0.6) 0%, transparent 100%)' }}
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

      <div className="relative mx-auto flex min-h-[92dvh] max-w-[1440px] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 lg:px-16">
        <h1 id="hero-heading" data-motion="fade-up" data-enter="true" className="max-w-3xl font-display text-display font-semibold leading-[0.96] tracking-tight text-white text-balance">
          Kuzey Kıbrıs&apos;ı <span className="italic text-white/90">keşfet.</span>
        </h1>

        <div data-motion="fade-up" data-enter="true" style={{ transitionDelay: '90ms' }} className="mt-7 max-w-md">
          <p className="text-body leading-relaxed text-white/80 text-pretty">
            Tarihi kaleler, masmavi koylar ve saklı seyir noktaları. {placeCount} yeri keşfet, kendi rotanı oluştur.
          </p>
          <p className="mt-5 flex items-center gap-3 font-mono text-xs tabular-nums text-white/55">
            <span>{placeCount} yer</span>
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <span>{regionCount} bölge</span>
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <span>10.000 yıllık tarih</span>
          </p>
        </div>

        <div data-motion="fade-up" data-enter="true" style={{ transitionDelay: '160ms' }} className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/places" size="lg" variant="primary" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Keşfet
          </Button>
          <Button href="/gezi-planla" size="lg" variant="outline-on-ink">
            Rota Oluştur
          </Button>
        </div>
      </div>
    </section>
  );
}
