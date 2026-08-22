# Cyprus Discovery

**Modern, mobil öncelikli bir Kıbrıs seyahat keşif platformu.**
Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve doğal güzellikler — Kıbrıs'ın altı bölgesinde filtrelenebilir, SEO-dostu bir rehber.

> ⚠️ Bu proje aktif geliştirme aşamasındadır. Tüm açılış saatleri, fiyatlar ve iletişim bilgileri **örnek verilerdir** — ziyaret etmeden önce resmi kaynaklardan doğrulayın.

---

## Proje Hakkında

Cyprus Discovery, yalnızca bir müze rehberi değil; müzeler, kaleler, arkeolojik alanlar, manastırlar, plajlar, seyir noktaları ve doğal güzellikler dahil olmak üzere tüm kategorilerdeki çekici yerleri kapsayan genel bir **Kıbrıs seyahat keşif platformu**dur.

### Hedefler

- Kıbrıs'taki yerleri keşfetmek ve filtrelemek
- Açılış saatleri, giriş ücretleri ve ulaşım bilgilerini görmek
- Premium bir seyahat ürünü hissi veren kaliteli bir arayüz sunmak
- Gelecekte: harita entegrasyonu, güzergah planlama, çok günlü gezi planları

---

## Teknoloji Yığını

| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| Next.js | 16.3.2 | App Router, SSG, metadata API |
| React | 19 | UI bileşenleri |
| TypeScript | 5 | Tip güvenliği |
| Tailwind CSS | v4 | CSS-first utility styling (`@theme inline`) |
| next/font | — | Inter + Playfair Display fontları |
| next/image | — | Optimize edilmiş görseller |

**Dış bağımlılık yok** — büyük UI kütüphanesi, state yönetim kütüphanesi veya veritabanı kullanılmamaktadır.

---

## Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
# → http://localhost:3000

# Production build
npm run build

# Lint kontrolü
npm run lint
```

---

## Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx                    # Kök layout — Navbar, Footer, fontlar, global metadata
│   ├── page.tsx                      # Ana sayfa /
│   ├── globals.css                   # Tailwind v4 @theme tokens, base styles
│   ├── not-found.tsx                 # Özel 404 sayfası
│   ├── sitemap.ts                    # Yer verilerinden otomatik sitemap
│   ├── robots.ts                     # robots.txt
│   ├── places/
│   │   ├── page.tsx                  # /places — tüm yerler + Suspense + filtreler
│   │   └── [slug]/page.tsx           # /places/[slug] — editorial detay sayfası (SSG)
│   ├── museums/page.tsx              # /museums — kategori landing
│   ├── castles/page.tsx              # /castles — kategori landing
│   ├── beaches/page.tsx              # /beaches — kategori landing
│   ├── historical-places/page.tsx    # /historical-places — kategori landing
│   └── coming-soon/page.tsx          # /coming-soon — Gezi Planı placeholder
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Sticky navbar — logo SVG, aktif underline, mobil drawer
│   │   └── Footer.tsx                # Site altbilgisi — logo SVG, amber uyarı, bağlantılar
│   ├── home/
│   │   ├── Hero.tsx                  # Koyu editorial hero, eyebrow label, stats bar, CTA çifti
│   │   ├── CategoryGrid.tsx          # 8 kategorili tile grid — inline SVG ikonlar
│   │   ├── RegionGrid.tsx            # 6 bölge hedef kartı — place count badge
│   │   ├── WhySection.tsx            # Değer önerisi — 4 özellik, koyu bg
│   │   └── HomeCTA.tsx               # Yatay CTA banner — koyu charcoal, editorial ton
│   ├── places/
│   │   ├── PlaceCard.tsx             # Görsel-dominant 4:3 kart — overlay badge, today hours
│   │   ├── PlaceGrid.tsx             # Responsive 3-sütun kart grid'i
│   │   ├── PlaceFilters.tsx          # Client Component — URL param'dan filtre init
│   │   └── PlaceInfoPanel.tsx        # Sticky visitor panel — hizalanmış saat tablosu
│   └── ui/
│       ├── SectionHeading.tsx        # Yeniden kullanılabilir başlık bileşeni
│       └── Badge.tsx                 # Kategori badge — overlay variant dahil
│
├── data/
│   └── places.ts                     # 14 örnek Place kaydı (7 kategori, temiz UTF-8)
│
├── types/
│   └── place.ts                      # Place TypeScript arayüzü
│
└── lib/
    ├── places.ts                     # Veri erişim katmanı (tek değişim noktası)
    └── categoryPage.ts               # Kategori sayfası yapılandırma yardımcısı
```

