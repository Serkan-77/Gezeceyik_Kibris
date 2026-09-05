// app/rotam/page.tsx — Rotam (/rotam)
// The manual route builder for the visitor's current draft (Sections 1-6
// of the route-builder spec). The draft's actual stop data comes from the
// client-side DraftRouteContext (see that file's comment for why this
// page doesn't fetch it server-side) — this Server Component only
// supplies the lightweight place list "add more places" searches over,
// which is genuinely fine to fetch here (it's the same published-places
// read every other page already does, not visitor-specific).

import { Metadata } from 'next';
import { getAllPlaces } from '@/lib/places';
import { RouteBuilderClient } from '@/components/route/RouteBuilderClient';
import { Container } from '@/components/ui/Container';
import { tr } from '@/lib/i18n/tr';

export const metadata: Metadata = {
  title: tr.route.builderTitle,
  description: tr.route.draftSubtitle,
  // The visitor's own in-progress draft, resolved from an anonymous
  // ownership cookie a crawler never holds — there is no shared, public
  // content here to index. Already excluded via robots.txt.
  robots: { index: false, follow: false },
};

export default async function RotamPage() {
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
      <h1 className="font-display text-page-title font-semibold text-strong text-balance">{tr.route.builderTitle}</h1>
      <p className="mt-3 max-w-xl text-body leading-relaxed text-muted">{tr.route.draftSubtitle}</p>
      <div className="mt-8">
        <RouteBuilderClient mode="draft" places={placesLite} />
      </div>
    </Container>
  );
}
