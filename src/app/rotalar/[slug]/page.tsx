// app/rotalar/[slug]/page.tsx — Hazır Rota Detayı (/rotalar/[slug])
// A single curated itinerary, rendered read-only with the exact same
// ItineraryView /gezi-planla uses — real schedule, real bus legs — just
// with no save/edit affordances: this route is admin-authored and fixed.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as curatedRouteRepository from '@/lib/repositories/curatedRouteRepository';
import { getPublishedCuratedTripBySlug } from '@/lib/curatedRoutes';
import { ItineraryView } from '@/components/trip/ItineraryView';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { tr } from '@/lib/i18n/tr';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const routes = await curatedRouteRepository.findPublished();
    return routes.map((route) => ({ slug: route.slug }));
  } catch (err) {
    console.warn(
      '[generateStaticParams] Could not enumerate curated route slugs at build time — building with zero ' +
        'statically pre-rendered route pages; each will render on-demand instead. ' +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
    );
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getPublishedCuratedTripBySlug(slug);
  if (!trip) return {};

  return {
    title: `${trip.title}: Hazır Rota`,
    description: trip.summary,
    alternates: { canonical: `/rotalar/${trip.slug}` },
    openGraph: {
      title: `${trip.title} | Gezeceyik Kıbrıs`,
      description: trip.summary,
      images: trip.coverImage ? [{ url: trip.coverImage }] : undefined,
    },
  };
}

export default async function CuratedRoutePage({ params }: Props) {
  const { slug } = await params;
  const trip = await getPublishedCuratedTripBySlug(slug);
  if (!trip) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { name: 'Ana Sayfa', url: '/' },
          { name: tr.curatedRoutes.listTitle, url: '/rotalar' },
          { name: trip.title, url: `/rotalar/${trip.slug}` },
        ]}
      />
      <div className="mt-5 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">{tr.curatedRoutes.sectionEyebrow}</p>
        <h1 className="mt-1 font-display text-page-title leading-[0.9] text-strong text-balance pt-[0.5em] pb-[0.22em]">{trip.title}</h1>
        <p className="mt-3 font-serif text-body leading-relaxed text-muted text-pretty">{trip.summary}</p>
      </div>

      <p className="mt-6 max-w-2xl rounded-sm border border-line bg-surface-muted px-4 py-3 text-body-sm leading-relaxed text-subtle">
        {tr.curatedRoutes.fixedNotice}
      </p>

      <div className="mt-10">
        <ItineraryView itinerary={trip.itinerary} />
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <Button href="/gezi-planla" variant="secondary">
          {tr.curatedRoutes.planYourOwn}
        </Button>
      </div>
    </Container>
  );
}
