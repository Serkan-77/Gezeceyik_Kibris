// app/places/[slug]/page.tsx — Place detail page (/places/[slug])
// Server Component with generateStaticParams for SSG.
// Redesigned for editorial travel-product feel.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPlaceSlugs, getPlaceBySlug, getNearbyPlaces } from '@/lib/places';
import { PlaceInfoPanel } from '@/components/places/PlaceInfoPanel';
import { PlaceGrid } from '@/components/places/PlaceGrid';
import { CategoryBadge } from '@/components/ui/Badge';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPlaceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) return {};

  return {
    title: `${place.name} — ${place.city}, Cyprus`,
    description: place.shortDescription,
    openGraph: {
      title: `${place.name} | Cyprus Discovery`,
      description: place.shortDescription,
      images: [
        {
          url: place.image,
          alt: `${place.name} — ${place.city}, Cyprus`,
        },
      ],
    },
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) notFound();

  const nearby = getNearbyPlaces(place);

  return (
    <article>
      {/* Hero image — 16:7 cinematic ratio */}
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#1a1a1a]">
        {place.image && (
          <Image
            src={place.image}
            alt={`${place.name} — ${place.city}, Cyprus`}
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
        )}
        {/* Gradient: dark at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/30 to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/50">
                <li>
                  <Link href="/" className="transition-colors hover:text-white/80">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/30">›</li>
                <li>
                  <Link href="/places" className="transition-colors hover:text-white/80">
                    Places
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/30">›</li>
                <li className="text-white/70" aria-current="page">
                  {place.name}
                </li>
              </ol>
            </nav>

            <CategoryBadge category={place.category} overlay />

            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl lg:text-5xl">
              {place.name}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {place.city}, Cyprus
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">

          {/* ── Left: editorial content ─────────────────────── */}
          <div className="min-w-0">

            {/* Lead paragraph */}
            <p className="text-lg leading-8 text-[#2d2d2d]">
              {place.description}
            </p>

            {/* History & background */}
            {place.history && (
              <section className="mt-10 border-t border-[#f5f2ee] pt-8" aria-labelledby="history-heading">
                <h2
                  id="history-heading"
                  className="mb-4 font-display text-xl font-semibold text-[#1a1a1a]"
                >
                  History & background
                </h2>
                <p className="max-w-prose leading-8 text-[#4b5563]">
                  {place.history}
                </p>
              </section>
            )}

            {/* Data disclaimer */}
            <div className="mt-10 rounded-sm border border-amber-200/60 bg-amber-50/70 px-4 py-3.5 text-sm leading-relaxed text-amber-800">
              <strong className="font-medium">Note:</strong> Opening hours,
              prices, and contact details on this page are{' '}
              <strong className="font-medium">sample data only</strong> — not
              independently verified. Always confirm with the official source
              before visiting.
              {place.sourceUrl && (
                <>
                  {' '}
                  <a
                    href={place.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-amber-900"
                  >
                    Official website ↗
                  </a>
                </>
              )}
            </div>
          </div>

          {/* ── Right: visitor information ──────────────────── */}
          <div className="lg:min-w-0">
            <PlaceInfoPanel place={place} />
          </div>
        </div>

        {/* Nearby places */}
        {nearby.length > 0 && (
          <section className="mt-16 border-t border-[#f5f2ee] pt-12" aria-labelledby="nearby-heading">
            <div className="mb-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
                In the area
              </p>
              <h2
                id="nearby-heading"
                className="font-display text-2xl font-bold text-[#1a1a1a]"
              >
                Nearby places
              </h2>
              <p className="mt-1 text-sm text-[#9ca3af]">
                Other attractions worth visiting while you&apos;re in the area.
              </p>
            </div>
            <PlaceGrid places={nearby} />
          </section>
        )}
      </div>
    </article>
  );
}
