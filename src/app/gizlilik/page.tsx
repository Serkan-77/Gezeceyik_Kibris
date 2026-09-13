// app/gizlilik/page.tsx — Gizlilik Politikası (/gizlilik)
// Rebuilt as an indexed ledger (see hakkimizda/page.tsx for the same
// pattern) instead of a stacked list — copy unchanged, architecture new.
// Reflects the app's actual current architecture — no accounts, no
// analytics, no advertising — update this whenever that changes, not
// just at launch. As of this revision that architecture is:
// localStorage-only favorites, plus a per-browser anonymous cookie
// (gk_anon_id) that owns Supabase-stored manual routes and ratings (see
// lib/identity/anon.ts).

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Gezeceyik Kıbrıs gizlilik politikası: hangi verileri topluyoruz, çerezler ve üçüncü taraf hizmetler.',
  alternates: { canonical: '/gizlilik' },
  robots: { index: true, follow: true },
};

const linkClass = 'text-brand hover:underline';

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: 'Genel Bakış',
    body: (
      <>
        Gezeceyik Kıbrıs (&ldquo;site&rdquo;, &ldquo;biz&rdquo;), Kuzey Kıbrıs&apos;taki gezilecek yerler hakkında bilgi
        sunan, harita üzerinde keşif imkânı veren ve kişiselleştirilmiş ya da elle oluşturulmuş gezi
        rotaları hazırlamanıza yardımcı olan bir web sitesidir. Bu sayfa, siteyi kullanırken hangi
        bilgilerin nasıl işlendiğini açıklar.
      </>
    ),
  },
  {
    title: 'Hesap Oluşturmuyoruz',
    body: (
      <>
        Siteyi kullanmak için hesap oluşturmanız gerekmez. Bize isim, e-posta adresi, şifre veya
        başka bir kimlik bilgisi göndermeniz istenmez. Rota kaydetme ve puanlama gibi özellikler
        aşağıda açıklanan anonim bir tanımlayıcıyla çalışır — bu bir kullanıcı hesabı değildir.
      </>
    ),
  },
  {
    title: 'Favoriler',
    body: (
      <>
        Favorilerinize eklediğiniz yerler sunucularımıza gönderilmez; yalnızca kendi tarayıcınızın
        yerel depolama alanında (localStorage) saklanır. Bu veriler cihazınızdan ayrılmaz; tarayıcı
        geçmişinizi/verilerinizi temizlediğinizde silinir ve başka bir cihazda görünmez.
      </>
    ),
  },
  {
    title: 'Rotalar ve Değerlendirmeler (Anonim Tanımlayıcı)',
    body: (
      <>
        Bir yeri rotanıza eklediğinizde veya bir yeri puanladığınızda, bu bilgiyi cihazlar arasında
        kaybetmemeniz için sunucularımızda (Supabase altyapısında) saklarız. Bunu bir hesaba değil,
        tarayıcınıza ilk rota/puan işleminizde bir kez atanan, rastgele üretilmiş anonim bir
        tanımlayıcıya bağlarız; bu tanımlayıcı yalnızca ilgili tarayıcı üzerinden erişilebilen,
        HTTP-only (JavaScript ile okunamayan) bir çerezde tutulur. Tanımlayıcı isminizi,
        e-postanızı veya kimliğinizi içermez ve reklam ya da takip amacıyla kullanılmaz — tek amacı,
        &ldquo;bu rota/puan hangi tarayıcıya ait&rdquo; sorusunu cevaplamaktır.
      </>
    ),
  },
  {
    title: 'Çerezler',
    body: (
      <>
        Site şu anda yalnızca yukarıda açıklanan, işlevsel amaçlı tek bir çerezi (rota/puan
        sahipliği için) kullanır. Reklam veya takip amaçlı çerez kullanmıyoruz ve şu anda bir
        analitik hizmeti (ör. Google Analytics) veya reklam hizmeti (ör. Google AdSense) aktif
        değil. Bunlardan biri ileride eklenirse, bu sayfa güncellenecek ve gerekli durumlarda bir
        çerez onay bildirimi gösterilecektir.
      </>
    ),
  },
  {
    title: 'Üçüncü Taraf Hizmetler',
    body: (
      <>
        Harita özelliği, OpenStreetMap altyapısını kullanan Leaflet kütüphanesiyle çalışır; harita
        görüntülendiğinde tarayıcınız harita karolarını doğrudan OpenStreetMap sunucularından
        yükler. Bu istekler bu site tarafından kontrol edilmez ve OpenStreetMap&apos;in kendi
        gizlilik uygulamalarına tabidir. Kaydedilen rota ve puan verileri, Supabase (yönetilen
        veritabanı hizmeti) üzerinde barındırılır.
      </>
    ),
  },
  {
    title: 'Veri Doğruluğu',
    body: (
      <>
        Sitedeki açılış saatleri, giriş ücretleri ve iletişim bilgileri kamuya açık kaynaklardan
        derlenmiştir ve bir kısmı bağımsız olarak teyit edilmemiş olabilir. Hangi bilginin
        doğrulanmış, hangisinin tahmini olduğunu{' '}
        <Link href="/veri-kaynaklari" className={linkClass}>
          Veri Kaynaklarımız
        </Link>{' '}
        sayfasında ayrıntılı şekilde açıklıyoruz. Ziyaret planlamadan önce resmi kaynakları kontrol
        etmenizi öneririz.
      </>
    ),
  },
  {
    title: 'Değişiklikler',
    body: (
      <>
        Bu politika, sitenin işlevleri değiştikçe (ör. hesap sistemi, ödeme, reklam veya analitik
        eklenmesi) güncellenebilir. Güncel sürüm her zaman bu sayfada yer alır.
      </>
    ),
  },
  {
    title: 'İletişim',
    body: (
      <>
        Gizlilikle ilgili sorularınız için{' '}
        <Link href="/iletisim" className={linkClass}>
          İletişim
        </Link>{' '}
        sayfasından bize ulaşabilirsiniz.
      </>
    ),
  },
];

export default function GizlilikPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§00 — Kurumsal</p>
      <h1 className="mt-1 font-display text-hero leading-[0.9] text-strong text-balance">Gizlilik Politikası</h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.05em] text-subtle">Son güncelleme: 5 Eylül 2026</p>

      <div className="mt-10">
        {SECTIONS.map((s, i) => (
          <div key={s.title} className="grid gap-2 border-t border-line py-6 sm:grid-cols-[4rem_1fr] sm:gap-6">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-faint">{String(i + 1).padStart(2, '0')}</p>
            <div>
              <h2 className="font-display text-card-title text-strong">{s.title}</h2>
              <p className="mt-2.5 font-serif text-body-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
