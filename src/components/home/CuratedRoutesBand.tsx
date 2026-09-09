// components/home/CuratedRoutesBand.tsx
// Homepage showcase for editorial "hazır rota" itineraries — a handful of
// admin-curated, real-schedule routes visitors can browse but never edit
// (see lib/curatedRoutes.ts). Renders nothing when there are none yet,
// same rule as every other homepage band built from real data.

import Link from 'next/link';
import { CuratedTrip } from '@/lib/curatedRoutes';
import { CuratedRouteCard } from '@/components/curated-routes/CuratedRouteCard';
import { Container } from '@/components/ui/Container';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { tr } from '@/lib/i18n/tr';

interface CuratedRoutesBandProps {
  trips: CuratedTrip[];
}

export function CuratedRoutesBand({ trips }: CuratedRoutesBandProps) {
  if (trips.length === 0) return null;

  return (
    <section className="border-t border-line bg-surface py-16 sm:py-24" aria-labelledby="curated-routes-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <Eyebrow>{`§05 — ${tr.curatedRoutes.sectionEyebrow}`}</Eyebrow>
            <SplitHeading
              as="h2"
              id="curated-routes-heading"
              text={tr.curatedRoutes.sectionHeading}
              className="mt-2 max-w-lg font-display text-section-title text-strong text-balance"
            />
            <p className="mt-3 max-w-md font-serif text-body leading-relaxed text-muted text-pretty">
              {tr.curatedRoutes.sectionSubtitle}
            </p>
          </div>
          {trips.length > 3 && (
            <Link
              href="/rotalar"
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.05em] text-brand hover:underline"
            >
              {tr.curatedRoutes.allRoutes}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.slice(0, 3).map((trip, i) => (
            <Reveal key={trip.slug} delayMs={i * 70}>
              <CuratedRouteCard trip={trip} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