---

## Sayfalar ve Rotalar

| URL | Açıklama | Render Türü |
|---|---|---|
| `/` | Ana sayfa | Static |
| `/places` | Tüm yerler — filtrelenebilir | Static + Client (Suspense) |
| `/places/[slug]` | Editorial yer detay sayfası | SSG (generateStaticParams) |
| `/museums` | Müzeler kategori sayfası | Static + Client (Suspense) |
| `/castles` | Kaleler kategori sayfası | Static + Client (Suspense) |
| `/beaches` | Plajlar kategori sayfası | Static + Client (Suspense) |
| `/historical-places` | Tarihi yerler kategori sayfası | Static + Client (Suspense) |
| `/coming-soon` | Gezi planı placeholder | Static |
| `/sitemap.xml` | Yer verilerinden otomatik sitemap | — |
| `/robots.txt` | robots.txt | — |

---

## Veri Modeli (`Place`)

Temel varlık `Place`'dir — müze, kale, plaj, manastır veya seyir noktası olsun her çekici yer bir `Place`'dir. `category` alanı türü belirler.

```typescript
interface Place {
  id: string;
  name: string;
  slug: string;
  category: Category;          // 'Museum' | 'Castle' | 'Beach' | ...
  city: string;
  region: Region;              // 'Nicosia' | 'Limassol' | 'Paphos' | ...
  shortDescription: string;   // Kartlarda kullanılır
  description: string;        // Detay sayfasında kullanılır
  history?: string;           // Opsiyonel — plajlar/seyir noktaları için gerekmez
  image: string;
  gallery?: string[];
  openingHours?: OpeningHours; // Opsiyonel — açık hava alanları için gerekmez
  admission?: Admission;       // Opsiyonel — ücretsiz alanlar için gerekmez
  phone?: string;
  website?: string;
  address: string;
  latitude: number;
  longitude: number;
  accessibility?: Accessibility;
  estimatedVisitMinutes?: number;
  featured: boolean;
  nearbyPlaceSlugs?: string[];
  sourceUrl?: string;
  lastVerifiedAt?: string;
  verificationStatus: 'sample' | 'unverified' | 'verified';
}
```

---

## Örnek Veriler (14 Kayıt, 7 Kategori)

| Yer | Kategori | Bölge | Öne Çıkan |
|---|---|---|---|
| Cyprus Museum | Müze | Lefkoşa | ✓ |
| Leventis Municipal Museum | Müze | Lefkoşa | ✓ |
| Byzantine Museum | Müze | Lefkoşa | — |
| Kyrenia Castle | Kale | Girne | ✓ |
| Limassol Medieval Castle | Kale | Limassol | ✓ |
| Kolossi Castle | Kale | Limassol | — |
| Paphos Archaeological Park | Arkeolojik Alan | Baf | ✓ |
| Kourion Ancient Theatre | Arkeolojik Alan | Limassol | — |
| Bellapais Abbey | Tarihi Yer | Girne | ✓ |
| Kykkos Monastery | Manastır | Lefkoşa (Troodos) | — |
| Hala Sultan Tekke | Kültürel Alan | Larnaka | — |
| Cape Greco | Doğal Güzellik | Gazimağusa | ✓ |
| Fig Tree Bay | Plaj | Gazimağusa | — |
| Aphrodite Hills Viewpoint | Seyir Noktası | Baf | — |

---

## Veri Erişim Katmanı

Tüm veri okuma işlemleri `lib/places.ts` üzerinden geçer:

