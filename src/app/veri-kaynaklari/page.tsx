// app/veri-kaynaklari/page.tsx — Veri Kaynaklarımız (/veri-kaynaklari)
// Rebuilt around a real stats strip (verified vs. not-yet-verified, read
// live from Supabase — see the count logic below, unchanged) instead of
// burying those numbers inside a paragraph — transparency is this page's
// whole point, so the numbers get the same architectural treatment the
// rest of the product gives real counts. Section copy unchanged.

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { getAllPlaces } from '@/lib/places';

export const metadata: Metadata = {
  title: 'Veri Kaynaklarımız: Bilgileri Nasıl Doğruluyoruz?',
  description:
    'Gezeceyik Kıbrıs\'taki yer bilgileri, açılış saatleri, fiyatlar ve rota hesaplamaları nereden geliyor? Doğrulanmış, temsili ve tahmini veri arasındaki fark.',
  alternates: { canonical: '/veri-kaynaklari' },
  robots: { index: true, follow: true },
};

const linkClass = 'text-brand hover:underline';

export const revalidate = 3600;

export default async function VeriKaynaklariPage() {
  const places = await getAllPlaces();
  const total = places.length;
  const verifiedCount = places.filter((p) => p.verificationStatus === 'verified').length;
  // Everything that isn't independently verified yet (includes the small
  // number of deliberate sample/placeholder records) — same population
  // that gets the "Temsili görsel" image label (lib/format.ts#isImageRepresentative).
  const notYetVerifiedCount = total - verifiedCount;

  const SECTIONS: { title: string; body: ReactNode }[] = [
    {
      title: 'Nereden Başlıyoruz',
      body: (
        <>
          Gezeceyik Kıbrıs&apos;taki her yer kaydı; açıklama, tarihçe, konum, açılış saatleri, giriş
          ücreti, görsel ve varsa iletişim bilgilerini içerir. Bu bilgiler tek bir kaynaktan değil,
          kamuya açık farklı kaynaklardan derlenip elle işlenmiştir — otomatik/AI ile üretilmiş yer
          bilgisi kullanmıyoruz.
        </>
      ),
    },
    {
      title: 'Kullandığımız Kaynaklar',
      body: (
        <>
          <p>Yer kayıtlarımızın büyük kısmı şu kaynaklara dayanır:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <a href="https://eemd.gov.ct.tr" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Eski Eserler ve Müzeler Dairesi
              </a>{' '}
              (eemd.gov.ct.tr) — müzeler, kaleler ve arkeolojik alanlar için resmi kurum kaynağı.
            </li>
            <li>
              <a href="https://www.visitncy.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Visit North Cyprus
              </a>{' '}
              (visitncy.com) — genel turizm ve ziyaretçi bilgisi.
            </li>
            <li>Cyprus FAQ (cyprus-faq.com) — genel gezi ve ulaşım bilgisi, özellikle otobüs hatları için.</li>
            <li>Wikipedia ve TripAdvisor — belirli yerler için tamamlayıcı, genel bilgi.</li>
            <li>Otobüs hattı bilgileri için ayrıca gerçek otobüs işletmecilerinin (ör. İtimat, Virgo Bus) kendi bilgilerine başvurulmuştur.</li>
          </ul>
          <p className="mt-3">
            Bir yerin sayfasında &ldquo;Resmi web sitesi&rdquo; veya &ldquo;Kaynak&rdquo; bağlantısı varsa, bu o kaydın
            dayandığı gerçek, spesifik kaynağa götürür.
          </p>
        </>
      ),
    },
    {
      title: 'Doğrulanmış ve Doğrulanmamış Kayıtlar',
      body: (
        <>
          <p>
            Her yer kaydı iki durumdan birindedir. Bir kısmı (şu anda toplam {total} yerin {verifiedCount}&apos;si)
            resmi kaynaklarla karşılaştırılarak <strong className="font-medium text-strong">doğrulanmıştır</strong> — bu
            yerlerin sayfasında yeşil bir onay işareti ve varsa kontrol tarihi görürsünüz. Geri kalan
            büyük çoğunluk ({notYetVerifiedCount} yer) kamuya açık kaynaklardan derlenmiş ama bağımsız olarak
            teyit edilmemiştir; bu yerlerin sayfasında bunu açıkça belirten bir uyarı bulunur.
          </p>
          <p className="mt-3">
            Bu bir kalite eksikliği değil, dürüstlük tercihidir: bilmediğimiz bir şeyi bildiğimiz gibi
            göstermektense, doğrulanmamış olduğunu söylemeyi seçiyoruz.
          </p>
        </>
      ),
    },
    {
      title: 'Görseller: Gerçek mi, Temsili mi?',
      body: (
        <>
          Doğrulanmış yerlerin görselleri o yere aittir. Doğrulanmamış yerlerin çoğunda ise ({notYetVerifiedCount}
          {' '}yer) sayfada küçük bir <strong className="font-medium text-strong">&ldquo;Temsili görsel&rdquo;</strong> etiketi
          görürsünüz — bu, görselin o yerin gerçek, kendine ait fotoğrafı olmadığı, konuyu temsil eden
          bir görsel olduğu anlamına gelir. Bunu her zaman açıkça işaretliyoruz, gizlemiyoruz.
        </>
      ),
    },
    {
      title: 'Açılış Saatleri ve Fiyatlar Ne Kadar Güncel?',
      body: (
        <>
          Açılış saatleri ve giriş ücretleri zamanla değişebilir; müzeler mevsimsel saat
          uygulayabilir, kaleler bakım için geçici olarak kapanabilir, fiyatlar güncellenebilir. Bu
          bilgileri kaynağından aldığımız haliyle gösteriyoruz ama her ziyaret öncesi gerçek zamanlı
          olarak yeniden kontrol etmiyoruz. Önemli bir ziyaret planlıyorsanız, sayfadaki resmi kaynak
          bağlantısından veya yerin kendi resmi kanallarından teyit almanızı öneririz.
        </>
      ),
    },
    {
      title: 'Rota ve Mesafe Hesaplamaları',
      body: (
        <>
          Rotalardaki (hem otomatik gezi planlayıcıda hem elle oluşturduğunuz rotalarda) mesafe ve
          süre bilgileri, iki nokta arasındaki <strong className="font-medium text-strong">kuş uçuşu mesafeden</strong>{' '}
          hesaplanan tahminlerdir — gerçek yol güzergâhı, trafik veya yol koşulları hesaba
          katılmaz. Haritada duraklar arasında çizilen kesikli çizgi de gerçek bir yol güzergâhını
          değil, yalnızca ziyaret sırasını gösteren soyut bir bağlantıdır. Toplu taşıma seçeneğinde
          gösterilen otobüs hattı bilgileri gerçek işletmeci verilerine dayanır, ancak saatler
          değişebilir; kesin kalkış saati için işletmeciyi teyit edin.
        </>
      ),
    },
    {
      title: 'Gezeceyik Puanı',
      body: (
        <>
          Yer sayfalarındaki 1-5 yıldızlık &ldquo;Gezeceyik Puanı&rdquo;, ziyaretçilerin kendi
          değerlendirmelerinden oluşur. Bir yeri puanlamak için oraya fiziksel olarak gitmiş olmanız
          gerekmez — bu doğrulanmış bir ziyaret sistemi değildir, dürüst bir topluluk görüşüdür. Sahte
          veya doldurma puan kullanmıyoruz: hiç oy almamış bir yerde &ldquo;Henüz puanlanmadı&rdquo; yazar,
          uydurma bir ortalama göstermeyiz.
        </>
      ),
    },
    {
      title: 'Yanlış veya Eski Bir Bilgi mi Fark Ettiniz?',
      body: (
        <>
          Bunu bize bildirmeniz veri kalitesini doğrudan iyileştirir.{' '}
          <Link href="/iletisim" className={linkClass}>
            İletişim
          </Link>{' '}
          sayfasından &ldquo;Yanlış bilgi bildirimi&rdquo; seçeneğiyle bize ulaşabilirsiniz.
        </>
      ),
    },
  ];

  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§00 — Kurumsal</p>
      <h1 className="mt-1 font-display text-hero leading-[0.9] text-strong text-balance">Veri Kaynaklarımız</h1>
      <p className="mt-3 max-w-lg font-serif text-body leading-relaxed text-muted">
        Bilgileri nasıl topluyoruz, nasıl doğruluyoruz ve neyin hâlâ tahmine dayalı olduğunu nasıl
        işaretliyoruz — açık şekilde.
      </p>

      {/* Real numbers as architecture, not buried in a sentence. */}
      <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-y border-line py-5">
        <div>
          <dd className="font-display text-hero leading-none text-strong tabular-nums">{total}</dd>
          <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">toplam yer</dt>
        </div>
        <div>
          <dd className="font-display text-hero leading-none text-success tabular-nums">{verifiedCount}</dd>
          <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">doğrulandı</dt>
        </div>
        <div>
          <dd className="font-display text-hero leading-none text-warning tabular-nums">{notYetVerifiedCount}</dd>
          <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">henüz doğrulanmadı</dt>
        </div>
      </dl>

      <div>
        {SECTIONS.map((s, i) => (
          <div key={s.title} className="grid gap-2 border-t border-line py-6 sm:grid-cols-[4rem_1fr] sm:gap-6">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-faint">{String(i + 1).padStart(2, '0')}</p>
            <div>
              <h2 className="font-display text-card-title text-strong">{s.title}</h2>
              <div className="mt-2.5 font-serif text-body-sm leading-relaxed text-muted">{s.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
