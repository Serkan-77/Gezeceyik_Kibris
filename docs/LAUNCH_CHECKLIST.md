# Yayına Alma Kontrol Listesi — Cyprus Discovery

Bu doküman, projeyi kodun elverdiği son noktaya kadar getirdikten sonra geri kalan ve
**sadece senin yapabileceğin** (hesap açma, ödeme, domain satın alma gibi) işleri
adım adım anlatır. Sırayla ilerle — 1-2-3 tamamlanmadan site gerçek anlamda "canlı"
sayılmaz, diğerleri (4-6) sonrasında istediğin zaman yapılabilir.

Her adımın sonunda "Bittiğinde nasıl anlarsın" notu var — o kontrolü geçmeden bir
sonraki adıma geçme.

---

## Adım 1 — Supabase projesini kur (ZORUNLU, en önemli adım)

**Neden önemli:** Proje artık MongoDB değil, Supabase (Postgres) kullanıyor —
MongoDB bağlantısı tamamen kaldırıldı. `next build` (deploy sırasında çalışan
komut) gerçek bir Supabase bağlantısı olmadan tamamlanamaz. Yani bu adım
bitmeden site yayına alınamaz.

Ayrıntılı adımlar için **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)**
dosyasına bak. Özetle:

### Ne yapmalısın

1. [supabase.com](https://supabase.com) üzerinde ücretsiz bir proje oluştur.
2. Proje panelinde **SQL Editor** → **New query** → `supabase/schema.sql`
   dosyasının tüm içeriğini yapıştır → **Run**. Bu, `places` ve
   `transitRoutes` tablolarını oluşturur.
3. **Project Settings → API** sayfasından **Project URL** ve **service_role
   secret key** değerlerini kopyala (anon/public key değil — service_role).
4. `.env` dosyasını aç, `SUPABASE_URL=` ve `SUPABASE_SERVICE_ROLE_KEY=`
   satırlarını bu değerlerle doldur.
5. Terminalde sırayla çalıştır:
   ```
   npm run db:verify
   npm run db:seed
   npm run db:seed:transit
   ```

**Bittiğinde nasıl anlarsın:** `db:verify` komutu "Verification FAILED" yerine
başarı mesajı basar, `db:seed`/`db:seed:transit` sonunda 121 yer ve otobüs
hatlarının Supabase'e yazıldığını gösteren bir özet basar.

---

## Adım 2 — Domain satın al ve Vercel'e deploy et (ZORUNLU)

**Neden önemli:** Site şu an sadece senin bilgisayarında (`localhost:3000`) çalışıyor.
Kimse internetten erişemez.

### 2a. Domain satın al

1. Bir domain sağlayıcısına git (örn. GoDaddy, Namecheap, ya da Türkiye'de Natro/
   Turhost gibi bir yerden `.com` veya `.com.tr` alabilirsin).
2. İstediğin ismi ara (örn. `kuzeykibrisdiscovery.com`) ve satın al.
3. Bu adım gerçek para harcamayı içerir — bu yüzden ben yapamıyorum, sen onaylayıp
   ödemeni yapman gerekiyor.

### 2b. Vercel'e deploy et

Next.js projeleri için en doğal seçim Vercel'dir (bu projeyi yazan Next.js'in
kendi şirketi).

