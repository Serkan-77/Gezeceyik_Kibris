// app/iletisim/page.tsx — İletişim (/iletisim)
// Real contact mechanism only: mailto links to the one real, already-public
// contact address (see app/gizlilik/page.tsx, which has published this
// same address as the privacy contact since before this page existed).
// No contact form — there is no backend/email-delivery service in this
// app to receive form submissions, and building one that "submits
// nowhere" would be worse than not having a form. See the launch report
// for what a real in-site form would need (a Supabase table + an email
// delivery service like Resend, neither of which exists yet).

import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Yanlış bilgi bildirimi, mekan güncellemesi, teknik sorun veya iş birliği için Gezeceyik Kıbrıs ile iletişime geçin.',
  alternates: { canonical: '/iletisim' },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = 'destekserkan0666@gmail.com';

interface Reason {
  title: string;
  description: string;
  subject: string;
}

const REASONS: Reason[] = [
  {
    title: 'Yanlış bilgi bildirimi',
    description: 'Bir yerin açıklamasında, tarihçesinde veya diğer bilgilerinde hata gördünüz.',
    subject: 'Yanlış bilgi bildirimi',
  },
  {
    title: 'Mekan bilgisi güncelleme',
    description: 'Bir yer artık farklı görünüyor, kapanmış, taşınmış veya eksik bilgi var.',
    subject: 'Mekan bilgisi güncelleme',
  },
  {
    title: 'Açılış saati / ücret düzeltmesi',
    description: 'Bir yerin açılış saatleri veya giriş ücreti değişmiş.',
    subject: 'Açılış saati / ücret düzeltmesi',
  },
  {
    title: 'Teknik sorun',
    description: 'Bir sayfa, harita, rota veya puanlama özelliği beklendiği gibi çalışmıyor.',
    subject: 'Teknik sorun bildirimi',
  },
  {
    title: 'İş birliği',
    description: 'Bir turizm işletmesi, kurum veya içerik iş birliği önermek istiyorsunuz.',
    subject: 'İş birliği talebi',
  },
  {
    title: 'Genel geri bildirim',
    description: 'Yukarıdakilerin hiçbirine uymayan bir öneri veya yorumunuz var.',
    subject: 'Genel geri bildirim',
  },
];

function mailtoFor(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Gezeceyik Kıbrıs — ${subject}`)}`;
}

export default function IletisimPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <h1 className="mb-2 font-display text-block-title font-semibold text-strong">İletişim</h1>
      <p className="mb-10 max-w-xl text-body leading-relaxed text-muted">
        Yanlış bir bilgi mi gördünüz, teknik bir sorunla mı karşılaştınız, yoksa bir öneriniz mi var?
        Aşağıdaki konulardan size uygun olanı seçip doğrudan e-posta gönderebilirsiniz.
      </p>

      <div className="divide-y divide-line border-y border-line">
        {REASONS.map((reason) => (
          <div key={reason.title} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="font-display text-card-title font-semibold text-strong">{reason.title}</p>
              <p className="mt-1 text-body-sm text-muted">{reason.description}</p>
            </div>
            <Button href={mailtoFor(reason.subject)} variant="secondary" className="shrink-0 sm:w-auto">
              E-posta gönder
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-body-sm text-subtle">
        Yukarıdaki konulardan biri size uymuyorsa doğrudan{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:underline">
          {CONTACT_EMAIL}
        </a>{' '}
        adresine yazabilirsiniz.
      </p>

      <p className="mt-2 text-caption text-faint">
        Gezeceyik Kıbrıs küçük ölçekli, bağımsız bir projedir; yanıt süreleri değişebilir.
      </p>
    </Container>
  );
}
