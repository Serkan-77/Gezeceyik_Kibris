// components/home/Hero.tsx
// Scene 1 — Arrival. A single still, cinematic photo (not a carousel):
// the hero is a confident opening frame, not a spectacle. Headline
// anchored bottom-left on the baseline grid; nav floats transparently
// over the photo above this. Blue appears exactly once here — the
// primary CTA — everything else stays on the photo's own natural color.
// Respects the same verified/representative honesty as everywhere else
// a photo appears (see PhotoTreatment) — the fallback below never invents
// a photo that isn't there.

import Image from 'next/image';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
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

  return (
    <section className="relative overflow-hidden bg-ink" aria-labelledby="hero-heading">
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
            <IslandLineArt className="h-[60%] w-[60%] text-white/25" strokeWidth={2} />
          </div>
        )}

        {/* Scrim only where the headline sits — the photo itself stays fully visible elsewhere. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgb(23 25 28 / 0.62) 0%, rgb(23 25 28 / 0.32) 38%, rgb(23 25 28 / 0.08) 62%, rgb(23 25 28 / 0) 88%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-56"
          style={{ background: 'linear-gradient(0deg, rgb(23 25 28 / 0.7) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {feature && (
          <p className="absolute bottom-6 right-4 z-10 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-white/70 sm:bottom-8 sm:right-8">
            {representative && (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] normal-case tracking-normal text-white/90">
                Temsili görsel
              </span>
            )}
            <span className="font-mono">{feature.name}</span>
          </p>
        )}
      </div>

      <Container className="relative flex min-h-[86dvh] flex-col justify-end gap-8 pb-16 pt-24 sm:pb-20 sm:pt-28">
        <div className="max-w-xl">
          <Reveal>
            <h1 id="hero-heading" className="font-display text-hero font-semibold leading-[1.0] tracking-tight text-white text-balance">
              Kuzey Kıbrıs&apos;ı
              <br />
              keşfet.
            </h1>
          </Reveal>

          <Reveal delayMs={90}>
            <p className="mt-6 max-w-md text-body leading-relaxed text-white/80 text-pretty">
              Tarihi kaleler, masmavi koylar ve saklı seyir noktaları. {placeCount} yeri keşfet,
              kendi rotanı oluştur.
            </p>

            <p className="mt-5 flex items-center gap-3 font-mono text-xs tabular-nums text-white/60">
              <span>{placeCount} yer</span>
              <span className="h-3 w-px bg-white/25" aria-hidden="true" />
              <span>{regionCount} bölge</span>
              <span className="h-3 w-px bg-white/25" aria-hidden="true" />
              <span>10.000 yıllık tarih</span>
            </p>
          </Reveal>

          <Reveal delayMs={160}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/places" size="lg" variant="primary" icon={<ArrowRightIcon className="h-4 w-4" />}>
                Keşfet
              </Button>
              <Button href="/gezi-planla" size="lg" variant="outline-on-ink">
                Rota Oluştur
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
