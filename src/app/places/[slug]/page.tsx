// app/places/[slug]/page.tsx — Yer Detay Sayfası (/places/[slug])
// Server Component with generateStaticParams for SSG. Cinematic
// photography-led hero → data-adaptive essentials strip → editorial
// history essay → real geographic context → nearby places as journey
// continuation.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { getAllPlaceSlugs, getPlaceBySlug, getNearbyPlaces } from '@/lib/places';
import { PlaceEssentials } from '@/components/places/PlaceEssentials';
import { PlaceHistoryEssay } from '@/components/places/PlaceHistoryEssay';
import { PlaceOpenStatus } from '@/components/places/PlaceOpenStatus';
import { DiscoveryRow } from '@/components/places/DiscoveryRow';
import { MobileActionBar } from '@/components/places/MobileActionBar';
import { PlaceGeoContextWrapper } from '@/components/map/PlaceGeoContextWrapper';
import { PlaceRatingWidget } from '@/components/rating/PlaceRatingWidget';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { tr } from '@/lib/i18n/tr';
import { isImageRepresentative } from '@/lib/format';
import { getRatingSummary, getRatingAggregates } from '@/lib/repositories/ratingRepository';
import { touristAttractionSchema } from '@/lib/seo/structuredData';
import { Category } from '@/types/place';

