// components/home/HistorySection.tsx
// The "understand its history" pillar — narrative text + an era timeline.
// The companion column is a large typographic numeral, not a photograph:
// the sample dataset's stock photo IDs don't reliably depict what they're
// labeled as (see Hero.tsx), so this section leans on type as the visual
// instead of risking another false-landmark claim.

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SearchIcon, ClockIcon, DirectionsIcon } from '@/components/ui/icons';

const eras = ['Miken', 'Yunan', 'Roma', 'Bizans', 'Haçlı', 'Venedik', 'Osmanlı'];

const capabilities = [
  {
    icon: SearchIcon,
    title: 'Yerleri anında bulun',
    description: 'Altı bölgedeki müze, kale, plaj, manastır ve arkeolojik alanları arayın ve filtreleyin.',
  },
  {
    icon: ClockIcon,
    title: 'Açılış saatleri ve fiyatlar',
    description: 'Kapıda sürprizle karşılaşmayın — seyahatinizi planlamadan önce görün.',
  },
  {
    icon: DirectionsIcon,
    title: 'Çok günlü gezi planı',
    description: 'Konaklamanızı, sürenizi ve ilgi alanlarınızı girin, optimize edilmiş bir program alın.',
  },
];

export function HistorySection() {
  return (
    <section className="on-ink bg-ink py-20 sm:py-28" aria-labelledby="history-heading">
      <Reveal>
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="mb-4 text-label font-semibold uppercase tracking-[0.16em] text-brand">
            Katman Katman Bir Ada
          </p>
          <h2 id="history-heading" className="font-display text-section-title font-semibold text-white text-balance">
            10.000 yıllık tarihi tek bir yerden keşfedin
          </h2>
          <p className="mt-5 max-w-lg text-body leading-relaxed text-on-ink-muted text-pretty">
            Kıbrıs&apos;ın katmanlı geçmişi taşa işlenmiş: Miken tüccarlarından
            Osmanlı hanlarına, her dönem bugün hâlâ ziyaret edilebilen izler
            bıraktı.
          </p>

          {/* Era timeline strip */}
          <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Tarihsel dönemler, kronolojik sırayla">
            {eras.map((era, i) => (
              <li key={era} className="flex items-center gap-2">
                <span className="whitespace-nowrap rounded-sm border border-white/15 px-3 py-1.5 text-meta font-medium text-white/85">
                  {era}
                </span>
                {i < eras.length - 1 && (
                  <span className="h-px w-3 bg-white/20 sm:w-4" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>

          {/* Practical capabilities — plain rows, not boxed cards */}
          <ul className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/10 text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-body-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-body-sm leading-relaxed text-on-ink-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Companion visual — large type standing in for photography */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-center">
          <div className="sticky top-24 flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] px-8 text-center">
            <p className="font-display text-display font-bold leading-none text-white/[0.14]">10K</p>
            <p className="-mt-6 text-label font-semibold uppercase tracking-[0.2em] text-on-ink-subtle">
              Yıl Boyunca Katman Katman Tarih
            </p>
          </div>
        </div>
      </Container>
      </Reveal>
    </section>
  );
}
