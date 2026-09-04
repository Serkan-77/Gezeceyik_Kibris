// app/admin/login/page.tsx — /admin/login
// The one /admin route src/proxy.ts always lets through.

import { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Admin Girişi: Gezeceyik Kıbrıs',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Container className="flex min-h-[60svh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-md border border-line bg-surface p-8">
        <h1 className="mb-6 font-display text-block-title font-semibold text-strong">Admin Paneli</h1>
        <LoginForm />
      </div>
    </Container>
  );
}