```typescript
getAllPlaces()                    // Tüm yerler
getPlaceBySlug(slug)              // Slug'a göre tek yer
getPlacesByCategory(category)     // Kategoriye göre filtrele
getPlacesByRegion(region)         // Bölgeye göre filtrele
getFeaturedPlaces()               // Öne çıkan yerler
filterPlaces({ region, category, isFree, query })  // Kombine filtre
getAllPlaceSlugs()                 // SSG için tüm slug'lar
getNearbyPlaces(place)            // Yakındaki yerler
```

> **Supabase'e geçiş:** Yalnızca `lib/places.ts` dosyasının implementasyonu değiştirilir — sayfalar ve bileşenler değişmez.

---

## SEO Yapısı

- Her sayfada `metadata` export'u (title + description)
- `/places/[slug]`'da `generateMetadata` — her yer için dinamik başlık ve Open Graph
- `/sitemap.xml` — yer verilerinden otomatik oluşturulur
- `/robots.txt` — üretim dostu kurallar
- Semantic HTML: `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
- Erişilebilir başlık hiyerarşisi (h1 → h2 → h3)
- Tüm görsellerde açıklayıcı `alt` metni
- Kategori sayfaları kendi SEO metadata'larına sahip (müze sayfası ≠ kale sayfası)

---

## Tasarım Sistemi

### Renkler

| Token | Değer | Kullanım |
|---|---|---|
| Orange accent | `#E8651A` | CTA butonları, aktif durum, eyebrow etiketler |
| Charcoal | `#1A1A1A` | Hero arka planları, koyu bölümler |
| Charcoal soft | `#2D2D2D` | İkincil koyu yüzeyler |
| Warm white | `#FAFAF8` | Sayfa arka planı |
| Stone light | `#F5F2EE` | Kart ve bölüm arka planları |
| Stone dark | `#E8E4DE` | Ayırıcılar, kenarlıklar |
| Muted | `#6B7280` | İkincil metin |

### Tipografi

- **Playfair Display** — editorial başlıklar (`font-display`)
- **Inter** — gövde metni, UI etiketleri

### Tasarım İlkeleri

- Turuncu yalnızca accent/action olarak kullanılır — ana arka plan değil
- Bol beyaz alan ve hiyerarşik boşluk ritmi
- Karanlık hero ve CTA bölümleri (`#1A1A1A`)
- Temiz kart grid'i — görsel öncelikli, gölge minimaldir
- Eyebrow etiketleri (`text-xs uppercase tracking-widest text-orange`) her bölüm başlığında tutarlı desen
- SVG ikonlar — dış kütüphane yok (Heroicons stili inline SVG)

---

## Mimari Kararlar

1. **`Place` modeli — Müzeye özgü değil** → `category` bir alan, bir tip kısıtlaması değil. Plaj, kale veya manastır ayrımı aynı modelle yapılır.
2. **Server Components öncelikli** → Yalnızca `Navbar` (mobil menü) ve `PlaceFilters` (URL state) Client Component'tır.
3. **`lib/places.ts` veri katmanı** → Tüm okumalar bu dosyadan geçer. Supabase geçişi yalnızca bu dosyayı değiştirerek olur.
4. **Kategori landing sayfaları ince wrapper'lardır** → `museums/page.tsx` ~30 satır. Yeni kategori eklemek ~20 satır.
5. **`generateStaticParams`** → 14 detay sayfasının tamamı build zamanında pre-render edilir.
6. **Opsiyonel alanlar** → `openingHours`, `admission`, `phone`, `website`, `history` tip seviyesinde opsiyonel. Plajlar ve seyir noktaları bunlara ihtiyaç duymaz.
7. **`<Suspense>` + `useSearchParams`** → Filtre bileşeni URL parametrelerinden başlar (`?category=Museum`), bu nedenle `<Suspense>` ile sarılır. Sayfa statik olarak render edilir, filtreler client-side çalışır.
8. **`overlay` Badge variant** → Kart görselleri ve hero görseli üzerine yerleştirilen kategori etiketleri için özel `backdrop-blur` variant.

---

## UI/UX İyileştirme Geçmişi

