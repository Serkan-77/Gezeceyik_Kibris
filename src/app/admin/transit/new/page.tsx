// app/admin/transit/new/page.tsx — /admin/transit/new

import { Metadata } from 'next';
import { TransitRouteForm } from '@/components/admin/TransitRouteForm';
import { createTransitRouteAction } from '@/app/admin/actions';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Yeni Otobüs Hattı: Admin',
  robots: { index: false, follow: false },
};

export default function NewTransitRoutePage() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="mb-6 font-display text-block-title font-semibold text-strong">Yeni Otobüs Hattı Ekle</h1>
      <TransitRouteForm route={null} action={createTransitRouteAction} />
    </Container>
  );
}
