// app/gizlilik/page.tsx — Gizlilik Politikası (/gizlilik)
// Static content page. Reflects the app's actual current architecture
// (no accounts, no server-side personal data, localStorage-only favorites/
// trip plans) — update this whenever that changes (e.g. adding analytics,
// AdSense, accounts, or payments), not just at launch.

import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası: Gezeceyik Kıbrıs',
  description: 'Gezeceyik Kıbrıs gizlilik politikası: hangi verileri topluyoruz, çerezler ve üçüncü taraf hizmetler.',
  robots: { index: true, follow: true },
};

const sectionClass = 'space-y-3';
const headingClass = 'font-display text-card-title font-semibold text-strong';
const paragraphClass = 'text-body-sm leading-relaxed text-muted';

export default function GizlilikPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <h1 className="mb-2 font-display text-block-title font-semibold text-strong">Gizlilik Politikası</h1>
      <p className="mb-10 text-meta text-subtle">Son güncelleme: 30 Ağustos 2026</p>

      <div className="space-y-8">
        <section className={sectionClass}>
          <h2 className={headingClass}>Genel Bakış</h2>
          <p className={paragraphClass}>
            Gezeceyik Kıbrıs (&ldquo;site&rdquo;, &ldquo;biz&rdquo;), Kuzey Kıbrıs&apos;taki gezilecek yerler hakkında bilgi
            sunan ve kişiselleştirilmiş gezi planları oluşturan bir web sitesidir. Bu sayfa, siteyi
            kullanırken hangi bilgilerin nasıl işlendiğini açıklar.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Hesap Oluşturmuyoruz</h2>
          <p className={paragraphClass}>
            Siteyi kullanmak için hesap oluşturmanız gerekmez ve site hâlihazırda bir kullanıcı hesabı
            sistemi içermez. Bize isim, e-posta adresi veya başka bir kimlik bilgisi göndermeniz
            istenmez.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Favoriler ve Gezi Planları</h2>
          <p className={paragraphClass}>
            Favorilerinize eklediğiniz yerler ve oluşturduğunuz gezi planı seçimleri, sunucularımıza
            gönderilmez, yalnızca kendi tarayıcınızın yerel depolama alanında (localStorage) saklanır.
            Bu veriler cihazınızdan ayrılmaz; tarayıcı geçmişinizi/verilerinizi temizlediğinizde
            silinir ve başka bir cihazda görünmez.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Çerezler</h2>
          <p className={paragraphClass}>
            Site şu anda takip amaçlı çerez kullanmamaktadır. İleride ziyaretçi istatistiklerini
            anlamak için bir analitik hizmeti (ör. Google Analytics) veya reklam hizmeti (ör. Google
            AdSense) eklenirse, bu sayfa güncellenecek ve gerekli durumlarda bir çerez onay bildirimi
            gösterilecektir.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Üçüncü Taraf Hizmetler</h2>
          <p className={paragraphClass}>
            Harita özelliği, OpenStreetMap altyapısını kullanan Leaflet kütüphanesiyle çalışır; harita
            görüntülendiğinde tarayıcınız harita karolarını doğrudan OpenStreetMap sunucularından
            yükler. Bu istekler bu site tarafından kontrol edilmez ve OpenStreetMap&apos;in kendi
            gizlilik uygulamalarına tabidir.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Veri Doğruluğu</h2>
          <p className={paragraphClass}>
            Sitedeki açılış saatleri, giriş ücretleri ve iletişim bilgileri kamuya açık kaynaklardan
            derlenmiştir ve bağımsız olarak teyit edilmemiş olabilir. Ziyaret planlamadan önce resmi
            kaynakları kontrol etmenizi öneririz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Değişiklikler</h2>
          <p className={paragraphClass}>
            Bu politika, sitenin işlevleri değiştikçe (ör. hesap sistemi, ödeme, reklam veya analitik
            eklenmesi) güncellenebilir. Güncel sürüm her zaman bu sayfada yer alır.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>İletişim</h2>
          <p className={paragraphClass}>
            Gizlilikle ilgili sorularınız için: <strong className="text-strong">destekserkan0666@gmail.com</strong>
          </p>
        </section>
      </div>
    </Container>
  );
}
