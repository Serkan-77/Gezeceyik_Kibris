// app/rotam/[id]/page.tsx — a saved route reopened for editing
// (Section 10 — "open saved route" from Gezilerim). Ownership-checked:
// getRouteForOwner returns null both when the route doesn't exist AND
// when it belongs to someone else, so a guess at another visitor's route
// id 404s exactly like a typo would, revealing nothing about who owns it.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAnonId } from '@/lib/identity/anon';
import { getRouteForOwner } from '@/lib/repositories/routeRepository';
import { getAllPlaces } from '@/lib/places';
import { RouteBuilderClient } from '@/components/route/RouteBuilderClient';
import { Container } from '@/components/ui/Container';
import { tr } from '@/lib/i18n/tr';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: tr.route.editRoute,
  // A specific visitor's saved route, ownership-checked against their
  // anonymous cookie — never shared, public content. Route ids are also
  // never listed in the sitemap (see app/sitemap.ts).
  robots: { index: false, follow: false },
};

export default async function SavedRoutePage({ params }: Props) {
  const { id } = await params;
  const ownerId = await getAnonId();
  const route = ownerId ? await getRouteForOwner(id, ownerId) : null;
  if (!route) notFound();

  const places = await getAllPlaces();
  const placesLite = places.map(({ id, slug, name, image, city, region, category, latitude, longitude, verificationStatus }) => ({
    id,
    slug,
    name,
    image,
    city,
    region,
    category,
    latitude,
    longitude,
    verificationStatus,
  }));

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-display text-page-title font-semibold text-strong text-balance">
        {route.name ?? tr.route.unnamedRoute}
      </h1>
      <p className="mt-3 max-w-xl text-body leading-relaxed text-muted">{tr.route.stopCount(route.stops.length)}</p>
      <div className="mt-8">
        <RouteBuilderClient mode="saved" initialRoute={route} places={placesLite} />
      </div>
    </Container>
  );
}