### Aşama 1 — Mimari Kurulum (MVP)
- Next.js App Router + TypeScript + Tailwind v4 kurulumu
- Genel `Place` modeli tasarımı (müze-spesifik değil)
- `lib/places.ts` veri erişim katmanı
- Tüm rotalar ve SEO yapısı
- 14 örnek `Place` kaydı (7 kategori)
- Kategori landing sayfaları: `/museums`, `/castles`, `/beaches`, `/historical-places`
- `sitemap.xml` ve `robots.txt`
- Özel 404 sayfası

### Aşama 2 — UTF-8 Düzeltmesi
- `data/places.ts` dosyasındaki tüm mojibake (`â€"`) karakterleri `\u2013` ile değiştirildi
- Saat ve açıklama metinleri temizlendi

### Aşama 3 — UI/UX Premium Tasarım Geçişi
*"İyi MVP"den "güvenilir premium Kıbrıs seyahat ürünü"ne geçiş*

#### Navbar
- `CD` metin logosundan SVG logo işaretine geçildi
- Aktif sayfa için turuncu alt çizgi göstergesi
- Mobil hamburger drawer — `Plan your visit` CTA dahil
- Sticky + backdrop-blur

#### Hero
- Koyu cinematic arka plan (`#1A1A1A`) + subtle grain texture
- Eyebrow label + Playfair Display editorial başlık
- İki CTA butonu (primary + ghost)
- Stats bar (place count, region count, vb.) definition list olarak

#### PlaceCard
- 4:3 görsel oranı, hover scale animasyonu
- Kategori badge görsel üzerine overlay (backdrop-blur, beyaz)
- Ücretsiz giriş için yeşil "Free" badge sağ üst köşede
- Bugünün saatleri footer meta'da gösterilir
- Konum ikonu + "City, Region" alt metin

#### PlaceInfoPanel
- Sticky sidebar (desktop `lg:sticky lg:top-20`)
- Haftanın saatleri — hizalanmış tablo, bugün turuncu nokta ile vurgulanır
- İkon etiketli satır grupları (Adres, Giriş, Saat, İletişim, Erişilebilirlik)
- "Open today · 08:00–17:00" yeşil durum göstergesi
- Ziyaret süresi otomatik saat/dakika formatlama
- Website URL kısaltma (protokol kaldırılır)
- "Get directions" → Google Maps CTA butonu

#### CategoryGrid
- Emoji kaldırıldı → her kategori için inline SVG ikon
- Hover: ikon arka planı turuncu'ya döner
- Her kartın altında açıklayıcı alt metin

#### RegionGrid
- `bg-[#f5f2ee]` arka plan bölümü
- Her bölge için place count göstergesi
- Highlight tag pills

#### WhySection
- Eyebrow label eklendi
- Dolu kare yerine kenarlıklı ikon container
- Daha sıkı metin hiyerarşisi

#### HomeCTA
- Solid turuncu arka plandan koyu charcoal'a geçildi (daha az agresif)
- Desktop'ta yatay düzen
- Eyebrow label + editorial ton

#### Footer
- `CD` metin logosundan aynı Navbar SVG logosu kullanımına geçildi
- Amber renkli veri uyarısı (uyarı bölümü öne çıkarıldı)
- Daha koyu temel renk (`#111111`)

#### PlaceFilters
- URL parametrelerinden başlangıç durumu (`?category=`, `?region=`)
- Arama kutusunda search ikonu (sol iç kenar)
- Tüm kontroller tutarlı `h-10` yüksekliği
- "Clear" butonu → XIcon + "Clear" etiketi
- Sonuç sayısı daha küçük ve az belirgin

#### Place Detail Sayfası
- 16:7 sinematik hero oranı
- Gradyan katman (alta doğru kararan), overlay breadcrumb
- Overlay CategoryBadge hero üzerinde
- h1 başlık + konum ikonu hero içinde
- Sol: editorial metin, tarih bölümü, amber uyarı kutusu
- Sağ: sticky PlaceInfoPanel
- "Nearby places" bölümü eyebrow etiketiyle

#### Tüm Kategori Sayfaları
- Tutarlı eyebrow + `h1` başlık deseni
- `<Suspense>` wrapper (useSearchParams için gerekli)
- Skeleton fallback animasyonu

