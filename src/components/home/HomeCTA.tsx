// components/home/HomeCTA.tsx
// Bottom CTA — dark charcoal with orange accent, editorial tone.

import Link from 'next/link';

export function HomeCTA() {
  return (
    <section
      className="bg-[#1a1a1a] py-16 sm:py-20"
      aria-labelledby="home-cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
              Ready to explore?
            </p>
            <h2
              id="home-cta-heading"
              className="font-display text-2xl font-bold text-white sm:text-3xl"
            >
              Start discovering Cyprus today
            </h2>
            <p className="mt-3 leading-relaxed text-[#9ca3af]">
              From free ancient ruins and sea caves to world-class museums and
              Byzantine monasteries — all in one place.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/places"
              className="inline-flex items-center gap-2 rounded-sm bg-[#e8651a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9540e]"
            >
              Browse all places
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/coming-soon"
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              Plan your visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
