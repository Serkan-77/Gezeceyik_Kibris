// app/coming-soon/page.tsx — Plan Your Visit placeholder

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plan Your Visit — Coming Soon',
  description:
    'A trip planning tool for Cyprus is coming soon — combine museums, castles, beaches, and more into a personalised day plan.',
  robots: { index: false, follow: true },
};

export default function ComingSoonPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f2ee] text-3xl">
        🗺️
      </span>
      <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
        Trip planning — coming soon
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#6b7280]">
        We&apos;re building a tool that will let you combine museums, castles,
        beaches, monasteries, and more into a personalised Cyprus day plan —
        based on your location, interests, and available time.
      </p>
      <p className="mt-3 text-base text-[#9ca3af]">
        For now, browse all places and start building your own itinerary.
      </p>
      <Link
        href="/places"
        className="mt-8 inline-flex items-center gap-2 rounded bg-[#e8651a] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#c9540e]"
      >
        Explore all places →
      </Link>
    </div>
  );
}