#### globals.css
- `prose-body` yardımcı class (okuma genişliği)
- `tabular-nums` class (saat tablosu için)
- WebKit scrollbar stili
- Açık `font-size: 16px` ve `line-height: 1.6`

#### Badge
- `overlay` variant eklendi (beyaz/backdrop-blur, görsel üzeri kullanım için)
- `CategoryBadge` → `overlay` prop kabul eder
- `rounded-sm` tutarlılığı

---

## Mevcut Durum vs. Üretim Hazır

| Bileşen | Durum | Not |
|---|---|---|
| Place TypeScript modeli | ✅ Üretim hazır | Genel — tüm kategorileri destekler |
| Veri erişim katmanı | ✅ Üretim hazır | Supabase geçişi için tek dosya değişikliği |
| Routing ve sayfa yapısı | ✅ Üretim hazır | App Router, SSG, Suspense, kategori landing pattern |
| SEO metadata | ✅ Üretim hazır | Her sayfa için benzersiz metadata |
| Filtre / arama mantığı | ✅ Üretim hazır | URL param başlangıcı, client-side MVP |
| Bileşen mimarisi | ✅ Üretim hazır | Yeniden kullanılabilir, tiplenmiş, iyi ayrılmış |
| Tasarım sistemi | ✅ Üretim hazır | Tutarlı token'lar, tipografi, boşluk ritmi |
| 14 yer kaydı | ⚠️ ÖRNEK VERİ | Saatler, fiyatlar, telefonlar doğrulanmamış |
| Görseller | ⚠️ ÖRNEK | Unsplash URL'leri — lisanslı fotoğraflarla değiştirilmeli |
| `metadataBase` URL | ⚠️ GÜNCELLENECEK | `layout.tsx`'deki URL gerçek domain ile değiştirilmeli |

---

## Yapılacaklar — Sonraki Adımlar

### Milestone 1 — Gerçek İçerik
- [ ] Resmi müze/çekim sitelerinden doğrulanmış saatler ve fiyatlar
- [ ] Lisanslı fotoğraflar veya kendi çekimler → `/public/images/places/`
- [ ] `verificationStatus`'u `'sample'`'dan `'verified'`'e güncelle
- [ ] Gerçek domain → `layout.tsx`'deki `metadataBase` güncelle

### Milestone 2 — Harita Entegrasyonu
- [ ] Leaflet + OpenStreetMap'i yerler listesi sayfasına ekle
- [ ] Haritada pin'ler → tıklama → kart vurgulama
- [ ] Detay sayfasına mini harita ekle (PlaceInfoPanel içinde)
- [ ] `Place` modeline `latitude` / `longitude` verisini doğrula

### Milestone 3 — Veritabanı
- [ ] `data/places.ts`'yi Supabase PostgreSQL'e taşı (yalnızca `lib/places.ts` değişir)
- [ ] Supabase `to_tsvector` ile tam metin arama (server-side)
- [ ] Yer kayıtları yönetimi için admin dashboard

### Milestone 4 — Büyüme
- [ ] Çok dilli içerik (`next-intl` — Türkçe, Rum Yunancası, Rusça)
- [ ] Daha fazla kategori sayfası (`/archaeological-sites`, `/monasteries`, `/nature`)
- [ ] Gezi planlayıcı — çok kategorili güzergah oluşturucu
- [ ] Analitik (Plausible veya PostHog)
- [ ] Sponsorlu işletmeler ve öne çıkan listeler (gelir modeli)

---

## Build Durumu

```
✅ npm run build   → 0 hata, 0 uyarı
✅ npm run lint    → 0 hata
✅ 26 static sayfa pre-render edildi
✅ TypeScript → hata yok
```

```
Route (app)
○ /                          (Static)
○ /beaches                   (Static)
○ /castles                   (Static)
○ /coming-soon               (Static)
○ /historical-places         (Static)
○ /museums                   (Static)
○ /places                    (Static + Suspense)
● /places/[slug]             (SSG — 14 sayfa)
○ /robots.txt
○ /sitemap.xml
```

---

*Cyprus Discovery — Kıbrıs'ın tarihini, kültürünü ve doğal güzelliklerini keşfetmeye giden ilk adım.*
