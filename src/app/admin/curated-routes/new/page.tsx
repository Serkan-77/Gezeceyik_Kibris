// app/admin/curated-routes/new/page.tsx — /admin/curated-routes/new

import { Metadata } from 'next';
import { CuratedRouteForm } from '@/components/admin/CuratedRouteForm';
import { createCuratedRouteAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Yeni Hazır Rota: Admin',
  robots: { index: false, follow: false },
};

export default function NewCuratedRoutePage() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-6 font-display text-block-title font-semibold text-strong">Yeni Hazır Rota Ekle</h1>
      <CuratedRouteForm route={null} action={createCuratedRouteAction} />
    </Container>
  );
}
