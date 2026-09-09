// app/admin/curated-routes/page.tsx — /admin/curated-routes
// Lists every curated "hazır rota" (including unpublished drafts — this is
// the internal admin view) with quick publish-toggle/delete controls and a
// link into the edit form. Mirrors app/admin/transit/page.tsx.

import Link from 'next/link';
import { Metadata } from 'next';
import * as curatedRouteRepository from '@/lib/repositories/curatedRouteRepository';
import { deleteCuratedRouteAction, toggleCuratedRoutePublishedAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Hazır Rotalar: Admin',
  robots: { index: false, follow: false },
};

export default async function AdminCuratedRoutesPage() {
  const routes = await curatedRouteRepository.findAll();

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-block-title font-semibold text-strong">Hazır Rotalar</h1>
          <p className="text-body-sm text-subtle">{routes.length} rota kayıtlı.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/admin/curated-routes/new" size="sm">
            Yeni Rota Ekle
          </Button>
          <Button href="/admin/transit" variant="ghost" size="sm">
            Otobüs Hatları
          </Button>
          <Button href="/admin" variant="ghost" size="sm">
            Yerlere Dön
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-muted text-meta text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Rota</th>
              <th className="px-4 py-3 font-medium">Konaklama</th>
              <th className="px-4 py-3 font-medium">Gün</th>
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-strong">{route.title}</p>
                  <p className="text-meta text-subtle">{route.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted">{route.accommodation.label}</td>
                <td className="px-4 py-3 text-muted">{route.days.length}</td>
                <td className="px-4 py-3 text-muted">{route.displayOrder}</td>
                <td className="px-4 py-3">
                  <span className={route.published ? 'text-success' : 'text-subtle'}>
                    {route.published ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/curated-routes/${route.id}/edit`} className="text-brand hover:underline">
                      Düzenle
                    </Link>
                    <form action={toggleCuratedRoutePublishedAction}>
                      <input type="hidden" name="id" value={route.id} />
                      <input type="hidden" name="slug" value={route.slug} />
                      <input type="hidden" name="nextPublished" value={(!route.published).toString()} />
                      <button type="submit" className="text-subtle hover:text-strong hover:underline">
                        {route.published ? 'Yayından Kaldır' : 'Yayınla'}
                      </button>
                    </form>
                    <form action={deleteCuratedRouteAction}>
                      <input type="hidden" name="id" value={route.id} />
                      <input type="hidden" name="slug" value={route.slug} />
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
