// app/ulasim/page.tsx — Ulaşım (/ulasim)
// Public browse page for the real inter-city bus/dolmuş data that already
// powers the trip planner's "public transport" mode (see
// lib/transitRoutes.ts, types/transit.ts) — this is the first place a
// visitor can see that data directly, not just as a computed leg inside a
// generated itinerary. Editable from /admin/transit (operator, stops,
// schedule, fare, active toggle) — this page only reads, same pattern as
// every other public page.
//
// Airport transfers use the exact same BusRoute shape (a route whose stop
// name mentions the airport) — no separate data model needed — but no
// verified airport-route data exists yet, so that section shows an honest
// "not yet added" state instead of inventing schedules/fares. Never
// fabricate what an operator hasn't published.

import { Metadata } from 'next';
import { getActiveTransitRoutes } from '@/lib/transitRoutes';
import { BusRoute, TransitSchedule } from '@/types/transit';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Reveal } from '@/components/ui/Reveal';
import { PlaneIcon, BusIcon, PhoneIcon, ClockIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Kuzey Kıbrıs\'ta Ulaşım: Otobüs Saatleri ve Ücretleri',
  description:
    'Kuzey Kıbrıs\'ta şehirlerarası otobüs/dolmuş seferleri: operatörler, kalkış saatleri, ücretler ve duraklar. Havaalanı ulaşımı bilgileri.',
  alternates: { canonical: '/ulasim' },
  openGraph: {
    title: 'Kuzey Kıbrıs\'ta Ulaşım | Gezeceyik Kıbrıs',
    description: 'Şehirlerarası otobüs seferleri, saatler, ücretler ve duraklar.',
  },
};

export const revalidate = 3600;

function formatSchedule(schedule: TransitSchedule): string {
  if (schedule.type === 'fixed') return schedule.times.join(' · ');
  if (schedule.type === 'frequency') {
    return `${schedule.firstDeparture}–${schedule.lastDeparture} arası, ~${schedule.intervalMinutes} dk sıklıkla`;
  }
  return 'Sabit sefer saati yayınlanmıyor';
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} dk`;
  if (m === 0) return `${h} sa`;
  return `${h} sa ${m} dk`;
}

const AIRPORT_KEYWORDS = ['havalimanı', 'havaalanı', 'airport', 'ercan', 'ekaterini'];
function isAirportRoute(route: BusRoute): boolean {
  const haystack = `${route.fromStop.name} ${route.toStop.name}`.toLocaleLowerCase('tr-TR');
  return AIRPORT_KEYWORDS.some((k) => haystack.includes(k));
}

function RouteCard({ route }: { route: BusRoute }) {
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow duration-[var(--duration-base)] hover:shadow-[var(--shadow-lift)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand">{route.operator}</p>
          <h3 className="mt-1 font-display text-xl text-strong">
            {route.fromRegion} <span className="text-subtle">→</span> {route.toRegion}
          </h3>
          <p className="mt-1 text-meta text-subtle">
            {route.fromStop.name} → {route.toStop.name}
          </p>
        </div>
        {route.fareTRY != null && (
          <div className="shrink-0 rounded-xl bg-brand/10 px-3.5 py-2 text-right">
            <p className="font-display text-lg leading-none text-brand">{route.fareTRY.toLocaleString('tr-TR')} TRY</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-subtle">tek yön</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 font-mono text-[12px] text-muted">
        <span className="flex items-center gap-1.5">
          <ClockIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
          {formatSchedule(route.schedule)}
        </span>
        <span>~{formatDuration(route.durationMinutes)} sürüyor</span>
        {route.phone && route.phone.length > 0 && (
          <span className="flex items-center gap-1.5">
            <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
            {route.phone.join(' · ')}
          </span>
        )}
      </div>

      {route.notes && <p className="mt-3 text-body-sm leading-relaxed text-subtle">{route.notes}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.06em] ${
            route.verificationStatus === 'verified' ? 'text-success' : 'text-warning'
          }`}
        >
          {route.verificationStatus === 'verified' ? '✓ Resmi kaynaklarla doğrulandı' : 'Henüz bağımsız olarak doğrulanmamış'}
          {' · '}
          {new Date(route.lastVerifiedAt).toLocaleDateString('tr-TR')}
        </span>
        <a href={route.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-brand hover:underline">
          Kaynak ↗
        </a>
      </div>
    </div>
  );
}

export default async function UlasimPage() {
  const routes = await getActiveTransitRoutes();
  const airportRoutes = routes.filter(isAirportRoute);
  const intercityRoutes = routes
    .filter((r) => !isAirportRoute(r))
    .sort((a, b) => a.fromRegion.localeCompare(b.fromRegion, 'tr') || a.toRegion.localeCompare(b.toRegion, 'tr'));

  return (
    <article>
      <Container className="pt-5">
        <Breadcrumbs items={[{ name: 'Ana Sayfa', url: '/' }, { name: 'Ulaşım', url: '/ulasim' }]} />
      </Container>

      <Container className="pt-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§ Ulaşım</p>
          <h1 className="mt-1 font-display text-hero leading-[0.94] text-strong text-balance">Adada nasıl gidilir?</h1>
          <p className="mt-3 font-serif text-body leading-relaxed text-muted text-pretty">
            Şehirlerarası otobüs/dolmuş hatları: operatörler, kalkış saatleri, ücretler ve duraklar. Gerçek
            işletmeci verilerinden — planlayıcının &ldquo;toplu taşıma&rdquo; modunun kullandığı aynı veri.
          </p>
        </div>

        {/* ── Havaalanı Ulaşımı ── */}
        <Reveal className="mt-12">
          <div className="mb-5 flex items-center gap-2.5">
            <PlaneIcon className="h-5 w-5 shrink-0 text-brand" />
            <h2 className="font-display text-block-title text-strong">Havaalanı Ulaşımı</h2>
          </div>
          {airportRoutes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {airportRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-surface p-6 text-center shadow-[var(--shadow-card)]">
              <p className="font-display text-lg text-strong">Henüz eklenmedi</p>
              <p className="mx-auto mt-2 max-w-md text-body-sm text-subtle">
                Havaalanı transfer/servis bilgilerini şu anda doğrulanmış bir kaynaktan teyit edemedik — uydurma bir
                saat veya ücret göstermek yerine boş bırakıyoruz. Bilginiz varsa{' '}
                <a href="/iletisim" className="text-brand hover:underline">
                  bize ulaşın
                </a>
                .
              </p>
            </div>
          )}
        </Reveal>

        {/* ── Şehirlerarası Otobüs Seferleri ── */}
        <Reveal className="mt-14">
          <div className="mb-5 flex items-center gap-2.5">
            <BusIcon className="h-5 w-5 shrink-0 text-brand" />
            <h2 className="font-display text-block-title text-strong">Şehirlerarası Otobüs Seferleri</h2>
            <span className="font-mono text-[11px] tabular-nums text-subtle">{intercityRoutes.length} hat</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {intercityRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14 rounded-2xl bg-warning-soft p-5 text-body-sm leading-relaxed text-warning">
          Bu bilgiler resmi bir işletmeci tarifesi değildir; kamuya açık kaynaklardan derlenmiştir ve zamanla
          değişebilir. Önemli bir yolculuk öncesi işletmeciyi telefonla teyit etmenizi öneririz.
        </Reveal>
      </Container>
    </article>
  );
}
