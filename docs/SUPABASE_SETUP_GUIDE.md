# Supabase Kurulum Rehberi

Bu proje veritabanı olarak [Supabase](https://supabase.com) (yönetilen Postgres)
kullanır. Bu dosya, sıfırdan bir Supabase projesi oluşturup uygulamayı ona
bağlamak için gereken tüm adımları anlatır.

Kod tarafı zaten hazır — `src/lib/db/supabase.ts`, `src/lib/repositories/
placeRepository.ts` ve `src/lib/repositories/transitRouteRepository.ts` bu
kurulumu bekliyor. Burada anlatılanlar **sadece senin yapabileceğin** (hesap
açma, proje oluşturma, gerçek anahtarları kopyalama) işler.

---

## 1. Proje oluştur

1. [supabase.com](https://supabase.com) adresine git, bir hesap oluştur veya
   giriş yap (GitHub ile giriş en hızlısı).
2. **New Project** butonuna bas.
3. Bir isim ver (örn. `cyprus-discovery`), bir veritabanı şifresi belirle
   (bu şifreyi bir yere not et — nadiren gerekir ama kaybolursa proje
   ayarlarından sıfırlanabilir) ve sana en yakın bölgeyi (region) seç —
   örn. Avrupa için `eu-central-1`.
4. **Create new project**'e bas. Proje birkaç dakika içinde hazır olur.

Ücretsiz (Free) plan bu proje için fazlasıyla yeterlidir (121 yer + birkaç
otobüs hattı çok küçük bir veri boyutu).

## 2. Şemayı oluştur

1. Sol menüden **SQL Editor**'a git.
2. **New query** butonuna bas.
3. Bu depodaki `supabase/schema.sql` dosyasının tüm içeriğini kopyala ve
   editöre yapıştır.
4. **Run**'a bas (veya Ctrl/Cmd+Enter).

Bu, `places` ve `"transitRoutes"` tablolarını, ilgili indeksleri ve
`pgcrypto` eklentisini oluşturur. Script tamamen idempotenttir (`if not
exists` kullanır) — yanlışlıkla iki kere çalıştırırsan hata vermez ve
veri silmez.

**Not:** Tablo/kolon adları camelCase (örn. `"shortDescription"`,
`"verificationStatus"`). SQL Editor'da bu tabloları elle sorgularken
kolon adlarını çift tırnak içine almayı unutma — aksi halde Postgres
onları küçük harfe çevirip eşleştiremez.

## 3. API anahtarlarını al

1. Sol menüden **Project Settings** (dişli ikonu) → **API**'ye git.
2. **Project URL** değerini kopyala — `https://<project-ref>.supabase.co`
   formatında olmalı.
3. **Project API keys** bölümünde **service_role** anahtarını kopyala
   (**anon public** anahtarı DEĞİL — o farklı bir amaç için, RLS ile
   kısıtlı istemci erişimi içindir; bu proje sunucu tarafında her zaman
   service_role kullanır).

**service_role anahtarı Row Level Security'yi tamamen atlar.** Bu yüzden:
- Sadece sunucu tarafı kodunda kullanılır (`src/lib/db/supabase.ts`),
  tarayıcıya asla gönderilmez.
- `.env.local`'a yazılır, asla commit edilmez (`.gitignore` zaten
  `.env*` dosyalarını hariç tutuyor).

## 4. Ortam değişkenlerini ayarla

`.env.example` dosyasını `.env.local` olarak kopyala (henüz yapmadıysan),
sonra şu iki satırı doldur:

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role anahtarın>
```

## 5. Bağlantıyı doğrula ve veriyi yükle

Terminalde proje kök dizininde sırayla çalıştır:

```bash
npm run db:verify
```

Bu, bağlantının çalıştığını ve `places` tablosunun erişilebilir olduğunu
doğrular. Başarılı olursa:

```bash
npm run db:seed
npm run db:seed:transit
```

`db:seed`, `src/data/places.ts` içindeki 121 yeri; `db:seed:transit`ise
`src/data/transitRoutes.ts` içindeki otobüs hatlarını Supabase'e yazar.
Her ikisi de slug/operator+region bazlı upsert yapar — tekrar çalıştırmak
güvenlidir, veriyi çoğaltmaz.

## 6. Doğrulama

`npm run dev` ile uygulamayı başlat, ana sayfanın ve `/places` sayfasının
gerçek verilerle yüklendiğini kontrol et. `/admin` panelinden bir yer
düzenleyip kaydettiğinde değişikliğin kalıcı olduğunu (sayfayı
yenileyince kaybolmadığını) doğrula.

---

## Sorun giderme

- **`db:verify` "SUPABASE_URL is not set" hatası verirse:** `.env.local`
  dosyasının proje kök dizininde olduğundan ve iki değişkenin de dolu
  olduğundan emin ol; terminali yeniden başlatman gerekebilir.
- **"Supabase error" ile başlayan bir hata alırsan:** Hata mesajının
  devamı Supabase'in kendi hata açıklamasıdır (örn. yanlış tablo adı,
  eksik izin) — genelde sorunu doğrudan söyler.
- **Şemayı yanlış çalıştırdıysan / baştan başlamak istersen:** Supabase
  panelinde **Table Editor**'dan `places` ve `transitRoutes` tablolarını
  silip `supabase/schema.sql`'i tekrar çalıştırabilirsin — bu geri
  alınamaz bir işlemdir, sadece emin olduğunda yap.
