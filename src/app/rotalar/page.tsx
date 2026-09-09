// app/rotalar/page.tsx — Hazır Rotalar (/rotalar)
// Every published curated itinerary, browsable — never editable (see
// lib/curatedRoutes.ts and app/rotalar/[slug]/page.tsx for the detail view).

import { Metadata } from 'next';
import { getPublishedCuratedTrips } from '@/lib/curatedRoutes';
import { CuratedRouteCard } from '@/components/curated-routes/CuratedRouteCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { tr } from '@/lib/i18n/tr';

export const metadata: Metadata = {
  title: 'Hazır Rotalar: Kuzey Kıbrıs İçin Önceden Planlanmış Geziler',
  description: 'Ekibimizin önceden planladığı, gerçek mesafe ve otobüs saatleriyle hesaplanmış Kuzey Kıbrıs gezi rotaları.',
  alternates: { canonical: '/rotalar' },
  openGraph: {
    title: 'Hazır Rotalar | Gezeceyik Kıbrıs',
    description: 'Önceden planlanmış Kuzey Kıbrıs gezi rotalarını incele.',
  },
};

export const revalidate = 3600;

export default async function CuratedRoutesPage() {
  const trips = await getPublishedCuratedTrips();

  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: 'Ana Sayfa', url: '/' }, { name: tr.curatedRoutes.listTitle, url: '/rotalar' }]} />
      <div className="mt-5 max-w-2xl">
        <h1 className="font-display text-page-title leading-[0.9] text-strong text-balance">{tr.curatedRoutes.listTitle}</h1>
        <p className="mt-3 font-serif text-body leading-relaxed text-muted text-pretty">{tr.curatedRoutes.listSubtitle}</p>
      </div>

      {trips.length === 0 ? (
        <p className="mt-10 text-body-sm text-subtle">{tr.curatedRoutes.empty}</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <CuratedRouteCard key={trip.slug} trip={trip} priority={i === 0} />
          ))}
        </div>
      )}
    </Container>
  );
}
