# Cyprus Discovery

**Modern, mobil öncelikli bir Kuzey Kıbrıs seyahat keşif platformu.**
Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve doğal güzellikler — Kuzey Kıbrıs'ın altı bölgesinde filtrelenebilir, SEO-dostu bir rehber. İnteraktif harita ve çok günlük gezi planlayıcısı dahil.

> ⚠️ Bu proje aktif geliştirme aşamasındadır. Tüm açılış saatleri, fiyatlar ve iletişim bilgileri **örnek verilerdir** — ziyaret etmeden önce resmi kaynaklardan doğrulayın.

---

## Proje Hakkında

Cyprus Discovery, yalnızca bir müze rehberi değil; müzeler, kaleler, arkeolojik alanlar, manastırlar, plajlar, seyir noktaları ve doğal güzellikler dahil olmak üzere tüm kategorilerdeki çekici yerleri kapsayan genel bir **Kuzey Kıbrıs seyahat keşif platformu**dur.

### Hedefler

- Kuzey Kıbrıs'taki yerleri keşfetmek ve filtrelemek
- Açılış saatleri, giriş ücretleri ve ulaşım bilgilerini görmek
- İnteraktif harita üzerinde yerleri keşfetmek
- Konaklama yerine, süreye ve ilgi alanlarına göre kişiselleştirilmiş çok günlük gezi planı oluşturmak
- Premium bir seyahat ürünü hissi veren kaliteli bir arayüz sunmak

---

## Teknoloji Yığını

| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| Next.js | 16.3.2 | App Router, SSG, metadata API |
| React | 19 | UI bileşenleri |
| TypeScript | 5 | Tip güvenliği |
| Tailwind CSS | v4 | CSS-first utility styling (`@theme inline`) |
| Leaflet + react-leaflet | — | İnteraktif harita (OpenStreetMap tile'ları) |
| next/font | — | Inter + Playfair Display fontları |
| next/image | — | Optimize edilmiş görseller |

**Dış veri bağımlılığı yok** — büyük UI kütüphanesi, state yönetim kütüphanesi veya veritabanı kullanılmamaktadır. Favoriler ve gezi seçimleri `localStorage`'da tutulur.

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

Production build'den önce site domain'ini `NEXT_PUBLIC_SITE_URL` ortam değişkeniyle ayarlayın (bkz. [Site URL Konfigürasyonu](#site-url-konfigürasyonu)); ayarlanmazsa build `http://localhost:3000` varsayılanını kullanır.

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
│   ├── harita/page.tsx               # /harita — interaktif Leaflet haritası
│   ├── gezi-planla/page.tsx          # /gezi-planla — çok günlük gezi planlayıcı sihirbazı
│   └── favoriler/page.tsx            # /favoriler — kaydedilen yerler (localStorage)
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
│   │   ├── PlaceCard.tsx             # Görsel-dominant 4:3 kart — favori/geziye ekle overlay, today hours
│   │   ├── PlaceGrid.tsx             # Responsive 3-sütun kart grid'i
│   │   ├── PlaceFilters.tsx          # Client Component — URL param'dan filtre init
│   │   └── PlaceInfoPanel.tsx        # Sticky visitor panel — mini harita, saat tablosu
│   ├── map/
│   │   ├── PlacesMap.tsx             # Tüm yerleri gösteren ana Leaflet haritası (kategori renkli pin'ler)
│   │   ├── PlacesMapWrapper.tsx      # SSR-safe dynamic import wrapper (ana harita)
│   │   ├── PlaceMiniMap.tsx          # Tek yer için mini Leaflet haritası (detay sayfası)
│   │   └── PlaceMiniMapWrapper.tsx   # SSR-safe dynamic import wrapper (mini harita)
│   ├── trip/
│   │   ├── PlannerWizardClient.tsx   # 5 adımlı gezi planlama sihirbazı
│   │   └── ItineraryView.tsx         # Oluşturulan planın gün gün zaman çizelgesi görünümü
│   └── ui/
│       ├── SectionHeading.tsx        # Yeniden kullanılabilir başlık bileşeni
│       ├── Badge.tsx                 # Kategori badge — overlay variant dahil
│       ├── FavoriteButton.tsx        # Kalp ikonu — useFavorites ile senkron
│       └── AddToTripButton.tsx       # "+" ikonu — useTripSelection ile senkron
│
├── data/
│   └── places.ts                     # 21 örnek Place kaydı (7+ kategori, temiz UTF-8)
│
├── hooks/
│   ├── useFavorites.ts               # localStorage tabanlı favori yönetimi
│   ├── useTripSelection.ts           # localStorage tabanlı "geziye eklenenler" listesi
│   ├── useTodayKey.ts                # "Bugün"ün açılış-saati anahtarını mount sonrası hesaplar (SSG hydration güvenli)
│   └── useGeolocation.ts             # Tarayıcı Geolocation API sarmalayıcısı
│
├── lib/
│   ├── places.ts                     # Veri erişim katmanı (tek değişim noktası)
│   ├── categoryPage.ts               # Kategori sayfası yapılandırma yardımcısı
│   ├── config.ts                     # Ortam tabanlı site konfigürasyonu (SITE_URL)
│   ├── i18n/tr.ts                    # Türkçe metin sabitleri
│   └── trip-planner/
│       ├── types.ts                  # Planlayıcı domain tipleri (PlannerInput, TripItinerary, ...)
│       ├── distance.ts               # Haversine mesafe + araç/yürüyüş/toplu taşıma süre tahmini
│       ├── scoring.ts                # Her yer için ilgi/mesafe/must-visit skorlama
│       ├── scheduleDay.ts            # Sıralı yer listesinden zamanlanmış gün programı üretir
│       └── planner.ts                # Ana giriş noktası — seç, kümele, zamanla, TripItinerary döndür
│
└── types/
    └── place.ts                      # Place TypeScript arayüzü
```

---

## Sayfalar ve Rotalar

| URL | Açıklama | Render Türü |
|---|---|---|
| `/` | Ana sayfa | Static |
| `/places` | Tüm yerler — filtrelenebilir | Static + Client (Suspense) |
| `/places/[slug]` | Editorial yer detay sayfası + mini harita | SSG (generateStaticParams) |
| `/museums` | Müzeler kategori sayfası | Static + Client (Suspense) |
| `/castles` | Kaleler kategori sayfası | Static + Client (Suspense) |
| `/beaches` | Plajlar kategori sayfası | Static + Client (Suspense) |
| `/historical-places` | Tarihi yerler kategori sayfası | Static + Client (Suspense) |
| `/harita` | Tüm yerlerin interaktif haritası | Static + Client (Leaflet) |
| `/gezi-planla` | Çok günlük gezi planlayıcı sihirbazı | Static + Client |
| `/favoriler` | Kaydedilen yerler (localStorage, indexlenmez) | Static + Client |
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
  region: Region;              // 'Lefkoşa' | 'Girne' | 'Gazimağusa' | ...
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

Şu an veri setinde 21 örnek kayıt var (tamamı `verificationStatus: 'sample'`).

---

## Veri Erişim Katmanı

Tüm veri okuma işlemleri `lib/places.ts` üzerinden geçer:

```typescript
getAllPlaces()                       // Tüm yerler
getPlaceBySlug(slug)                 // Slug'a göre tek yer
getPlacesByCategory(category)        // Kategoriye göre filtrele
getPlacesByRegion(region)            // Bölgeye göre filtrele
getFeaturedPlaces()                  // Öne çıkan yerler
filterPlaces({ region, category, isFree, query })  // Kombine filtre
getAllPlaceSlugs()                    // SSG için tüm slug'lar
getNearbyPlaces(place)               // Yakındaki yerler (nearbyPlaceSlugs)
getPlacesNearCoordinates(lat, lon)   // Haversine mesafeye göre sıralı yerler
formatAdmission(place) / formatDay() / formatDistance() / formatDuration()
getPlaceCountByRegion() / getPlaceCountByCategory()
```

> **Supabase'e geçiş:** Yalnızca `lib/places.ts` dosyasının implementasyonu değiştirilir — sayfalar ve bileşenler değişmez.

---

## Gezi Planlayıcı (`/gezi-planla`)

`lib/trip-planner/` altında kural tabanlı bir planlama motoru bulunur:

1. **`scoring.ts`** — her yeri kullanıcının ilgi alanlarına, konaklama yerine mesafesine, "yalnızca ücretsiz" tercihine ve manuel olarak seçtiği ("Geziye Ekle" butonuyla işaretlediği) yerlere göre puanlar.
2. **`planner.ts`** — en yüksek puanlı yerleri seçer, konaklamadan başlayan en-yakın-komşu (nearest-neighbour) sırasına dizer ve güne göre parçalar (tempo → günde 2/3/4 durak).
3. **`scheduleDay.ts`** — sıralı durak listesini 09:00'dan başlayan saatli bir programa çevirir; öğle arası ekler, seyahat sürelerini hesaplar.
4. **`distance.ts`** — Haversine mesafe hesaplar; araç (40 km/s), yürüyüş (4 km/s) ve toplu taşıma (22 km/s ortalama hız + 15 dk sabit bekleme/aktarma payı) için ayrı süre tahminleri üretir. Kuzey Kıbrıs için gerçek bir toplu taşıma tarife verisi henüz yok — bu tamamen kabaca bir tahmindir.

**"Geziye Ekle" entegrasyonu:** Herhangi bir yer kartında veya detay sayfasında "Geziye Ekle" ile işaretlenen yerler `useTripSelection` (localStorage) içinde tutulur ve `/gezi-planla` sihirbazına girildiğinde otomatik olarak `mustVisitSlugs` olarak plana aktarılır — sihirbaz bunu bir bilgi bandıyla kullanıcıya bildirir ve bu yerler oluşturulan planda garanti şekilde yer alır.

---

## Harita (`/harita`)

Leaflet + OpenStreetMap tile'ları ile tüm yerleri kategoriye göre renkli pin'lerle gösteren tam sayfa interaktif harita. `PlacesMapWrapper` bileşeni haritayı `next/dynamic` ile `ssr: false` olarak yükler (Leaflet tarayıcı-only API'lere bağımlı). Yer detay sayfalarında da aynı desenle küçük bir tek-nokta mini harita (`PlaceMiniMap`) gösterilir.

---

## Site URL Konfigürasyonu

`metadataBase`, `sitemap.xml` ve `robots.txt` gerçek bir domain gerektirir. Bunun için sabit kodlanmış bir değer yerine `src/lib/config.ts` içinde tek bir `SITE_URL` sabiti kullanılır:

```typescript
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
```

Production'a alırken `NEXT_PUBLIC_SITE_URL` ortam değişkenini gerçek domain ile ayarlayın (örn. Vercel proje ayarlarında). Ayarlanmazsa site `localhost` referanslarıyla build edilir — bu, yanlışlıkla var olmayan bir domain'i SEO meta verisine gömmekten daha güvenlidir.

---

## SEO Yapısı

- Her sayfada `metadata` export'u (title + description)
- `/places/[slug]`'da `generateMetadata` — her yer için dinamik başlık ve Open Graph
- `/sitemap.xml` — tüm statik sayfalar + yer detay sayfaları + `/harita` + `/gezi-planla` dahil, yer verilerinden otomatik oluşturulur
- `/robots.txt` — `/favoriler` hariç tüm sayfalara izin verir (kişisel, localStorage tabanlı sayfa; arama motoru için değeri yok)
- `<html lang="tr">` ve `openGraph.locale: 'tr_TR'` — sitenin gerçek içerik diliyle uyumlu
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
2. **Server Components öncelikli** → Yalnızca localStorage/URL state veya tarayıcı API'si okuyan bileşenler (`Navbar`, `PlaceFilters`, `PlaceCard`, `PlaceInfoPanel`, harita/gezi-planla bileşenleri) Client Component'tır.
3. **`lib/places.ts` veri katmanı** → Tüm okumalar bu dosyadan geçer. Supabase geçişi yalnızca bu dosyayı değiştirerek olur.
4. **Kategori landing sayfaları ince wrapper'lardır** → `museums/page.tsx` ~30 satır. Yeni kategori eklemek ~20 satır.
5. **`generateStaticParams`** → tüm detay sayfaları build zamanında pre-render edilir.
6. **Opsiyonel alanlar** → `openingHours`, `admission`, `phone`, `website`, `history` tip seviyesinde opsiyonel. Plajlar ve seyir noktaları bunlara ihtiyaç duymaz.
7. **`<Suspense>` + `useSearchParams`** → Filtre bileşeni URL parametrelerinden başlar (`?category=Museum`), bu nedenle `<Suspense>` ile sarılır. Sayfa statik olarak render edilir, filtreler client-side çalışır.
8. **`overlay` Badge variant** → Kart görselleri ve hero görseli üzerine yerleştirilen kategori etiketleri için özel `backdrop-blur` variant.
9. **"Bugün" hesaplamaları mount-sonrası yapılır** (`useTodayKey`) → Sayfalar statik olarak (build zamanında) pre-render edildiği için `new Date()`'i doğrudan render içinde çağırmak, build günü ile ziyaretçinin gerçek günü arasında hydration uyuşmazlığına yol açardı. `useTodayKey` bu değeri `useEffect` içinde, mount sonrası hesaplar.
10. **Leaflet haritaları her zaman `next/dynamic({ ssr: false })` ile yüklenir** → Leaflet tarayıcı-only `window`/`document` API'lerine bağımlıdır; sunucuda render edilemez.

---

## Bilinen Sınırlamalar

| Konu | Durum | Not |
|---|---|---|
| Yer verileri (21 kayıt) | ⚠️ ÖRNEK VERİ | Saatler, fiyatlar, telefonlar doğrulanmamış (`verificationStatus: 'sample'`) |
| Görseller | ⚠️ ÖRNEK | Unsplash/Wikimedia URL'leri — lisanslı fotoğraflarla değiştirilmeli |
| Toplu taşıma süreleri | ⚠️ TAHMİNİ | Gerçek KKTC otobüs/dolmuş tarife verisi yok — sabit ortalama hız + bekleme payı ile kabaca hesaplanır |
| Otomatik test | ❌ YOK | Birim/entegrasyon testi altyapısı henüz kurulmadı |
| Veritabanı | ❌ YOK | Veriler hâlâ statik `data/places.ts` üzerinden; Supabase geçişi yapılmadı |
| Site domain'i | ⚙️ YAPILANDIRILABİLİR | `NEXT_PUBLIC_SITE_URL` ortam değişkeni ile ayarlanır, ayarlanmazsa `localhost` |

---

## Yapılacaklar — Sonraki Adımlar

### Milestone 1 — Gerçek İçerik
- [ ] Resmi müze/çekim sitelerinden doğrulanmış saatler ve fiyatlar
- [ ] Lisanslı fotoğraflar veya kendi çekimler → `/public/images/places/`
- [ ] `verificationStatus`'u `'sample'`'dan `'verified'`'e güncelle
- [ ] Production domain'ini `NEXT_PUBLIC_SITE_URL` ortam değişkenine ayarla

### Milestone 2 — Veritabanı
- [ ] `data/places.ts`'yi Supabase PostgreSQL'e taşı (yalnızca `lib/places.ts` değişir)
- [ ] Supabase `to_tsvector` ile tam metin arama (server-side)
- [ ] Yer kayıtları yönetimi için admin dashboard

### Milestone 3 — Kalite Altyapısı
- [ ] Birim/entegrasyon test altyapısı (Vitest/Jest + Testing Library)
- [ ] CI pipeline (lint + typecheck + build + test)

### Milestone 4 — Büyüme
- [ ] Çok dilli içerik (`next-intl` — Türkçe, Rum Yunancası, İngilizce, Rusça)
- [ ] Daha fazla kategori sayfası (`/archaeological-sites`, `/monasteries`, `/nature`)
- [ ] Gerçek toplu taşıma tarife verisiyle gezi planlayıcı entegrasyonu
- [ ] Analitik (Plausible veya PostHog)
- [ ] Sponsorlu işletmeler ve öne çıkan listeler (gelir modeli)

---

## Build Durumu

```
✅ npm run build   → 0 hata, 0 uyarı
✅ npm run lint    → 0 hata
✅ tsc --noEmit    → 0 hata
✅ 35 sayfa pre-render edildi (21 yer detay sayfası dahil)
```

```
Route (app)
○ /
○ /beaches
○ /castles
○ /favoriler
○ /gezi-planla
○ /harita
○ /historical-places
○ /museums
○ /places
● /places/[slug]        (SSG — 21 sayfa)
○ /robots.txt
○ /sitemap.xml
```

---

*Cyprus Discovery — Kuzey Kıbrıs'ın tarihini, kültürünü ve doğal güzelliklerini keşfetmeye giden ilk adım.*
