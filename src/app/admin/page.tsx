// app/admin/page.tsx — /admin dashboard
// Lists every place (including unpublished/archived — this is the internal
// admin view, not the public one) with quick publish/archive controls and
// a link into the edit form. Reads directly from placeRepository rather
// than lib/places.ts: the admin view needs raw, unfiltered place rows,
// not the public, mapped-and-filtered domain Place shape.

import Link from 'next/link';
import { Metadata } from 'next';
import * as placeRepository from '@/lib/repositories/placeRepository';
import { archivePlaceAction, logoutAction, togglePublishAction } from './actions';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Admin Paneli: Gezeceyik Kıbrıs',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const places = await placeRepository.findAll();

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-block-title font-semibold text-strong">Admin Paneli</h1>
          <p className="text-body-sm text-subtle">{places.length} yer kayıtlı.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/admin/places/new" size="sm">
            Yeni Yer Ekle
          </Button>
          <Button href="/admin/transit" variant="ghost" size="sm">
            Otobüs Hatları
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Çıkış Yap
            </Button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-muted text-meta text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">İsim</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Bölge</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Doğrulama</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {places.map((place) => (
              <tr key={place.id} className={place.archived ? 'opacity-50' : ''}>
                <td className="px-4 py-3">
                  <p className="font-medium text-strong">{place.name}</p>
                  <p className="text-meta text-subtle">{place.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted">{place.category}</td>
                <td className="px-4 py-3 text-muted">{place.region}</td>
                <td className="px-4 py-3">
                  <span className={place.published ? 'text-success' : 'text-subtle'}>
                    {place.archived ? 'Arşivlendi' : place.published ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{place.verificationStatus}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/places/${place.slug}/edit`} className="text-brand hover:underline">
                      Düzenle
                    </Link>
                    {!place.archived && (
                      <form action={togglePublishAction}>
                        <input type="hidden" name="slug" value={place.slug} />
                        <input type="hidden" name="nextPublished" value={(!place.published).toString()} />
                        <button type="submit" className="text-subtle hover:text-strong hover:underline">
                          {place.published ? 'Yayından Kaldır' : 'Yayınla'}
                        </button>
                      </form>
                    )}
                    {!place.archived && (
                      <form action={archivePlaceAction}>
                        <input type="hidden" name="slug" value={place.slug} />
                        <button type="submit" className="text-danger hover:underline">
                          Arşivle
                        </button>
                      </form>
                    )}
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
