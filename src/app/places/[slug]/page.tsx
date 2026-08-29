// app/places/[slug]/page.tsx — Yer Detay Sayfası (/places/[slug])
// Server Component with generateStaticParams for SSG. Editorial narrative
// order: what it is (lede) → why it matters (history) → practical info
// (PlaceInfoPanel, alongside) → nearby places.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPlaceSlugs, getPlaceBySlug, getNearbyPlaces } from '@/lib/places';
import { PlaceInfoPanel } from '@/components/places/PlaceInfoPanel';
import { MobileActionBar } from '@/components/places/MobileActionBar';
import { PlaceGrid } from '@/components/places/PlaceGrid';
import { CategoryBadge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  // Deliberately tolerant of a failed/unreachable database at build time:
  // this only decides which pages get *pre*-rendered at build time, not
  // whether a page can render at all — dynamicParams stays at its default
  // (true), so any slug not returned here still renders on-demand at
  // request time. Letting this throw would fail the entire production
  // build over a single enumeration query, which is a worse outcome than
  // building with zero pre-rendered place pages. Actual page requests
  // still fail loudly in production if the database is unreachable (see
  // lib/places.ts) — this only softens the build-time optimization step.
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
    title: `${place.name} — ${place.city}, Kuzey Kıbrıs`,
    description: place.shortDescription,
    openGraph: {
      title: `${place.name} | Kuzey Kıbrıs Discovery`,
      description: place.shortDescription,
      images: [
        {
          url: place.image,
          alt: `${place.name} — ${place.city}, Kuzey Kıbrıs`,
        },
      ],
    },
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const nearby = await getNearbyPlaces(place);

  return (
    <article className="pb-20 lg:pb-0">
      {/* Hero image — 16:7 sinematik oran */}
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-ink">
        {place.image && (
          <Image
            src={place.image}
            alt={`${place.name} — ${place.city}, Kuzey Kıbrıs`}
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <Container className="pb-8">
            {/* Breadcrumb */}
            <nav aria-label="İçerik haritası" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-meta text-on-ink-subtle">
                <li>
                  <Link href="/" className="transition-colors hover:text-white/80">Ana Sayfa</Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link href="/places" className="transition-colors hover:text-white/80">Tüm Yerler</Link>
                </li>
                <li aria-hidden="true">›</li>
                <li className="text-on-ink-muted" aria-current="page">{place.name}</li>
              </ol>
            </nav>

            <CategoryBadge category={place.category} overlay />

            <h1 className="mt-2 font-display text-page-title font-bold leading-tight text-white text-balance">
              {place.name}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-body-sm text-on-ink-muted">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {place.city}, {place.region} — Kuzey Kıbrıs
            </p>
          </Container>
        </div>
      </div>

      {/* Content area */}
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">

          {/* ── Left: editorial content ─────────────────────── */}
          <div className="min-w-0">
            {/* Lede — what this place is */}
            <p className="font-display text-block-title leading-relaxed text-ink-soft text-pretty">
              {place.description}
            </p>

            {/* History & background — why it matters */}
            {place.history && (
              <section className="mt-10 border-t border-surface-muted pt-8" aria-labelledby="history-heading">
                <h2 id="history-heading" className="mb-4 font-display text-block-title font-semibold text-strong">
                  Tarih ve Arka Plan
                </h2>
                <p className="prose-body text-body leading-8 text-muted">
                  {place.history}
                </p>
              </section>
            )}

            {/* Data disclaimer */}
            <div className="mt-10 rounded-sm border border-warning/20 bg-warning-soft px-4 py-3.5 text-body-sm leading-relaxed text-warning">
              <strong className="font-semibold">Not:</strong> Bu sayfadaki açılış
              saatleri, fiyatlar ve iletişim bilgileri{' '}
              <strong className="font-semibold">örnek veridir</strong> — bağımsız
              olarak doğrulanmamıştır. Ziyaret öncesi resmi kaynaklara başvurun.
              {place.sourceUrl && (
                <>
                  {' '}
                  <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                    Resmi web sitesi ↗
                  </a>
                </>
              )}
            </div>
          </div>

          {/* ── Right: visitor information — what to know / where / how ── */}
          <div className="lg:min-w-0">
            <PlaceInfoPanel place={place} />
          </div>
        </div>

        {/* Nearby places */}
        {nearby.length > 0 && (
          <section className="mt-16 border-t border-surface-muted pt-12" aria-labelledby="nearby-heading">
            <div className="mb-8">
              <SectionHeader
                id="nearby-heading"
                eyebrow="Çevredeki Yerler"
                title="Yakınındaki Yerler"
                subtitle="Bölgedeyken ziyaret etmeye değer diğer cazibe merkezleri."
              />
            </div>
            <PlaceGrid places={nearby} />
          </section>
        )}
      </Container>

      <MobileActionBar place={place} />
    </article>
  );
}
