// components/home/PlanTripBand.tsx
// Closing scene — a real photograph, one clear next step. Never a giant
// generic CTA card; the photo does the emotional work, the copy stays short.

import Image from 'next/image';
import { Place } from '@/types/place';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';

interface PlanTripBandProps {
  feature: Pick<Place, 'name' | 'city' | 'image'> | null;
}

export function PlanTripBand({ feature }: PlanTripBandProps) {
  return (
    <section className="relative overflow-hidden bg-deep py-24 sm:py-32" aria-labelledby="plan-band-heading">
      {feature?.image && (
        <div className="absolute inset-0">
          <Image src={feature.image} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-deep/70" aria-hidden="true" />
        </div>
      )}
      <Container className="relative flex flex-col items-center text-center">
        <h2 id="plan-band-heading" className="max-w-xl font-display text-section-title font-semibold text-white text-balance">
          Bir günü, dakikası dakikasına planla.
        </h2>
        <p className="mt-4 max-w-md text-body leading-relaxed text-on-ink-muted text-pretty">
          Konaklamanı, süreni ve ilgi alanlarını gir; seyahat süreleri gerçek mesafelerden hesaplanmış, güne
          göre sıralanmış bir program al.
        </p>
        <div className="mt-8">
          <Button href="/gezi-planla" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
            Gezi Planlamaya Başla
          </Button>
        </div>
      </Container>
    </section>
  );
}
