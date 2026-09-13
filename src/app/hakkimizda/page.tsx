// app/hakkimizda/page.tsx — Hakkımızda (/hakkimizda)
// Rebuilt as an indexed ledger, not a stacked FAQ-style list: each
// section carries a large mono index numeral as its own column, the way
// the rest of the product marks sequence (route stops, discovery counts).
// Copy is unchanged from the previous version — only the architecture is new.

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

const rowClass = 'grid gap-2 border-t border-line py-8 sm:grid-cols-[4rem_1fr] sm:gap-6';
const numClass = 'font-mono text-xs uppercase tracking-[0.08em] text-faint';
const headingClass = 'font-display text-card-title text-strong';
const paragraphClass = 'mt-3 font-serif text-body-sm leading-relaxed text-muted';

export default function HakkimizdaPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§00 — Kurumsal</p>
      <h1 className="mt-1 font-display text-hero leading-[0.9] text-strong text-balance">Hakkımızda</h1>

      <p className="mt-6 max-w-xl font-serif text-2xl italic leading-relaxed text-ink-soft text-pretty">
        Kuzey Kıbrıs&apos;ı yalnızca görmek değil; anlamak, bağlamını bilmek ve kendi hızında keşfetmek
        için bir yer.
      </p>

      <div className="mt-10">
        <div className={rowClass}>
          <p className={numClass}>01</p>
          <div>
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
          </div>
        </div>

        <div className={rowClass}>
          <p className={numClass}>02</p>
          <div>
            <h2 className={headingClass}>Neden Var?</h2>
            <p className={paragraphClass}>
              Kuzey Kıbrıs hakkında bilgi dağınık: bir kısmı resmi kurum sitelerinde, bir kısmı eski
              forum yazılarında, bir kısmı hiçbir yerde değil. Biz bunu tek, güncel tutmaya çalıştığımız
              ve düzenli olarak gözden geçirdiğimiz bir kaynakta toplamaya çalışıyoruz — bir devlet
              kurumu ya da resmi turizm otoritesi olarak değil, adayı seven ve düzgün bir kaynak
              eksikliğini fark eden biri olarak.
            </p>
          </div>
        </div>

        <div className={rowClass}>
          <p className={numClass}>03</p>
          <div>
            <h2 className={headingClass}>Ne Yapabilirsiniz?</h2>
            <p className={paragraphClass}>Sitede şu anda yapabilecekleriniz:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-muted">
              <li>Müzeleri, kaleleri, arkeolojik alanları, tarihi yerleri, plajları ve kültürel mekânları kategoriye ve bölgeye göre keşfedin.</li>
              <li>Her yerin gerçek konumunu, çevresindeki diğer yerleri ve tarihsel arka planını okuyun.</li>
              <li>İnteraktif haritada adayı coğrafi olarak gezin.</li>
              <li>Beğendiğiniz yerleri kendi elinizle bir rotaya ekleyin, sırasını değiştirin ve kaydedin.</li>
              <li>Konaklama yeriniz, süreniz ve ilgi alanlarınıza göre otomatik bir çok günlük gezi programı oluşturun.</li>
              <li>Gittiğiniz veya bildiğiniz yerleri Gezeceyik Puanı ile değerlendirin.</li>
            </ul>
          </div>
        </div>

        <div className={rowClass}>
          <p className={numClass}>04</p>
          <div>
            <h2 className={headingClass}>Keşif + Tarih + Coğrafya + Rota Planlama</h2>
            <p className={paragraphClass}>
              Bir yeri sadece bir isim ve fotoğraf olarak göstermek yetmez diye düşünüyoruz. Bu yüzden dört
              şeyi bir arada sunuyoruz: nereye gidebileceğinizi bulmanızı sağlayan <strong className="font-medium text-strong">keşif</strong>,
              oraya neden gidilesi olduğunu anlatan <strong className="font-medium text-strong">tarih</strong>, onu adanın
              neresinde bulacağınızı gösteren <strong className="font-medium text-strong">coğrafya</strong>, ve tüm bunları
              gerçek bir günlük plana dönüştüren <strong className="font-medium text-strong">rota planlama</strong>. Ayrı ayrı
              araçlar yerine, tek bir akış içinde.
            </p>
          </div>
        </div>

        <div className={rowClass}>
          <p className={numClass}>05</p>
          <div>
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
          </div>
        </div>

        <div className={rowClass}>
          <p className={numClass}>06</p>
          <div>
            <h2 className={headingClass}>Sorularınız mı Var?</h2>
            <p className={paragraphClass}>
              Sık sorulan soruların cevaplarına{' '}
              <Link href="/sss" className="text-brand hover:underline">
                Sıkça Sorulan Sorular
              </Link>{' '}
              sayfasından ulaşabilir, ya da doğrudan bize yazabilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line pt-8">
          <Button href="/places">Keşfetmeye Başla</Button>
          <Button href="/iletisim" variant="secondary">
            Bize Ulaşın
          </Button>
        </div>
      </div>
    </Container>
  );
}
