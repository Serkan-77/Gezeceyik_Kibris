// components/home/PlannerCTA.tsx
// The "build a trip" pillar. A single, undiluted call to action (no
// duplicate "browse places" intent already covered above) paired with a
// small route preview that foreshadows the itinerary's route visualization.

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, FlagStartIcon, FlagEndIcon } from '@/components/ui/icons';

const routeStops = ['Konaklama', 'Kale', 'Müze', 'Sahil'];

export function PlannerCTA() {
  return (
    <section className="on-ink bg-ink py-20 sm:py-28" aria-labelledby="planner-cta-heading">
      <Reveal><Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="mb-3 text-label font-semibold uppercase tracking-widest text-brand">
            Gezi Planlayıcı
          </p>
          <h2 id="planner-cta-heading" className="font-display text-section-title font-semibold text-white text-balance">
            Bugün kendi Kuzey Kıbrıs planınızı oluşturun
          </h2>
          <p className="mt-4 max-w-md text-body leading-relaxed text-on-ink-muted text-pretty">
            Konaklamanızı, süreyi ve ilgi alanlarınızı girin — güne göre
            sıralanmış, seyahat süreleri hesaplanmış bir program alın.
          </p>
          <div className="mt-8">
            <Button href="/gezi-planla" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
              Gezi Planlamaya Başla
            </Button>
          </div>
        </div>

        {/* Route preview — a small taste of the itinerary's route visualization */}
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="mb-6 text-label font-semibold uppercase tracking-widest text-on-ink-subtle">
            1. Gün önizlemesi
          </p>
          <ol className="flex flex-col gap-0">
            {routeStops.map((stop, i) => {
              const isFirst = i === 0;
              const isLast = i === routeStops.length - 1;
              return (
                <li key={stop} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isFirst
                          ? 'border border-white/30 text-white/70'
                          : 'bg-brand text-white'
                      }`}
                    >
                      {isFirst ? <FlagStartIcon className="h-4 w-4" /> : isLast ? <FlagEndIcon className="h-4 w-4" /> : i}
                    </span>
                    {!isLast && <span className="my-1 h-8 w-px flex-1 bg-white/15" aria-hidden="true" />}
                  </div>
                  <p className={`pb-8 pt-1 text-sm ${isFirst ? 'text-white/60' : 'font-medium text-white'}`}>
                    {stop}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container></Reveal>
    </section>
  );
}
