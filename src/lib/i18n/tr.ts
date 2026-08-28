// lib/i18n/tr.ts
// Centralized Turkish UI strings for Cyprus Discovery.
// No i18n framework — structured so English can be added as a parallel layer later.
// Usage: import { tr } from '@/lib/i18n/tr'

import type { Category, Region } from '@/types/place';

export const tr = {
  // ─── Navigation ───────────────────────────────────────────────
  nav: {
    explore: 'Keşfet',
    regions: 'Bölgeler',
    categories: 'Kategoriler',
    map: 'Harita',
    favorites: 'Favorilerim',
    planTrip: 'Gezi Planla',
    home: 'Ana Sayfa',
    allPlaces: 'Tüm Yerler',
  },

  // ─── Category labels ─────────────────────────────────────────
  categories: {
    Museum: 'Müze',
    Castle: 'Kale',
    'Archaeological Site': 'Arkeolojik Alan',
    Monastery: 'Manastır',
    Beach: 'Plaj',
    'Natural Attraction': 'Doğa',
    'Historical Place': 'Tarihi Yer',
    Viewpoint: 'Seyir Noktası',
    'Cultural Site': 'Kültürel Alan',
    Church: 'Kilise',
    'Family Activity': 'Aile Aktivitesi',
  } as Record<Category, string>,

  // ─── Region labels ───────────────────────────────────────────
  regions: {
    'Lefkoşa': 'Lefkoşa',
    'Girne': 'Girne',
    'Gazimağusa': 'Gazimağusa',
    'İskele': 'İskele',
    'Güzelyurt': 'Güzelyurt',
    'Lefke': 'Lefke',
  } as Record<Region, string>,

  // ─── Region descriptions (for RegionGrid) ────────────────────
  regionDescriptions: {
    'Lefkoşa': 'Tarihi surlar, hanlar ve Osmanlı dönemi eserleri',
    'Girne': 'Pitoresk liman, kadim kale ve manastırlar',
    'Gazimağusa': 'Antik Salamis, Othello Kalesi, Venedik surları',
    'İskele': 'Karpaz Yarımadası\'nın bakir plajları ve doğası',
    'Güzelyurt': 'Antik Soli, müzeler ve narenciye bahçeleri',
    'Lefke': 'Tarihi kasaba dokusu ve arkeolojik kalıntılar',
  } as Record<Region, string>,

  // ─── Verification status ───────────────────────────────────────
  verification: {
    sample: 'Örnek Veri',
    unverified: 'Doğrulanmamış',
    verified: 'Doğrulanmış',
  } as Record<'sample' | 'unverified' | 'verified', string>,

  // ─── Place / visitor info ─────────────────────────────────────
  place: {
    visitorInfo: 'Ziyaret Bilgileri',
    openingHours: 'Açılış Saatleri',
    admission: 'Giriş Ücreti',
    free: 'Ücretsiz',
    openToday: 'Bugün Açık',
    closedToday: 'Bugün Kapalı',
    estimatedVisit: 'Tahmini Ziyaret',
    address: 'Adres',
    contact: 'İletişim',
    website: 'Web Sitesi',
    accessibility: 'Erişilebilirlik',
    getDirections: 'Yol Tarifi Al',
    nearbyPlaces: 'Yakındaki Yerler',
    addToFavorites: 'Favorilere Ekle',
    removeFromFavorites: 'Favorilerden Çıkar',
    addToTrip: 'Geziye Ekle',
    removeFromTrip: 'Geziden Çıkar',
    viewDetails: 'Detayları Gör',
    unknownAdmission: 'Ücret bilgisi bilinmiyor',
    unknownHours: 'Saat bilgisi mevcut değil',
    closedDay: 'Kapalı',
    unknownHoursShort: 'Bilinmiyor',
    parking: 'Otopark',
    guidedTours: 'Rehberli Tur',
    audioGuide: 'Sesli Rehber',
    wheelchairAccessible: 'Tekerlekli Sandalye Erişimi',
    adultPrice: 'Yetişkin',
    childPrice: 'Çocuk',
    history: 'Tarihçe',
    gallery: 'Galeri',
    duration: (min: number) => {
      if (min < 60) return `${min} dk`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} sa ${m} dk` : `${h} sa`;
    },
  },

  // ─── Filters ─────────────────────────────────────────────────
  filter: {
    search: 'Ara',
    searchPlaceholder: 'Yer adı veya şehir ara…',
    category: 'Kategori',
    allCategories: 'Tüm Kategoriler',
    region: 'Bölge',
    allRegions: 'Tüm Bölgeler',
    freeOnly: 'Yalnızca Ücretsiz',
    clearFilters: 'Temizle',
    resultsFound: (n: number) => `${n} yer bulundu`,
    noResults: 'Arama kriterlerinize uygun yer bulunamadı.',
  },

  // ─── Day names ───────────────────────────────────────────────
  days: {
    monday: 'Pzt',
    tuesday: 'Sal',
    wednesday: 'Çar',
    thursday: 'Per',
    friday: 'Cum',
    saturday: 'Cmt',
    sunday: 'Paz',
    mondayFull: 'Pazartesi',
    tuesdayFull: 'Salı',
    wednesdayFull: 'Çarşamba',
    thursdayFull: 'Perşembe',
    fridayFull: 'Cuma',
    saturdayFull: 'Cumartesi',
    sundayFull: 'Pazar',
  },

  // ─── Trip Planner wizard ─────────────────────────────────────
  planner: {
    title: 'Gezi Planla',
    subtitle: 'Kuzey Kıbrıs\'ta mükemmel gezinizi planlayalım.',
    step1: { label: 'Konaklama', question: 'Nerede konaklayacaksınız?' },
    step2: { label: 'Süre', question: 'Kaç gün gezeceksiniz?' },
    step3: { label: 'Ulaşım', question: 'Nasıl ulaşacaksınız?' },
    step4: { label: 'İlgi Alanları', question: 'Nelerle ilgileniyorsunuz?' },
    step5: { label: 'Tempo', question: 'Gezi temponuz nasıl olsun?' },
    next: 'Devam',
    back: 'Geri',
    generate: 'Rotamı Oluştur',
    generating: 'Plan oluşturuluyor…',
    stepOf: (current: number, total: number) => `${current}/${total}`,
    transport: {
      walking: 'Yürüyerek',
      driving: 'Araçla',
      transit: 'Toplu Taşıma',
      mixed: 'Karma',
    },
    pace: {
      relaxed: { label: 'Rahat', description: 'Daha az durak, geniş molalar' },
      normal: { label: 'Normal', description: 'Dengeli program' },
      intensive: { label: 'Yoğun', description: 'Daha fazla durak, sıkı program' },
    },
    interests: {
      history: 'Tarih',
      museums: 'Müzeler',
      castles: 'Kaleler',
      archaeology: 'Arkeoloji',
      nature: 'Doğa',
      beaches: 'Plajlar',
      monasteries: 'Manastırlar',
      culture: 'Kültür',
      viewpoints: 'Seyir Noktaları',
    },
    duration: {
      1: '1 Gün',
      2: '2 Gün',
      3: '3 Gün',
      4: '4 Gün',
      5: '5 Gün',
      7: '7 Gün',
    } as Record<number, string>,
  },

  // ─── Trip / Itinerary ─────────────────────────────────────────
  trip: {
    dayLabel: (n: number) => `${n}. Gün`,
    stops: (n: number) => `${n} durak`,
    walkingDistance: 'Yürüyüş',
    drivingDistance: 'Araç',
    transitTime: 'Toplu taşıma',
    visitTime: 'Ziyaret',
    travelTime: 'Ulaşım',
    knownAdmission: 'Bilinen giriş ücretleri',
    unknownAdmissionNote: 'Bazı yerlerin ücret bilgisi bilinmiyor; toplama dahil edilmedi.',
    lunchBreak: 'Öğle Molası',
    estimatedRoute: 'Tahmini rota',
    removePlace: 'Bu yeri kaldır',
    moveToDifferentDay: 'Başka güne taşı',
    noTransitRoute:
      'Bu konuma mevcut ulaşım verileriyle toplu taşıma rotası oluşturulamıyor.',
    allDays: 'Tüm Rotayı Gör',
    totalTrip: 'Toplam Gezi',
    newPlan: 'Yeni Plan Oluştur',
    saveToFavorites: 'Favorilere Ekle',
    viewOnMap: 'Haritada Gör',
    startingPoint: 'Konaklama Yeri',
    endOfDay: 'Günün Sonu',
    approximateTime: 'Tahmini süre',
    walkingSegment: (m: number, min: number) =>
      `Yürüyüş · ${m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`} · yaklaşık ${min} dk`,
    drivingSegment: (km: number, min: number) =>
      `Araç · ${km.toFixed(1)} km · yaklaşık ${min} dk`,
    transitSegment: (min: number) => `Toplu taşıma · yaklaşık ${min} dk`,
    visitDuration: (min: number) =>
      `Ziyaret · ${min < 60 ? `${min} dk` : `${Math.floor(min / 60)} sa${min % 60 ? ` ${min % 60} dk` : ''}`}`,
    fallbackWarning: (found: number) =>
      `Tercihlerinize uygun ${found} yer bulundu. Planınız buna göre oluşturuldu.`,
  },

  // ─── Favorites ───────────────────────────────────────────────
  favorites: {
    title: 'Favorilerim',
    empty: 'Henüz favori eklemediniz.',
    emptyHint:
      'Beğendiğiniz yerleri favorilere ekleyerek buradan hızlıca ulaşabilirsiniz.',
    browseAllPlaces: 'Tüm Yerlere Göz At',
  },

  // ─── Map ─────────────────────────────────────────────────────
  map: {
    title: 'Harita',
    subtitle: 'Kuzey Kıbrıs\'taki tüm gezilecek yerleri harita üzerinde keşfedin.',
    loadingError: 'Harita yüklenirken bir hata oluştu.',
    clickMarker: 'Bir yere tıklayın.',
    filterByCategory: 'Kategoriye göre filtrele',
    filterByRegion: 'Bölgeye göre filtrele',
    showAll: 'Tümünü Göster',
  },

  // ─── Geolocation ─────────────────────────────────────────────
  geolocation: {
    nearbyPlaces: 'Yakınımdaki Yerler',
    permissionDenied: 'Konum erişimi reddedildi.',
    unavailable: 'Konum bilgisi alınamadı.',
    unsupported: 'Tarayıcınız konum özelliğini desteklemiyor.',
    findNearby: 'Yakınımdaki Yerleri Bul',
    distance: (m: number) =>
      m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`,
    away: 'uzaklıkta',
  },

  // ─── Common ──────────────────────────────────────────────────
  common: {
    sampleDataWarning:
      'Bu bilgiler örnek veridir. Ziyaret öncesi resmi kaynaklardan doğrulayın.',
    loading: 'Yükleniyor…',
    error: 'Bir hata oluştu.',
    backToHome: 'Ana Sayfaya Dön',
    backToPlaces: 'Keşfete Dön',
    notFound: 'Sayfa bulunamadı.',
    discoverMore: 'Daha Fazla Keşfet',
    viewAll: 'Tümünü Gör',
    learnMore: 'Daha Fazla Bilgi',
  },
} as const;
