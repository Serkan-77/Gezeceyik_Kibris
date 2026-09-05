// app/hakkimizda/page.tsx — Hakkımızda (/hakkimizda)
// Static content page, editorial tone matching the rest of the site
// (Fraunces display type for the mission statement, restrained copy —
// no startup/marketing language, no unsupported authority claims).

import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'Gezeceyik Kıbrıs nedir, kimler için ve neden var? Kuzey Kıbrıs\'ı keşfetmek, anlamak ve kendi rotanızı çıkarmak için tek bir platform.',
  alternates: { canonical: '/hakkimizda' },
  robots: { index: true, follow: true },
};

const sectionClass = 'space-y-3';
const headingClass = 'font-display text-card-title font-semibold text-strong';
const paragraphClass = 'text-body-sm leading-relaxed text-muted';

export default function HakkimizdaPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <h1 className="mb-4 font-display text-block-title font-semibold text-strong">Hakkımızda</h1>

      <p className="mb-10 max-w-2xl font-display text-block-title italic leading-relaxed text-ink-soft text-pretty">
        Kuzey Kıbrıs&apos;ı yalnızca görmek değil; anlamak, bağlamını bilmek ve kendi hızında keşfetmek
        için bir yer.
      </p>

      <div className="space-y-8">
        <section className={sectionClass}>
          <h2 className={headingClass}>Gezeceyik Kıbrıs Nedir?</h2>
          <p className={paragraphClass}>
            Gezeceyik Kıbrıs, Kuzey Kıbrıs&apos;taki müzeleri, kaleleri, arkeolojik alanları, tarihi
            yerleri, plajları ve kültürel mekânları tek bir yerden keşfetmenizi sağlayan bir gezi
            platformudur. Her yer için açılış saatleri, giriş ücretleri, konum ve tarihsel bağlam gibi
            pratik bilgileri bir araya getiriyoruz; nereden geldiğini de{' '}
            <Link href="/veri-kaynaklari" className="text-brand hover:underline">
              Veri Kaynaklarımız
            </Link>{' '}
            sayfasında açıkça anlatıyoruz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Neden Var?</h2>
          <p className={paragraphClass}>
            Kuzey Kıbrıs hakkında bilgi dağınık: bir kısmı resmi kurum sitelerinde, bir kısmı eski
            forum yazılarında, bir kısmı hiçbir yerde değil. Biz bunu tek, güncel tutmaya çalıştığımız
            ve düzenli olarak gözden geçirdiğimiz bir kaynakta toplamaya çalışıyoruz — bir devlet
            kurumu ya da resmi turizm otoritesi olarak değil, adayı seven ve düzgün bir kaynak
            eksikliğini fark eden biri olarak.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Ne Yapabilirsiniz?</h2>
          <p className={paragraphClass}>Sitede şu anda yapabilecekleriniz:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-muted">
            <li>Müzeleri, kaleleri, arkeolojik alanları, tarihi yerleri, plajları ve kültürel mekânları kategoriye ve bölgeye göre keşfedin.</li>
            <li>Her yerin gerçek konumunu, çevresindeki diğer yerleri ve tarihsel arka planını okuyun.</li>
            <li>İnteraktif haritada adayı coğrafi olarak gezin.</li>
            <li>Beğendiğiniz yerleri kendi elinizle bir rotaya ekleyin, sırasını değiştirin ve kaydedin.</li>
            <li>Konaklama yeriniz, süreniz ve ilgi alanlarınıza göre otomatik bir çok günlük gezi programı oluşturun.</li>
            <li>Gittiğiniz veya bildiğiniz yerleri Gezeceyik Puanı ile değerlendirin.</li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Keşif + Tarih + Coğrafya + Rota Planlama</h2>
          <p className={paragraphClass}>
            Bir yeri sadece bir isim ve fotoğraf olarak göstermek yetmez diye düşünüyoruz. Bu yüzden dört
            şeyi bir arada sunuyoruz: nereye gidebileceğinizi bulmanızı sağlayan <strong className="font-medium text-strong">keşif</strong>,
            oraya neden gidilesi olduğunu anlatan <strong className="font-medium text-strong">tarih</strong>, onu adanın
            neresinde bulacağınızı gösteren <strong className="font-medium text-strong">coğrafya</strong>, ve tüm bunları
            gerçek bir günlük plana dönüştüren <strong className="font-medium text-strong">rota planlama</strong>. Ayrı ayrı
            araçlar yerine, tek bir akış içinde.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Bilmeniz Gereken Sınırlar</h2>
          <p className={paragraphClass}>
            Resmi bir devlet kurumu ya da turizm otoritesi değiliz ve öyle davranmıyoruz. Verilerimizin
            bir kısmı resmi kaynaklarla doğrulanmış, büyük kısmı ise kamuya açık kaynaklardan derlenmiş
            ve bağımsız olarak teyit edilmemiştir — hangisinin hangisi olduğunu her yer sayfasında
            açıkça belirtiyoruz. Açılış saatleri ve fiyatlar değişebilir; önemli bir ziyaret öncesi
            resmi kaynaklardan teyit almanızı öneririz. Ayrıntı için{' '}
            <Link href="/veri-kaynaklari" className="text-brand hover:underline">
              Veri Kaynaklarımız
            </Link>{' '}
            sayfasına bakabilirsiniz.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Sorularınız mı Var?</h2>
          <p className={paragraphClass}>
            Sık sorulan soruların cevaplarına{' '}
            <Link href="/sss" className="text-brand hover:underline">
              Sıkça Sorulan Sorular
            </Link>{' '}
            sayfasından ulaşabilir, ya da doğrudan bize yazabilirsiniz.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button href="/places">Keşfetmeye Başla</Button>
          <Button href="/iletisim" variant="secondary">
            Bize Ulaşın
          </Button>
        </div>
      </div>
    </Container>
  );
}
