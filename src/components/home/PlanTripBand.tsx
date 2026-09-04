// components/home/PlanTripBand.tsx
// Closing scene — the dimmed photo stays (real emotional ground), but a
// real example day (computed by the same planner engine /gezi-planla
// uses, not fabricated) sits on top: copy + stats on the left, the
// actual route map on the right. Renders nothing extra when there's no
// example day to show — never a placeholder map.

import Image from 'next/image';
import { Place } from '@/types/place';
import { ItineraryDay, AccommodationLocation } from '@/lib/trip-planner/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { RouteMapWrapper } from '@/components/trip/RouteMapWrapper';
import { ArrowRightIcon } from '@/components/ui/icons';

interface PlanTripBandProps {
  feature: Pick<Place, 'name' | 'city' | 'image'> | null;
  exampleDay: ItineraryDay | null;
  accommodation: AccommodationLocation | null;
}

export function PlanTripBand({ feature, exampleDay, accommodation }: PlanTripBandProps) {
  return (
    <section className="relative overflow-hidden bg-deep py-20 sm:py-28" aria-labelledby="plan-band-heading">
      {feature?.image && (
        <div className="absolute inset-0">
          <Image src={feature.image} alt="" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-deep/75" aria-hidden="true" />
        </div>
      )}
      <Container className="relative">
        <div className={`grid gap-10 ${exampleDay && accommodation ? 'lg:grid-cols-[minmax(0,44%)_1fr] lg:items-center' : 'justify-items-center text-center'}`}>
          <div>
            <h2 id="plan-band-heading" className="max-w-md font-display text-section-title font-semibold text-white text-balance">
              Bir günü, dakikası dakikasına planla.
            </h2>
            <p className="mt-4 max-w-sm text-body leading-relaxed text-on-ink-muted text-pretty">
              Konaklamanı, süreni ve ilgi alanlarını gir; seyahat süreleri gerçek mesafelerden hesaplanmış, güne
              göre sıralanmış bir program al.
            </p>
            {exampleDay && (
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs tabular-nums text-on-ink-subtle">
                <span>~{exampleDay.totalKm} km</span>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <span>{exampleDay.stops.length} durak</span>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <span>tahmini</span>
              </p>
            )}
            <div className="mt-8">
              <Button href="/gezi-planla" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
                Gezi Planlamaya Başla
              </Button>
            </div>
          </div>

          {exampleDay && accommodation && (
            <div className="h-72 w-full overflow-hidden rounded-lg border border-white/15 shadow-ink sm:h-96 lg:h-[420px]">
              <RouteMapWrapper day={exampleDay} accommodation={accommodation} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
