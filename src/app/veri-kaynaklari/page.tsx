// app/veri-kaynaklari/page.tsx — Veri Kaynaklarımız (/veri-kaynaklari)
// Static content page. Every figure and source domain named here was
// pulled directly from the live `places`/`transitRoutes` tables (121
// published places, 16 active transit routes) before writing this copy —
// see the launch report for the exact audit. Update the counts if the
// dataset changes meaningfully; don't let this page drift from reality.

import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Veri Kaynaklarımız: Bilgileri Nasıl Doğruluyoruz?',
  description:
    'Gezeceyik Kıbrıs\'taki yer bilgileri, açılış saatleri, fiyatlar ve rota hesaplamaları nereden geliyor? Doğrulanmış, temsili ve tahmini veri arasındaki fark.',
  alternates: { canonical: '/veri-kaynaklari' },
  robots: { index: true, follow: true },
};

const sectionClass = 'space-y-3';
const headingClass = 'font-display text-card-title font-semibold text-strong';
const paragraphClass = 'text-body-sm leading-relaxed text-muted';
const linkClass = 'text-brand hover:underline';

export default function VeriKaynaklariPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <h1 className="mb-2 font-display text-block-title font-semibold text-strong">Veri Kaynaklarımız</h1>
      <p className="mb-10 text-body leading-relaxed text-muted">
        Bilgileri nasıl topluyoruz, nasıl doğruluyoruz ve neyin hâlâ tahmine dayalı olduğunu nasıl
        işaretliyoruz — açık şekilde.
      </p>

      <div className="space-y-8">
        <section className={sectionClass}>
          <h2 className={headingClass}>Nereden Başlıyoruz</h2>
          <p className={paragraphClass}>
            Gezeceyik Kıbrıs&apos;taki her yer kaydı; açıklama, tarihçe, konum, açılış saatleri, giriş
            ücreti, görsel ve varsa iletişim bilgilerini içerir. Bu bilgiler tek bir kaynaktan değil,
            kamuya açık farklı kaynaklardan derlenip elle işlenmiştir — otomatik/AI ile üretilmiş yer
            bilgisi kullanmıyoruz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Kullandığımız Kaynaklar</h2>
          <p className={paragraphClass}>Yer kayıtlarımızın büyük kısmı şu kaynaklara dayanır:</p>
          <ul className="list-disc space-y-2 pl-5 text-body-sm leading-relaxed text-muted">
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
            <li>
              Otobüs hattı bilgileri için ayrıca gerçek otobüs işletmecilerinin (ör. İtimat, Virgo Bus)
              kendi bilgilerine başvurulmuştur.
            </li>
          </ul>
          <p className={paragraphClass}>
            Bir yerin sayfasında &ldquo;Resmi web sitesi&rdquo; veya &ldquo;Kaynak&rdquo; bağlantısı varsa, bu o kaydın
            dayandığı gerçek, spesifik kaynağa götürür.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Doğrulanmış ve Doğrulanmamış Kayıtlar</h2>
          <p className={paragraphClass}>
            Her yer kaydı iki durumdan birindedir. Bir kısmı (şu anda toplam 121 yerin yaklaşık 7&apos;si)
            resmi kaynaklarla karşılaştırılarak <strong className="font-medium text-strong">doğrulanmıştır</strong> — bu
            yerlerin sayfasında yeşil bir onay işareti ve varsa kontrol tarihi görürsünüz. Geri kalan
            büyük çoğunluk (yaklaşık 114 yer) kamuya açık kaynaklardan derlenmiş ama bağımsız olarak
            teyit edilmemiştir; bu yerlerin sayfasında bunu açıkça belirten bir uyarı bulunur.
          </p>
          <p className={paragraphClass}>
            Bu bir kalite eksikliği değil, dürüstlük tercihidir: bilmediğimiz bir şeyi bildiğimiz gibi
            göstermektense, doğrulanmamış olduğunu söylemeyi seçiyoruz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Görseller: Gerçek mi, Temsili mi?</h2>
          <p className={paragraphClass}>
            Doğrulanmış yerlerin görselleri o yere aittir. Doğrulanmamış yerlerin çoğunda ise (yine
            yaklaşık 114 yer) sayfada küçük bir <strong className="font-medium text-strong">&ldquo;Temsili görsel&rdquo;</strong> etiketi
            görürsünüz — bu, görselin o yerin gerçek, kendine ait fotoğrafı olmadığı, konuyu temsil eden
            bir görsel olduğu anlamına gelir. Bunu her zaman açıkça işaretliyoruz, gizlemiyoruz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Açılış Saatleri ve Fiyatlar Ne Kadar Güncel?</h2>
          <p className={paragraphClass}>
            Açılış saatleri ve giriş ücretleri zamanla değişebilir; müzeler mevsimsel saat
            uygulayabilir, kaleler bakım için geçici olarak kapanabilir, fiyatlar güncellenebilir. Bu
            bilgileri kaynağından aldığımız haliyle gösteriyoruz ama her ziyaret öncesi gerçek zamanlı
            olarak yeniden kontrol etmiyoruz. Önemli bir ziyaret planlıyorsanız, sayfadaki resmi kaynak
            bağlantısından veya yerin kendi resmi kanallarından teyit almanızı öneririz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Rota ve Mesafe Hesaplamaları</h2>
          <p className={paragraphClass}>
            Rotalardaki (hem otomatik gezi planlayıcıda hem elle oluşturduğunuz rotalarda) mesafe ve
            süre bilgileri, iki nokta arasındaki <strong className="font-medium text-strong">kuş uçuşu mesafeden</strong>{' '}
            hesaplanan tahminlerdir — gerçek yol güzergâhı, trafik veya yol koşulları hesaba
            katılmaz. Haritada duraklar arasında çizilen kesikli çizgi de gerçek bir yol güzergâhını
            değil, yalnızca ziyaret sırasını gösteren soyut bir bağlantıdır. Toplu taşıma seçeneğinde
            gösterilen otobüs hattı bilgileri gerçek işletmeci verilerine dayanır, ancak saatler
            değişebilir; kesin kalkış saati için işletmeciyi teyit edin.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Gezeceyik Puanı</h2>
          <p className={paragraphClass}>
            Yer sayfalarındaki 1-5 yıldızlık &ldquo;Gezeceyik Puanı&rdquo;, ziyaretçilerin kendi
            değerlendirmelerinden oluşur. Bir yeri puanlamak için oraya fiziksel olarak gitmiş olmanız
            gerekmez — bu doğrulanmış bir ziyaret sistemi değildir, dürüst bir topluluk görüşüdür. Sahte
            veya doldurma puan kullanmıyoruz: hiç oy almamış bir yerde &ldquo;Henüz puanlanmadı&rdquo; yazar,
            uydurma bir ortalama göstermeyiz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Yanlış veya Eski Bir Bilgi mi Fark Ettiniz?</h2>
          <p className={paragraphClass}>
            Bunu bize bildirmeniz veri kalitesini doğrudan iyileştirir.{' '}
            <Link href="/iletisim" className={linkClass}>
              İletişim
            </Link>{' '}
            sayfasından &ldquo;Yanlış bilgi bildirimi&rdquo; seçeneğiyle bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </Container>
  );
}
