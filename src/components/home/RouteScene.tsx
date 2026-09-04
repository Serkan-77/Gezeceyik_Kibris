// components/home/RouteScene.tsx
// Scene 5 — Plan Your Route (revised per approval: route line + real
// geography + real stops in one composition, not just a horizontal line
// with numbers). Real curated stops, real haversine-computed distance and
// time (the same helpers the actual planner uses), drawn on a real light
// map. Metrics are explicitly marked "tahmini" — this is an estimate, not
// road-routed precision (see distance.ts / Route Language rules).

import { Place } from '@/types/place';
import { haversineKm, drivingMinutes } from '@/lib/trip-planner/distance';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { RouteSceneMapWrapper } from './RouteSceneMapWrapper';
import type { RouteSceneStop } from './RouteSceneMap';

const ROUTE_SLUGS = ['girne-kalesi', 'bellapais-manastiri', 'st-hilarion-kalesi'];
const START_HOUR = 9;

function formatClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

interface RouteSceneProps {
  places: Place[];
}

export function RouteScene({ places }: RouteSceneProps) {
  const chosen = ROUTE_SLUGS.map((slug) => places.find((p) => p.slug === slug)).filter(
    (p): p is Place => Boolean(p)
  );
  if (chosen.length < 2) return null;

  const stops: RouteSceneStop[] = [];
  let totalKm = 0;
  {
    let clock = START_HOUR * 60;
    for (let i = 0; i < chosen.length; i++) {
      const place = chosen[i];
      stops.push({
        slug: place.slug,
        name: place.name,
        lat: place.latitude,
        lng: place.longitude,
        arrivalTime: formatClock(clock),
      });
      clock += place.estimatedVisitMinutes ?? 60;
      const next = chosen[i + 1];
      if (next) {
        const from = { lat: place.latitude, lng: place.longitude };
        const to = { lat: next.latitude, lng: next.longitude };
        totalKm += haversineKm(from, to);
        clock += drivingMinutes(from, to);
      }
    }
  }

  return (
    <section className="bg-paper py-14 sm:py-20" aria-labelledby="route-scene-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,38%)_1fr] lg:items-center lg:gap-14">
          <Reveal>
            <h2 id="route-scene-heading" className="font-display text-section-title font-semibold text-strong text-balance">
              Bir günü, dakikası dakikasına planlayın
            </h2>
            <p className="mt-5 max-w-md text-body leading-relaxed text-muted text-pretty">
              Konaklamanızı, süreyi ve ilgi alanlarınızı girin, seyahat süreleri gerçek
              mesafelerden hesaplanmış, güne göre sıralanmış bir program alın.
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-subtle">
              <span>~{Math.round(totalKm * 10) / 10} km</span>
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              <span>{stops.length} durak</span>
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              <span>tahmini</span>
            </p>
            <div className="mt-8">
              <Button href="/gezi-planla" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
                Gezi Planlamaya Başla
              </Button>
            </div>
          </Reveal>

          <Reveal delayMs={100} className="h-72 w-full overflow-hidden rounded-lg border border-line sm:h-96">
            <RouteSceneMapWrapper stops={stops} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
