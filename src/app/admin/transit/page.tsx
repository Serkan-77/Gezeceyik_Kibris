// app/admin/transit/page.tsx — /admin/transit
// Lists every inter-city bus route (including inactive ones — this is the
// internal admin view) with quick active-toggle/delete controls and a link
// into the edit form. Mirrors app/admin/page.tsx (the places dashboard).

import Link from 'next/link';
import { Metadata } from 'next';
import * as transitRouteRepository from '@/lib/repositories/transitRouteRepository';
import { deleteTransitRouteAction, toggleTransitRouteActiveAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Otobüs Hatları: Admin',
  robots: { index: false, follow: false },
};

function scheduleSummary(route: Awaited<ReturnType<typeof transitRouteRepository.findAll>>[number]): string {
  if (route.schedule.type === 'fixed') return route.schedule.times.join(', ');
  if (route.schedule.type === 'frequency') {
    return `${route.schedule.firstDeparture}–${route.schedule.lastDeparture} (${route.schedule.intervalMinutes} dk sıklık)`;
  }
  return 'Sabit tarife yok';
}

export default async function AdminTransitPage() {
  const routes = await transitRouteRepository.findAll();

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-block-title font-semibold text-strong">Otobüs Hatları</h1>
          <p className="text-body-sm text-subtle">{routes.length} hat kayıtlı.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/admin/transit/new" size="sm">
            Yeni Hat Ekle
          </Button>
          <Button href="/admin" variant="ghost" size="sm">
            Yerlere Dön
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-surface-muted text-meta text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Hat</th>
              <th className="px-4 py-3 font-medium">Operatör</th>
              <th className="px-4 py-3 font-medium">Tarife</th>
              <th className="px-4 py-3 font-medium">Ücret</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {routes.map((route) => (
              <tr key={route.id} className={route.active ? '' : 'opacity-50'}>
                <td className="px-4 py-3">
                  <p className="font-medium text-strong">
                    {route.fromRegion} → {route.toRegion}
                  </p>
                  <p className="text-meta text-subtle">
                    {route.fromStop.name} → {route.toStop.name}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted">{route.operator}</td>
                <td className="px-4 py-3 text-muted">{scheduleSummary(route)}</td>
                <td className="px-4 py-3 text-muted">{route.fareTRY ? `${route.fareTRY} TRY` : '—'}</td>
                <td className="px-4 py-3">
                  <span className={route.active ? 'text-success' : 'text-subtle'}>
                    {route.active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/transit/${route.id}/edit`} className="text-brand hover:underline">
                      Düzenle
                    </Link>
                    <form action={toggleTransitRouteActiveAction}>
                      <input type="hidden" name="id" value={route.id} />
                      <input type="hidden" name="nextActive" value={(!route.active).toString()} />
                      <button type="submit" className="text-subtle hover:text-strong hover:underline">
                        {route.active ? 'Pasifleştir' : 'Aktifleştir'}
                      </button>
                    </form>
                    <form action={deleteTransitRouteAction}>
                      <input type="hidden" name="id" value={route.id} />
                      <button type="submit" className="text-danger hover:underline">
                        Sil
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
