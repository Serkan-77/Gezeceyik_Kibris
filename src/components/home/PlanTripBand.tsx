// components/home/PlanTripBand.tsx
// Closing scene. Deliberately the one light, warm section to close on
// before the dark footer — the two dark full-bleed photo sections before
// it (Hero, GeographyBand) already used that register, so a third in a
// row would repeat the same formula instead of closing with intent.
// The example day (computed by the same planner engine /gezi-planla
// uses, not fabricated) sits in an elevated card: copy + stats on the
// left, the actual route map on the right. Renders nothing extra when
// there's no example day to show — never a placeholder map.

import Image from 'next/image';
import { ItineraryDay, AccommodationLocation } from '@/lib/trip-planner/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { RouteMapWrapper } from '@/components/trip/RouteMapWrapper';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface PlanTripBandProps {
  exampleDay: ItineraryDay | null;
  accommodation: AccommodationLocation | null;
}

export function PlanTripBand({ exampleDay, accommodation }: PlanTripBandProps) {
  const hasExample = exampleDay && accommodation;
  // The real first stop of the real generated example day — not an
  // arbitrary "featured" photo — so the caption's claim is true.
  const firstStop = exampleDay?.stops[0]?.place ?? null;

  return (
    <section className="border-t border-line bg-paper py-20 sm:py-28" aria-labelledby="plan-band-heading">
      <Container>
        <div className={`grid gap-10 lg:gap-16 ${hasExample ? 'lg:grid-cols-[minmax(0,42%)_1fr] lg:items-center' : 'justify-items-center text-center'}`}>
          <div>
            <Eyebrow>§06 — Planlayıcı</Eyebrow>
            <SplitHeading
              as="h2"
              id="plan-band-heading"
              text="Bir günü, dakikası dakikasına planla."
              className="mt-2 max-w-md font-display text-section-title text-strong text-balance"
            />
            <Reveal delayMs={100}>
              <p className="mt-4 max-w-sm font-serif text-body leading-relaxed text-muted text-pretty">
                Konaklamanı, süreni ve ilgi alanlarını gir; seyahat süreleri gerçek mesafelerden hesaplanmış, güne
                göre sıralanmış bir program al.
              </p>
            </Reveal>
            {exampleDay && (
              <Reveal delayMs={170}>
                <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs tabular-nums text-subtle">
                  <span>~{exampleDay.totalKm} km</span>
                  <span className="h-3 w-px bg-line" aria-hidden="true" />
                  <span>{exampleDay.stops.length} durak</span>
                  <span className="h-3 w-px bg-line" aria-hidden="true" />
                  <span>tahmini</span>
                </p>
              </Reveal>
            )}
            <Reveal delayMs={230} className="mt-8">
              <Button href="/gezi-planla" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
                Gezi Planlamaya Başla
              </Button>
            </Reveal>
          </div>

          {hasExample && (
            <Reveal delayMs={140} className="relative">
              <div className="overflow-hidden border border-line bg-surface p-2 shadow-lift sm:p-3">
                <div className="h-72 w-full overflow-hidden border border-line sm:h-96 lg:h-[420px]">
                  <RouteMapWrapper day={exampleDay} accommodation={accommodation} />
                </div>
              </div>
              {firstStop?.image && (
                <div className="absolute -bottom-5 -left-5 hidden items-center gap-2.5 border border-line bg-surface py-1.5 pl-1.5 pr-3.5 shadow-lift sm:flex">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden border border-line">
                    <Image src={firstStop.image} alt="" fill sizes="36px" className="object-cover" />
                  </div>
                  <span className="font-mono text-[11px] text-muted">
                    Örnek gün <span className="font-semibold text-strong">{firstStop.name}</span> ile başlıyor
                  </span>
                </div>
              )}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