// Only 4 categories have a dedicated landing page today (see src/app/{museums,castles,beaches,historical-places}/page.tsx).
// Everything else links into /places filtered by category — a real,
// working URL, just not a standalone page of its own.
const CATEGORY_URLS: Partial<Record<Category, string>> = {
  Museum: '/museums',
  Castle: '/castles',
  Beach: '/beaches',
  'Historical Place': '/historical-places',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPlaceSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.warn(
      '[generateStaticParams] Could not enumerate place slugs at build time — building with zero ' +
        'statically pre-rendered place pages; each will render on-demand at request time instead. ' +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
    );
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return {};

  return {
    title: `${place.name}, ${place.city}, Kuzey Kıbrıs`,
    description: place.shortDescription,
    alternates: { canonical: `/places/${slug}` },
    openGraph: {
      title: `${place.name} | Gezeceyik Kıbrıs`,
      description: place.shortDescription,
      images: [{ url: place.image, alt: `${place.name}, ${place.city}, Kuzey Kıbrıs` }],
    },
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const nearby = await getNearbyPlaces(place);
  // voterId omitted (null) — this page is statically generated for all
  // 121 places (generateStaticParams + revalidate=3600) and must not
  // become visitor-specific; only the public average/count belong here.
  // The visitor's own rating is fetched client-side — see PlaceRatingWidget.
  const ratingSummary = await getRatingSummary(place.id, null).catch((err) => {
    console.warn(`[places/${place.slug}] rating summary unavailable, showing zero-state:`, err instanceof Error ? err.message : err);
    return { average: undefined, count: 0, myRating: null };
  });
  const nearbyRatingsRaw = await getRatingAggregates(nearby.slice(0, 4).map((p) => p.id)).catch((err) => {
    console.warn(`[places/${place.slug}] nearby ratings unavailable:`, err instanceof Error ? err.message : err);
    return new Map<string, { average: number | undefined; count: number }>();
  });
  const nearbyRatings = new Map(
    [...nearbyRatingsRaw].filter((entry): entry is [string, { average: number; count: number }] => entry[1].average !== undefined)
  );
  const representative = isImageRepresentative(place.verificationStatus);
  const hasLocation = Number.isFinite(place.latitude) && Number.isFinite(place.longitude);
  const nearbyPoints = nearby
    .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    .map((p) => ({ slug: p.slug, name: p.name, lat: p.latitude, lng: p.longitude }));

  return (
    <article className="pb-20 lg:pb-0">
      <Container className="pt-5">
        <Breadcrumbs
          items={[
            { name: 'Ana Sayfa', url: '/' },
            { name: 'Yerler', url: '/places' },
            { name: tr.categories[place.category], url: CATEGORY_URLS[place.category] ?? `/places?category=${encodeURIComponent(place.category)}` },
            { name: place.name, url: `/places/${place.slug}` },
          ]}
        />
      </Container>
      <JsonLd data={touristAttractionSchema(place, ratingSummary)} />

      {/* Full-bleed cinematic banner — entering the place, not opening a
          database record. Same recipe as the homepage Hero (photo + ink
          scrim + overlaid Fraunces headline) so a place page reads as
          part of the same world, not a different template. */}
      <section className="on-ink relative mx-3 mt-5 h-[56vh] max-h-[640px] min-h-[400px] overflow-hidden rounded-3xl bg-deep sm:mx-4 sm:h-[62vh] lg:mx-6">
        {place.image ? (
          <SafeImage
            src={place.image}
            alt={`${place.name}, ${place.city}, Kuzey Kıbrıs`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl text-white/20">Gezeceyik Kıbrıs</span>
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(0deg, var(--color-deep) 0%, color-mix(in oklab, var(--color-deep) 55%, transparent) 38%, transparent 68%)' }}
        />
        <Container className="absolute inset-x-0 bottom-0 pb-6 sm:pb-9">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-brand-bright">
            <span>§01 — {tr.categories[place.category]}</span>
            {representative && place.image && <span className="text-on-ink-subtle">· Temsili görsel</span>}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-hero leading-[0.86] text-on-ink-strong text-balance pt-[0.2em] pb-[0.15em]">{place.name}</h1>
          <p className="mt-2 max-w-xl font-serif text-lg leading-relaxed text-on-ink-muted text-pretty">{place.shortDescription}</p>
        </Container>
      </section>

      <Container className="pt-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line pb-6 font-mono text-xs uppercase tracking-[0.05em] text-muted">
          {hasLocation ? (
            <a href="#geo" className="font-semibold text-strong underline decoration-brand/50 underline-offset-4 hover:decoration-brand">
              {place.city}, {place.region}
            </a>
          ) : (
            <span>{place.city}, {place.region}</span>
          )}
          <PlaceOpenStatus openingHours={place.openingHours} />
          {place.admission && (
            <span className="tabular-nums">
              {place.admission.isFree
                ? tr.place.free
                : place.admission.adultPrice !== undefined
                  ? `${place.admission.adultPrice.toLocaleString('tr-TR')} ${place.admission.currency ?? 'TRY'}`
                  : null}
            </span>
          )}
          {hasLocation && (
            <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.06em] text-faint sm:inline">
              {Math.abs(place.latitude).toFixed(2)}°N {Math.abs(place.longitude).toFixed(2)}°E
            </span>
          )}
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0">
            {place.verificationStatus === 'verified' ? (
              <p className="mt-5 max-w-2xl font-mono text-[11px] leading-relaxed text-subtle">
                <span className="text-success">✓</span> Resmi kaynaklarla doğrulandı
                {place.lastVerifiedAt && ` · ${new Date(place.lastVerifiedAt).toLocaleDateString('tr-TR')}`}
                {place.sourceUrl && (
                  <>
                    {' '}
                    <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                      Kaynak ↗
                    </a>
                  </>
                )}
              </p>
            ) : place.verificationStatus === 'sample' ? (
              <p className="mt-5 max-w-2xl rounded-2xl border border-warning/20 bg-warning-soft px-4 py-3 font-mono text-[11px] leading-relaxed text-warning">
                {tr.common.sampleDataWarning}
                {place.sourceUrl && (
                  <>
                    {' '}
                    <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                      Resmi web sitesi ↗
                    </a>
                  </>
                )}{' '}
                <Link href="/veri-kaynaklari" className="underline underline-offset-2 hover:opacity-80">
                  Nasıl doğruluyoruz?
                </Link>
              </p>
            ) : (
              <p className="mt-5 max-w-2xl rounded-2xl border border-warning/20 bg-warning-soft px-4 py-3 font-mono text-[11px] leading-relaxed text-warning">
                Bu bilgiler henüz <strong className="font-semibold">bağımsız olarak doğrulanmamıştır</strong>. Ziyaret öncesi
                resmi kaynaktan teyit etmenizi öneririz.
                {place.sourceUrl && (
                  <>
                    {' '}
                    <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                      Resmi web sitesi ↗
                    </a>
                  </>
                )}{' '}
                <Link href="/veri-kaynaklari" className="underline underline-offset-2 hover:opacity-80">
                  Nasıl doğruluyoruz?
                </Link>
              </p>
            )}

            <div className="mt-8 max-w-2xl">
              <p className="font-serif text-xl leading-relaxed text-ink-soft text-pretty">{place.description}</p>
            </div>

            <div className="mt-10">
              <PlaceHistoryEssay place={place} />
            </div>

            {place.gallery && place.gallery.length > 0 && (
              <Reveal className="mt-10 flex gap-4 overflow-x-auto">
                {place.gallery.map((src, i) => (
                  <div key={src} className={`relative aspect-[4/3] shrink-0 overflow-hidden rounded-2xl bg-surface-muted ${i === 0 ? 'w-72 sm:w-96' : 'w-56 sm:w-72'}`}>
                    <SafeImage src={src} alt={`${place.name} — ${i + 2}`} fill sizes="400px" className="object-cover" />
                  </div>
                ))}
              </Reveal>
            )}

            <div className="mt-10">
              <PlaceRatingWidget placeId={place.id} initialAverage={ratingSummary.average} initialCount={ratingSummary.count} />
            </div>

            {hasLocation && (
              <section id="geo" className="mt-16 scroll-mt-24 border-t border-line pt-12" aria-labelledby="geo-heading">
                <Reveal>
                  <div className="mb-6">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§ Konum ve Çevre</p>
                    <h2 id="geo-heading" className="mt-1 font-display text-block-title text-strong">
                      Nerede?
                    </h2>
                    <p className="mt-1.5 font-serif text-body-sm text-subtle">
                      {nearbyPoints.length > 0 ? `Yakında ${nearbyPoints.length} yer daha var.` : place.address}
                    </p>
                  </div>
                  <div className="h-80 w-full overflow-hidden rounded-3xl sm:h-96">
                    <PlaceGeoContextWrapper
                      place={{ slug: place.slug, name: place.name, lat: place.latitude, lng: place.longitude }}
                      nearby={nearbyPoints}
                    />
                  </div>
                </Reveal>
              </section>
            )}

            {nearby.length > 0 && (
              <section className="mt-16 border-t border-line pt-12" aria-labelledby="nearby-heading">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§ Devamı</p>
                  <h2 id="nearby-heading" className="mt-1 font-display text-block-title text-strong">
                    Madem buradasın…
                  </h2>
                  <p className="mt-1.5 max-w-lg font-serif text-body-sm text-subtle">Bölgedeyken ziyaret etmeye değer diğer yerler.</p>
                  <div className="mt-6">
                    {nearby.slice(0, 4).map((p) => (
                      <DiscoveryRow key={p.slug} place={p} rating={nearbyRatings.get(p.id)} />
                    ))}
                  </div>
                </Reveal>
              </section>
            )}

            <Reveal className="mt-14 border-t border-line pt-8">
              <p className="font-display text-block-title text-strong">Bu durağı gördün. Sırada ne var?</p>
              <Link href="/gezi-planla" className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.05em] text-brand hover:underline">
                Tüm rotanı oluştur →
              </Link>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-20">
            <PlaceEssentials place={place} />
          </div>
        </div>
      </Container>

      <MobileActionBar place={place} />
    </article>
  );
}
