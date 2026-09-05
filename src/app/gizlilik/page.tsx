// app/gizlilik/page.tsx — Gizlilik Politikası (/gizlilik)
// Static content page. Reflects the app's actual current architecture —
// no accounts, no analytics, no advertising — update this whenever that
// changes, not just at launch. As of this revision that architecture is:
// localStorage-only favorites, plus a per-browser anonymous cookie
// (gk_anon_id) that owns Supabase-stored manual routes and ratings (see
// lib/identity/anon.ts) — genuinely different from the original
// all-localStorage version of this page, which is why this content
// changed alongside the route builder / ratings features themselves.

import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Gezeceyik Kıbrıs gizlilik politikası: hangi verileri topluyoruz, çerezler ve üçüncü taraf hizmetler.',
  alternates: { canonical: '/gizlilik' },
  robots: { index: true, follow: true },
};

const sectionClass = 'space-y-3';
const headingClass = 'font-display text-card-title font-semibold text-strong';
const paragraphClass = 'text-body-sm leading-relaxed text-muted';
const linkClass = 'text-brand hover:underline';

export default function GizlilikPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <h1 className="mb-2 font-display text-block-title font-semibold text-strong">Gizlilik Politikası</h1>
      <p className="mb-10 text-meta text-subtle">Son güncelleme: 5 Eylül 2026</p>

      <div className="space-y-8">
        <section className={sectionClass}>
          <h2 className={headingClass}>Genel Bakış</h2>
          <p className={paragraphClass}>
            Gezeceyik Kıbrıs (&ldquo;site&rdquo;, &ldquo;biz&rdquo;), Kuzey Kıbrıs&apos;taki gezilecek yerler hakkında bilgi
            sunan, harita üzerinde keşif imkânı veren ve kişiselleştirilmiş ya da elle oluşturulmuş gezi
            rotaları hazırlamanıza yardımcı olan bir web sitesidir. Bu sayfa, siteyi kullanırken hangi
            bilgilerin nasıl işlendiğini açıklar.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Hesap Oluşturmuyoruz</h2>
          <p className={paragraphClass}>
            Siteyi kullanmak için hesap oluşturmanız gerekmez. Bize isim, e-posta adresi, şifre veya
            başka bir kimlik bilgisi göndermeniz istenmez. Rota kaydetme ve puanlama gibi özellikler
            aşağıda açıklanan anonim bir tanımlayıcıyla çalışır — bu bir kullanıcı hesabı değildir.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Favoriler</h2>
          <p className={paragraphClass}>
            Favorilerinize eklediğiniz yerler sunucularımıza gönderilmez; yalnızca kendi tarayıcınızın
            yerel depolama alanında (localStorage) saklanır. Bu veriler cihazınızdan ayrılmaz; tarayıcı
            geçmişinizi/verilerinizi temizlediğinizde silinir ve başka bir cihazda görünmez.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Rotalar ve Değerlendirmeler (Anonim Tanımlayıcı)</h2>
          <p className={paragraphClass}>
            Bir yeri rotanıza eklediğinizde veya bir yeri puanladığınızda, bu bilgiyi cihazlar arasında
            kaybetmemeniz için sunucularımızda (Supabase altyapısında) saklarız. Bunu bir hesaba değil,
            tarayıcınıza ilk rota/puan işleminizde bir kez atanan, rastgele üretilmiş anonim bir
            tanımlayıcıya bağlarız; bu tanımlayıcı yalnızca ilgili tarayıcı üzerinden erişilebilen,
            HTTP-only (JavaScript ile okunamayan) bir çerezde tutulur. Tanımlayıcı isminizi,
            e-postanızı veya kimliğinizi içermez ve reklam ya da takip amacıyla kullanılmaz — tek amacı,
            &ldquo;bu rota/puan hangi tarayıcıya ait&rdquo; sorusunu cevaplamaktır.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Çerezler</h2>
          <p className={paragraphClass}>
            Site şu anda yalnızca yukarıda açıklanan, işlevsel amaçlı tek bir çerezi (rota/puan
            sahipliği için) kullanır. Reklam veya takip amaçlı çerez kullanmıyoruz ve şu anda bir
            analitik hizmeti (ör. Google Analytics) veya reklam hizmeti (ör. Google AdSense) aktif
            değil. Bunlardan biri ileride eklenirse, bu sayfa güncellenecek ve gerekli durumlarda bir
            çerez onay bildirimi gösterilecektir.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Üçüncü Taraf Hizmetler</h2>
          <p className={paragraphClass}>
            Harita özelliği, OpenStreetMap altyapısını kullanan Leaflet kütüphanesiyle çalışır; harita
            görüntülendiğinde tarayıcınız harita karolarını doğrudan OpenStreetMap sunucularından
            yükler. Bu istekler bu site tarafından kontrol edilmez ve OpenStreetMap&apos;in kendi
            gizlilik uygulamalarına tabidir. Kaydedilen rota ve puan verileri, Supabase (yönetilen
            veritabanı hizmeti) üzerinde barındırılır.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Veri Doğruluğu</h2>
          <p className={paragraphClass}>
            Sitedeki açılış saatleri, giriş ücretleri ve iletişim bilgileri kamuya açık kaynaklardan
            derlenmiştir ve bir kısmı bağımsız olarak teyit edilmemiş olabilir. Hangi bilginin
            doğrulanmış, hangisinin tahmini olduğunu{' '}
            <Link href="/veri-kaynaklari" className={linkClass}>
              Veri Kaynaklarımız
            </Link>{' '}
            sayfasında ayrıntılı şekilde açıklıyoruz. Ziyaret planlamadan önce resmi kaynakları kontrol
            etmenizi öneririz.
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
            Gizlilikle ilgili sorularınız için{' '}
            <Link href="/iletisim" className={linkClass}>
              İletişim
            </Link>{' '}
            sayfasından bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </Container>
  );
}
