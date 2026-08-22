// components/home/Hero.tsx — Editorial hero section
// Designed so a full-bleed Cyprus photograph can be added later
// without restructuring this component.

import Link from 'next/link';

const stats = [
  { value: '14+', label: 'Curated places' },
  { value: '6', label: 'Regions covered' },
  { value: '8', label: 'Categories' },
  { value: 'Free', label: 'Forever' },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#1a1a1a] py-24 sm:py-32 lg:py-40"
      aria-labelledby="hero-heading"
    >
      {/* Subtle texture / grain — purely decorative */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
        aria-hidden="true"
      />

      {/* Warm accent glow bottom-left — subtle Mediterranean warmth */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#e8651a]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
            <span className="h-px w-6 bg-[#e8651a]" aria-hidden="true" />
            Cyprus Travel Discovery
          </p>

          {/* Main headline */}
          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
          >
            Discover
            <br />
            <em className="not-italic text-[#e8651a]">the real</em>{' '}
            Cyprus.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Museums, castles, ancient theatres, monasteries, beaches, and
            hidden viewpoints — handpicked across all six regions of Cyprus.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/places"
              className="inline-flex items-center gap-2 rounded-sm bg-[#e8651a] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#c9540e] hover:shadow-[#e8651a]/20 hover:shadow-xl"
            >
              Explore all places
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/coming-soon"
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-6 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              Plan your visit
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 border-t border-white/10 pt-8">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-widest text-white/40">
                  {label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
