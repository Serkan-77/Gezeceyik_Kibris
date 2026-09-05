// app/sss/page.tsx — Sıkça Sorulan Sorular (/sss)
// Native <details>/<summary> per question — zero JS, fully keyboard
// accessible and correctly exposes expanded/collapsed state to assistive
// tech via native semantics (no custom aria-expanded wiring needed), and
// the answer text is still present in the server-rendered HTML for
// crawlers even while visually collapsed. Deliberately not FAQPage
// JSON-LD — see the launch report for why (Google restricted FAQ rich
// results to a narrow set of government/health sites in 2023; adding the
// schema for a general travel site like this one would not produce a
// rich result and would just be schema for its own sake).

import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'Rota oluşturma, Gezeceyik Puanı, favoriler ve veri güncelliği hakkında sıkça sorulan sorular.',
  alternates: { canonical: '/sss' },
  robots: { index: true, follow: true },
};

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const GROUPS: FaqGroup[] = [
  {
    title: 'Genel',
    items: [
      {
        q: 'Gezeceyik Kıbrıs nedir?',
        a: (
          <>
            Kuzey Kıbrıs&apos;taki müzeleri, kaleleri, arkeolojik alanları, tarihi yerleri, plajları ve
            kültürel mekânları keşfetmenizi, haritada bulmanızı ve kendi rotanızı ya da otomatik bir
            gezi programı oluşturmanızı sağlayan bir platform.{' '}
            <Link href="/hakkimizda" className="text-brand hover:underline">
              Hakkımızda
            </Link>{' '}
            sayfasında daha fazlasını okuyabilirsiniz.
          </>
        ),
      },
      {
        q: 'Siteyi kullanmak ücretsiz mi?',
        a: 'Evet. Yer keşfetmek, harita kullanmak, rota oluşturmak, gezi planlamak ve puan vermek için ücret ödemeniz veya hesap açmanız gerekmez.',
      },
      {
        q: 'Favoriler nasıl çalışıyor?',
        a: 'Bir yeri favorilere eklediğinizde bu bilgi yalnızca kendi tarayıcınızda (localStorage) saklanır, sunucularımıza gönderilmez. Bu yüzden favorileriniz başka bir cihazda görünmez ve tarayıcı verilerinizi temizlerseniz kaybolur.',
      },
    ],
  },
  {
    title: 'Rota Oluşturma',
    items: [
      {
        q: 'Rota nasıl oluşturulur?',
        a: (
          <>
            İki yolu var. Bir yerin sayfasındaki &ldquo;Rotaya Ekle&rdquo; butonuyla kendi rotanızı elle
            oluşturabilir, sıralayabilir ve kaydedebilirsiniz. Ya da{' '}
            <Link href="/gezi-planla" className="text-brand hover:underline">
              Gezi Planla
            </Link>{' '}
            sayfasından konaklama yeriniz, süreniz ve ilgi alanlarınıza göre otomatik bir çok günlük
            program oluşturabilirsiniz. İkisi de aynı gezi ürününün iki farklı kullanım şekli.
          </>
        ),
      },
      {
        q: 'Rotaya nasıl yer eklerim?',
        a: 'Herhangi bir yerin sayfasında "Rotaya Ekle" butonuna basmanız yeterli. Eklediğiniz yerler mevcut rotanıza katılır ve site genelinde (üst menüdeki "Rotam" bağlantısında) görünür.',
      },
      {
        q: 'Rotamı kaydedebilir miyim?',
        a: 'Evet. Rotanızı /rotam sayfasında adlandırıp kaydedebilir, daha sonra Gezilerim sayfasından tekrar açıp düzenleyebilir veya silebilirsiniz. Hesap açmanız gerekmez — rotanız, tarayıcınıza atanan anonim bir tanımlayıcıyla ilişkilendirilir (bkz. Gizlilik Politikası).',
      },
      {
        q: 'Otomatik gezi planlayıcı nasıl çalışıyor?',
        a: 'Konaklama yeriniz, gün sayınız, ulaşım tercihiniz ve ilgi alanlarınızı temel alarak yerleri puanlar, konaklama noktanızdan başlayarak en mantıklı sırayla dizer ve günlere böler. Elle rotaya eklediğiniz yerler varsa programda önceliklendirilir.',
      },
      {
        q: 'Haritadaki rota gerçek yol güzergâhı mı?',
        a: 'Hayır. Duraklar arasındaki çizgi, gerçek bir karayolu güzergâhını değil, yalnızca ziyaret sırasını gösteren soyut bir bağlantıdır. Gerçek yol güzergâhı/navigasyon verimiz yok.',
      },
      {
        q: 'Yolculuk süreleri kesin mi?',
        a: 'Hayır, tahminidir. Mesafe ve süreler iki nokta arasındaki kuş uçuşu mesafeden hesaplanır; trafik, yol durumu veya mevsimsel etkenler hesaba katılmaz. Kesin süre için harita/navigasyon uygulamanızı kullanmanızı öneririz.',
      },
      {
        q: 'Toplu taşıma bilgileri nasıl kullanılıyor?',
        a: 'Gezi planlayıcıda toplu taşıma seçildiğinde, elimizdeki gerçek otobüs hattı verileri (işletmeci, güzergâh, yaklaşık süre) varsa kullanılır. Bu veriler değişebilir; kesin kalkış saatleri için işletmeciyi teyit etmenizi öneririz.',
      },
    ],
  },
  {
    title: 'Gezeceyik Puanı',
    items: [
      {
        q: 'Gezeceyik Puanı nedir?',
        a: 'Ziyaretçilerin bir yeri 1-5 yıldız arasında değerlendirdiği topluluk puanıdır. Yeterli oy olmayan yerlerde "Henüz puanlanmadı" yazar; hiçbir zaman sahte veya tahmini bir ortalama göstermeyiz.',
      },
      {
        q: 'Bir yeri puanlamak için oraya gitmiş olmam gerekiyor mu?',
        a: 'Hayır. Bu doğrulanmış ziyaret gerektiren bir sistem değildir — check-in veya konum doğrulaması istemiyoruz. Yeri biliyor veya değerlendirecek kadar bilgi sahibi olduğunuzu düşünüyorsanız puan verebilirsiniz.',
      },
      {
        q: 'Puanımı değiştirebilir miyim?',
        a: 'Evet, istediğiniz zaman aynı yere tekrar puan vererek önceki puanınızı güncelleyebilirsiniz; ikinci bir oy olarak eklenmez.',
      },
    ],
  },
  {
    title: 'Veri ve Güncellik',
    items: [
      {
        q: 'Açılış saatleri ne kadar güncel?',
        a: (
          <>
            Kaynağından alındığı haliyle gösterilir ama gerçek zamanlı değildir; müzeler ve kaleler
            mevsimsel saat değiştirebilir veya geçici olarak kapanabilir. Ayrıntı için{' '}
            <Link href="/veri-kaynaklari" className="text-brand hover:underline">
              Veri Kaynaklarımız
            </Link>{' '}
            sayfasına bakın.
          </>
        ),
      },
      {
        q: 'Giriş ücretleri değişebilir mi?',
        a: 'Evet, değişebilir. Gösterdiğimiz ücretler kaynağından alındığı haliyledir; önemli bir ziyaret öncesi resmi kaynaktan teyit almanızı öneririz.',
      },
      {
        q: 'Bilgiler nereden geliyor?',
        a: (
          <>
            Resmi kurum siteleri, turizm portalları ve kamuya açık kaynaklardan. Hangi yerin
            doğrulandığını, hangisinin doğrulanmadığını her yer sayfasında belirtiyoruz. Tüm kaynak
            listesi için{' '}
            <Link href="/veri-kaynaklari" className="text-brand hover:underline">
              Veri Kaynaklarımız
            </Link>{' '}
            sayfasına bakabilirsiniz.
          </>
        ),
      },
      {
        q: 'Yanlış bilgi fark edersem ne yapabilirim?',
        a: (
          <>
            Lütfen bize bildirin —{' '}
            <Link href="/iletisim" className="text-brand hover:underline">
              İletişim
            </Link>{' '}
            sayfasındaki &ldquo;Yanlış bilgi bildirimi&rdquo; seçeneğini kullanabilirsiniz.
          </>
        ),
      },
    ],
  },
];

export default function SssPage() {
  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <h1 className="mb-2 font-display text-block-title font-semibold text-strong">Sıkça Sorulan Sorular</h1>
      <p className="mb-10 max-w-xl text-body leading-relaxed text-muted">
        Rota oluşturma, Gezeceyik Puanı ve verilerimiz hakkında en çok sorulanlar.
      </p>

      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-label font-semibold uppercase tracking-wider text-subtle">{group.title}</h2>
            <div className="divide-y divide-line border-y border-line">
              {group.items.map((item) => (
                <details key={item.q} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-body font-medium text-strong [&::-webkit-details-marker]:hidden">
                    <h3 className="inline text-body font-medium text-strong">{item.q}</h3>
                    <span className="shrink-0 text-lg leading-none text-subtle transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="pb-4 pr-8 text-body-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