1. [vercel.com](https://vercel.com) adresine git, GitHub hesabınla giriş yap
   (proje GitHub'da değilse önce `git push` ile bir GitHub reposuna göndermen gerekir
   — bunu istersen birlikte yaparız).
2. **Add New → Project** → bu repoyu seç.
3. Vercel, bunun bir Next.js projesi olduğunu otomatik anlar, ayar değiştirmene
   gerek yok.
4. **Environment Variables** kısmına şunları ekle (hepsi `.env` dosyandan
   kopyalanabilir):
   - `SUPABASE_URL` (Adım 1'de aldığın Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (Adım 1'de aldığın service_role secret key)
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL` → buraya `.env`'deki gibi `localhost` değil, satın
     aldığın gerçek domaini yaz (örn. `https://kuzeykibrisdiscovery.com`)
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Adım 5'i yaptıysan)
5. **Deploy** butonuna bas. Birkaç dakika içinde bir `*.vercel.app` linki verir —
   bu link zaten çalışır durumda olacak.
6. Domainini bağlamak için Vercel projesinde **Settings → Domains** kısmından
   satın aldığın domaini ekle; Vercel sana domain sağlayıcında ekleyeceğin birkaç
   DNS kaydı (genelde bir A kaydı + bir CNAME) gösterir. Bunları domain
   sağlayıcının panelinden ekle.

**Bittiğinde nasıl anlarsın:** Kendi domainine tarayıcıdan girdiğinde site açılıyor,
`/admin`'e girip şifreyle giriş yapabiliyorsun ve yaptığın değişiklikler kalıcı
oluyor (artık yerel dosyaya değil Supabase'e yazıyor).

---

## Adım 3 — Gizlilik sayfası iletişim bilgisi (tamamlandı)

`/gizlilik` sayfası artık gerçek bir e-posta gösteriyor
(`destekserkan0666@gmail.com`) — yer tutucu kalmadı, bu adımda yapman
gereken bir şey yok.

---

## Adım 4 — Yer fotoğraflarını gerçek görsellerle değiştir (istediğin zaman)

**Neden önemli:** Şu an 121 yerin tamamı Unsplash'ten genel/placeholder
fotoğraflar kullanıyor — "premium, güvenilir rehber" konumlandırmana ters.

### Ne yapmalısın (her yer için)

1. `/admin`'e gir → değiştirmek istediğin yerin **Düzenle**'sine tıkla.
2. İnternetten bulduğun (lisansı uygun — Wikimedia Commons'ta "public domain"
   veya "CC" etiketli, ya da kendi çektiğin) bir fotoğrafın direkt görsel linkini
   **Kapak Görseli URL** alanına yapıştır.
3. İstersen **Galeri** alanına (her satıra bir tane) birden fazla fotoğraf linki
   daha ekleyebilirsin.
4. Kaydet.

Bunu hepsi için birden yapmak zorunda değilsin — önce **öne çıkan (featured)**
yerlerden başlaman yeterli, gerisini zamanla tamamlayabilirsin.

**Bittiğinde nasıl anlarsın:** Yer sayfasına gittiğinde yeni fotoğraf görünüyor.

---

## Adım 5 — Google Analytics kur (istediğin zaman, tavsiye edilir)

**Neden önemli:** Hangi sayfaların/kategorilerin ilgi gördüğünü görmeden gelir
kararı (reklam mı, affiliate mi) almak kör atış olur.

### Ne yapmalısın

1. [analytics.google.com](https://analytics.google.com) adresine git, Google
   hesabınla giriş yap.
2. **Yönetici (Admin) → Hesap Oluştur** ile yeni bir hesap ve altında bir
   **Mülk (Property)** oluştur — mülk adı olarak "Kuzey Kıbrıs Discovery" yaz.
3. Platform olarak **Web**'i seç, sitenin URL'sini gir (Adım 2'de aldığın domain).
4. Google sana `G-XXXXXXXXXX` formatında bir **Ölçüm Kimliği (Measurement ID)**
   verecek.
5. Bu ID'yi hem `.env` dosyana hem de Vercel'deki **Environment Variables**
   kısmına `NEXT_PUBLIC_GA_MEASUREMENT_ID` olarak ekle.
6. Vercel'de env variable eklediysen projeyi yeniden deploy et (Vercel panelinde
   **Redeploy** butonuna basman yeterli).

**Bittiğinde nasıl anlarsın:** Siteni ziyaret ettikten birkaç dakika sonra Google
Analytics panelindeki **Gerçek Zamanlı (Realtime)** raporunda kendi ziyaretini
görürsün.

---

## Adım 6 — Google AdSense'e başvur (Adım 1-2-3 bittikten sonra)

**Neden şimdi değil de sonra:** Google, canlı bir domain + gerçek içerik +
gizlilik politikası sayfası olmadan başvuruyu kabul etmiyor. Adım 1-2-3
tamamlanınca bu şartların hepsini karşılıyor olacaksın.

### Ne yapmalısın

1. [adsense.google.com](https://www.google.com/adsense/) adresine git,
   Google hesabınla başvuru yap.
2. Site URL'i olarak Adım 2'de aldığın gerçek domaini gir.
3. Google, siteni inceleyip (genelde birkaç gün - birkaç hafta sürer) onay/red
   verir.
4. Onaylanırsa sana bir **yayıncı kimliği (publisher ID,** `ca-pub-XXXXXXXXXX`
   formatında**)** verilir — bunu bana ilettiğinde reklam kodunu siteye
   entegre ederim.

**Bittiğinde nasıl anlarsın:** AdSense panelinde hesabın "Onaylandı" durumuna
geçer ve sana bir yayıncı kimliği verilir.

---

## Özet — kim ne zaman ne yapıyor

| Adım | Kim yapar | Ne zaman |
|---|---|---|
| 1. Supabase projesini kur | **Sen** | Hemen, her şeyin önünde |
| 2. Domain + Vercel deploy | **Sen** (ben env var listesini/adımları veririm) | Adım 1'den hemen sonra |
| 3. Gizlilik sayfası e-postası | ✅ Tamamlandı | — |
| 4. Fotoğraflar | **Sen** (admin panelinden) | İstediğin zaman, kademeli |
| 5. Google Analytics | **Sen** (hesap açma) + **ben** (kod zaten hazır) | Deploy sonrası |
| 6. AdSense başvurusu | **Sen** (başvuru) + **ben** (onay sonrası entegrasyon) | Adım 1-2-3 bitince |
