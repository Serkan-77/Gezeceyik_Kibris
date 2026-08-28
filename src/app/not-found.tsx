// app/not-found.tsx — Özel 404 sayfası.

import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı',
};

export default function NotFound() {
  return (
    <Container size="narrow" className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-display font-bold text-brand">404</p>
      <h1 className="mt-4 font-display text-block-title font-semibold text-strong">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 text-body text-muted">
        Bu sayfa mevcut değil veya aradığınız yer taşınmış olabilir.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/places" icon={<ArrowRightIcon className="h-4 w-4" />}>
          Tüm yerleri keşfet
        </Button>
        <Button href="/" variant="secondary">
          Ana sayfaya dön
        </Button>
      </div>
    </Container>
  );
}
