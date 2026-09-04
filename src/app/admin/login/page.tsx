// app/admin/login/page.tsx — /admin/login
// The one /admin route src/proxy.ts always lets through.

import { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { Surface } from '@/components/ui/Surface';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Admin Girişi: Gezeceyik Kıbrıs',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Container className="flex min-h-[60svh] items-center justify-center py-12">
      <Surface tone="surface" padding="lg" radius="md" className="w-full max-w-sm">
        <h1 className="mb-6 font-display text-block-title font-semibold text-strong">Admin Paneli</h1>
        <LoginForm />
      </Surface>
    </Container>
  );
}
