// components/home/Hero.tsx
// Editorial, asymmetric hero. NOTE: the sample dataset's Unsplash photo IDs
// do not reliably depict the places they're attached to (verified several
// against their actual content — landmarks in other countries entirely), so
// this hero deliberately does not feature a specific-landmark photograph
// with a named caption. A textured dark field carries the atmosphere instead;
// swap in a verified destination photo once real photography exists
// (see PRODUCT.md "Evidence on Hand").

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';

const stats = [
  { value: '24+', label: 'Seçilmiş yer' },
  { value: '6', label: 'Bölge' },
  { value: '10.000', label: 'Yıllık tarih' },
];

export function Hero() {
  return (
    <section className="on-ink relative overflow-hidden bg-ink" aria-labelledby="hero-heading">
      {/* Textured atmosphere — grain + warm brand glow, no unverified photography */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-brand/[0.14] blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-brand/[0.08] blur-[100px]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{ background: 'radial-gradient(120% 90% at 50% 100%, transparent 40%, var(--color-ink) 100%)' }}
        aria-hidden="true"
      />

      <Container className="relative flex min-h-[88svh] flex-col justify-end gap-12 pb-16 pt-28 sm:min-h-[80svh] lg:flex-row lg:items-end lg:justify-between lg:pb-20">
        {/* Text column — anchored bottom-left */}
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 text-label font-semibold uppercase tracking-[0.2em] text-brand">
            <span className="h-px w-6 bg-brand" aria-hidden="true" />
            Kuzey Kıbrıs Seyahat Rehberi
          </p>

          <h1 id="hero-heading" className="font-display text-hero font-bold text-white text-balance">
            Kuzey Kıbrıs&apos;ı <em className="not-italic text-brand">gerçekten</em> keşfedin
          </h1>

          <p className="mt-6 max-w-lg text-body leading-relaxed text-on-ink-muted text-pretty">
            Müzeler, kaleler, manastırlar ve saklı seyir noktaları — altı bölgede
            el ile seçilmiş 24+ yer, katman katman 10.000 yıllık tarih.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/places" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
              Yerleri Keşfet
            </Button>
            <Button href="/gezi-planla" size="lg" variant="outline-on-ink">
              Gezi Planla
            </Button>
          </div>
        </div>

        {/* Floating stat card — the asymmetric counterweight */}
        <div className="flex shrink-0 gap-6 rounded-lg border border-white/10 bg-white/[0.06] px-6 py-5 backdrop-blur-md sm:gap-8 lg:mb-1">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="font-display text-2xl font-bold text-white">{value}</p>
              <p className="mt-0.5 text-label uppercase tracking-wider text-on-ink-subtle">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
