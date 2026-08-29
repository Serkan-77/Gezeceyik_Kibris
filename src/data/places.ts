// data/places.ts
// ============================================================
// KKTC (Northern Cyprus) Places dataset.
// Opening hours / admission fees / contact details were verified against
// the KKTC Department of Antiquities and Museums (eemd.gov.ct.tr) and other
// public sources where noted via `sourceUrl` and `lastVerifiedAt`. Prices
// in TRY are volatile due to inflation — treat as indicative, not exact.
// Records without a confirmed official source remain verificationStatus:
// 'unverified'; free/open-access sites confirmed by multiple independent
// sources are marked 'verified'.
// ============================================================

import { Place } from '@/types/place';

export const places: Place[] = [

  // ══════════════════════════════════════════════════════════════
  // GİRNE (KYRENIA)
  // ══════════════════════════════════════════════════════════════

  {
    id: 'g1',
    name: 'Girne Kalesi ve Gemi Müzesi',
    slug: 'girne-kalesi',
    category: 'Castle',
    city: 'Girne',
    region: 'Girne',
    shortDescription:
      'Akdeniz\'in en fotoğrafik kale ve limanlarından biri; içindeki Gemi Müzesi ile binlerce yıllık deniz tarihini barındırır.',
    description:
      'Girne Kalesi, şehrin simgesi olan tarihi limanın hemen kenarında yükselen etkileyici bir yapıdır. Erken Bizans dönemine uzanan temelleri üzerine Lüzinyan Krallığı ve ardından Venedikliler tarafından bugünkü şeklini kazanan kale, Kuzey Kıbrıs\'ın en iyi korunmuş tarihi yapıları arasında yer alır. Kalenin içindeki dünyaca ünlü Gemi Müzesi, MÖ 4. yüzyıldan kalma ve dünyanın en eski ticaret gemisi olduğu düşünülen "Girne Gemisi"ni sergilemektedir.',
    history:
      'Kale, Bizans döneminde MS 7. yüzyılda inşa edilmiş, Lüzinyanlar zamanında genişletilmiş ve 16. yüzyılda Venedikliler tarafından topçu saldırılarına karşı dayanıklı hale getirilmiştir. 1974\'ten bu yana müze olarak hizmet vermektedir. İçindeki Gemi Müzesi\'nde sergilenen MÖ 300\'lere tarihlenen gemi, dünyanın en önemli sualtı arkeoloji keşiflerinden birini oluşturmaktadır.',
    image: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–19:00',
      tuesday: '08:00–19:00',
      wednesday: '08:00–19:00',
      thursday: '08:00–19:00',
      friday: '08:00–19:00',
      saturday: '08:00–19:00',
      sunday: '08:00–19:00',
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci); ayrı çocuk tarifesi yok. Son giriş kapanıştan 1 saat öncedir. Fiyatlar TL enflasyonu nedeniyle sık değişebilir, ziyaret öncesi teyit edin.',
    },
    address: 'Girne Kalesi, Girne Limanı, Girne, KKTC',
    latitude: 35.3403,
    longitude: 33.3187,
    accessibility: {
      wheelchairAccessible: false,
      guidedTours: true,
      audioGuide: false,
    },
    estimatedVisitMinutes: 90,
    featured: true,
    nearbyPlaceSlugs: ['bellapais-manastiri', 'girne-limani-seyir'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'g2',
    name: 'Bellapais Manastırı',
    slug: 'bellapais-manastiri',
    category: 'Monastery',
    city: 'Bellapais',
    region: 'Girne',
    shortDescription:
      'Kuzey Kıbrıs\'ın en büyüleyici Gotik yapısı; Beşparmak dağlarının yamacında huzurlu bir köyde saklı.',
    description:
      'Bellapais Manastırı, 13. yüzyılda Lüzinyanlar döneminde inşa edilen ve Kıbrıs\'taki en güzel Gotik yapılar arasında gösterilen bir manastır harabeleridir. Girne\'nin yaklaşık 5 km kuzeydoğusunda, Beşparmak Dağları\'nın eteklerindeki Bellapais köyünde yer alan manastır, özellikle Akdeniz\'e ve Girne\'ye bakan manzarasıyla ünlüdür. Yazar Lawrence Durrell, burada geçirdiği yılları ünlü eseri "Bitter Lemons" da anlatmıştır.',
    history:
      'Manastır, 1205-1210 yılları arasında Augustinli keşişler tarafından kurulmuş; 14. yüzyılda Lüzinyan Fransa\'sından esinlenerek bugünkü Gotik biçimini almıştır. Osmanlı fethinden sonra terk edilen yapı, 19. yüzyılda büyük ölçüde harabe haline gelmiştir.',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–19:00',
      tuesday: '08:00–19:00',
      wednesday: '08:00–19:00',
      thursday: '08:00–19:00',
      friday: '08:00–19:00',
      saturday: '08:00–19:00',
      sunday: '08:00–19:00',
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci); ayrı çocuk tarifesi yok. Son giriş kapanıştan 1 saat öncedir. Mevsimsel saat değişikliği olabilir, teyit edin.',
    },
    address: 'Bellapais Köyü, Girne, KKTC',
    latitude: 35.3093,
    longitude: 33.3471,
    accessibility: {
      wheelchairAccessible: false,
      guidedTours: false,
    },
    estimatedVisitMinutes: 60,
    featured: true,
    nearbyPlaceSlugs: ['girne-kalesi', 'st-hilarion-kalesi'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'g3',
    name: 'St. Hilarion Kalesi',
    slug: 'st-hilarion-kalesi',
    category: 'Castle',
    city: 'Girne',
    region: 'Girne',
    shortDescription:
      'Beşparmak Dağları\'nın zirvesine kurulmuş, masalsı panoramasıyla efsanelere konu olan ortaçağ kalesi.',
    description:
      'St. Hilarion Kalesi, deniz seviyesinden 732 metre yükseklikte Beşparmak Dağları\'nın en yüksek noktalarından birine inşa edilmiştir. Kuzey Kıbrıs\'ın en etkileyici tarihi yapılarından biri olan kale, hem inanılmaz panoramik manzarası hem de 10. yüzyıldan itibaren katman katman eklenen Bizans, Lüzinyan ve Venedik mimari unsurları ile ziyaretçileri büyüler.',
    history:
      'İlk olarak Kıbrıs\'a sığınan münzevi Aziz Hilarion\'un adını taşıyan bir kilise ve manastırdan oluşan bu alan, Bizans döneminde askeri bir gözetleme noktasına dönüştürülmüştür. Lüzinyanlar, kalenin üç katlı saray kompleksini inşa etmiştir.',
    image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:00–18:30',
      tuesday: '09:00–18:30',
      wednesday: '09:00–18:30',
      thursday: '09:00–18:30',
      friday: '09:00–18:30',
      saturday: '09:00–18:30',
      sunday: '09:00–18:30',
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci); son giriş 16:30. Kalenin askeri bölgeye yakınlığı nedeniyle saatler önceden haber verilmeden değişebilir.',
    },
    address: 'St. Hilarion, Girne, KKTC',
    latitude: 35.3170,
    longitude: 33.2761,
    accessibility: {
      wheelchairAccessible: false,
      guidedTours: false,
    },
    estimatedVisitMinutes: 120,
    featured: true,
    nearbyPlaceSlugs: ['bellapais-manastiri'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'g4',
    name: 'Girne Limanı Seyir Noktası',
    slug: 'girne-limani-seyir',
    category: 'Viewpoint',
    city: 'Girne',
    region: 'Girne',
    shortDescription:
      'Osmanlı dönemi liman yapıları, yatlar ve kale siluetinin buluştuğu Kuzey Kıbrıs\'ın en ikonik manzarası.',
    description:
      'Girne\'nin tarihi limanı, balık restoranları, Osmanlı dönemi binaları ve su içinde yansıyan kale siluetiyle her mevsim büyüleyici bir manzara sunar. Özellikle gün batımı saatlerinde limana hâkim tepelerden ya da kale surlarından izlenen görüntü, Kuzey Kıbrıs\'ın en fotoğraf çekilen sahnelerinden birini oluşturur.',
    image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes: 'Açık kamusal alan; giriş ücreti ve sabit ziyaret saati yoktur.',
    },
    address: 'Girne Limanı, Girne, KKTC',
    latitude: 35.3421,
    longitude: 33.3181,
    estimatedVisitMinutes: 30,
    featured: false,
    nearbyPlaceSlugs: ['girne-kalesi'],
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },

  // ══════════════════════════════════════════════════════════════
  // GAZİMAĞUSA (FAMAGUSTA)
  // ══════════════════════════════════════════════════════════════

  {
    id: 'f1',
    name: 'Othello Kalesi',
    slug: 'othello-kalesi',
    category: 'Castle',
    city: 'Gazimağusa',
    region: 'Gazimağusa',
    shortDescription:
      'Shakespeare\'in "Othello"suna esin kaynağı olduğu söylenen Venedik dönemi kalesi; Gazimağusa surlarının içindeki inci.',
    description:
      'Othello Kalesi (resmî adıyla Othello Kulesi ya da Gazimağusa Kalesi), kentin sur içindeki en önemli anıtsal yapısıdır. 14. yüzyılda Lüzinyanlar tarafından inşa edilen kale, 15. yüzyılda Venedikliler tarafından büyük ölçüde yeniden düzenlenmiştir. Shakespeare\'in "Othello" oyununun buradaki Kıbrıslı komutan Cristoforo Moro\'dan ilham aldığı ileri sürülmektedir.',
    history:
      '1492\'de Venedikliler kalenin bu bölümünü genişletmiş ve kuzey kapısına bugün hâlâ görülebilen kanatlı aslan kabartmasını eklemiştir. Osmanlı döneminde tersane ve depo olarak kullanılan yapı, günümüzde kültür ve sanat etkinliklerine de ev sahipliği yapmaktadır.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'Restorasyon çalışmaları nedeniyle 2026 itibarıyla ziyarete kapalıdır; yetkililer güncel bir açılış tarihi paylaşmamıştır. Belirtilen fiyatlar, kale yeniden açıldığında geçerli olacak resmi tarifedir.',
    },
    address: 'Liman Caddesi, Gazimağusa Suriçi, KKTC',
    latitude: 35.1243,
    longitude: 33.9416,
    accessibility: {
      wheelchairAccessible: false,
      guidedTours: true,
    },
    estimatedVisitMinutes: 75,
    featured: true,
    nearbyPlaceSlugs: ['lala-mustafa-pasa-camii', 'namik-kemal-zindani', 'gazimagusa-surlari'],
    sourceUrl: 'https://bugunkibris.com/2026/04/01/tarihi-kale-kapali-yetkililer-suskun-othello-icin-aciklama-cagrisi/',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },

  {
    id: 'f2',
    name: 'Salamis Antik Kenti',
    slug: 'salamis-antik-kenti',
    category: 'Archaeological Site',
    city: 'Gazimağusa',
    region: 'Gazimağusa',
    shortDescription:
      'MÖ 11. yüzyıldan kalma Roma dönemine ait sütunlar, hamam kompleksi ve amfitiyatrosuyla Kıbrıs\'ın en büyük antik kenti.',
    description:
      'Salamis, Kıbrıs\'taki en önemli ve en büyük antik kenttir. Aralarında görkemli Roma hamamı, amfitiyatro, spor alanı ve sütunlu caddelerin bulunduğu çeşitli yapılar, alanın büyük bölümünde hâlâ görülebilmektedir. Doğu Akdeniz\'in başlıca ticaret limanlarından biri olan Salamis, Antik Yunan\'dan başlayarak Roma ve Bizans dönemlerine kadar kesintisiz iskân görmüştür.',
    history:
      'Efsaneye göre Troya savaşından dönen Teucer tarafından MÖ 11. yüzyılda kurulan Salamis, Hellenistik ve Roma dönemlerinde büyük bir refah yaşamıştır. MS 4. yüzyılda büyük depremler ve akabinde Arab saldırıları şehrin önemini yitirmesine neden olmuş; Bizans döneminde Konstantia adıyla yeniden ihya edilmiştir.',
    image: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–19:00',
      tuesday: '08:00–19:00',
      wednesday: '08:00–19:00',
      thursday: '08:00–19:00',
      friday: '08:00–19:00',
      saturday: '08:00–19:00',
      sunday: '08:00–19:00',
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci); ayrı çocuk tarifesi yok. Son giriş kapanıştan 1 saat öncedir. Geniş ve çoğunlukla gölgesiz bir alan, 2-3 saat ayırın.',
    },
    address: 'Salamis Yolu, Gazimağusa, KKTC',
    latitude: 35.1795,
    longitude: 33.9107,
    accessibility: {
      wheelchairAccessible: true,
      guidedTours: false,
    },
    estimatedVisitMinutes: 150,
    featured: true,
    nearbyPlaceSlugs: ['st-barnabas-manastiri', 'othello-kalesi'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'f3',
    name: 'St. Barnabas Manastırı ve İkon Müzesi',
    slug: 'st-barnabas-manastiri',
    category: 'Monastery',
    city: 'Gazimağusa',
    region: 'Gazimağusa',
    shortDescription:
      'Hristiyanlığın önemli azizlerinden Barnabas\'ın doğduğu yere yakın inşa edilmiş Bizans manastırı; günümüzde ikon müzesi.',
    description:
      'St. Barnabas Manastırı, İncil\'de adı geçen ve Hristiyanlığın Kıbrıs\'a taşınmasında önemli rol oynayan Aziz Barnabas\'a adanmış bir Bizans manastırıdır. Salamis\'in hemen yakınında yer alan manastır, günümüzde ikon ve arkeoloji müzesi olarak işlev görmektedir. Mütevazı ama etkileyici boyutlarıyla, birbirini izleyen Bizans, Lüzinyan ve Osmanlı dönemlerinin izlerini taşır.',
    history:
      'MS 477\'de yeniden inşa edilen manastır, Aziz Barnabas\'ın kemiklerinin burada keşfedildiğine dair efsaneden güç alarak Bizans İmparatorluğu\'nun desteklediği önemli bir hac merkezi haline gelmiştir.',
    image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–18:00',
      tuesday: '08:00–18:00',
      wednesday: '08:00–18:00',
      thursday: '08:00–18:00',
      friday: '08:00–18:00',
      saturday: '08:00–18:00',
      sunday: null,
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci). Pazar kapanışı bazı ikincil kaynaklarda belirtiliyor ancak resmi sayfada ayrıca teyit edilemedi; ihtiyaten kapalı varsayılmıştır.',
    },
    address: 'Salamis Yolu, Gazimağusa, KKTC',
    latitude: 35.1763,
    longitude: 33.8941,
    accessibility: {
      wheelchairAccessible: true,
      guidedTours: false,
    },
    estimatedVisitMinutes: 60,
    featured: false,
    nearbyPlaceSlugs: ['salamis-antik-kenti'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'f4',
    name: 'Lala Mustafa Paşa Camii (St. Nicholas Katedrali)',
    slug: 'lala-mustafa-pasa-camii',
    category: 'Historical Place',
    city: 'Gazimağusa',
    region: 'Gazimağusa',
    shortDescription:
      'Fransız Gotik mimarisinin Kıbrıs\'taki şaheseri; önce Lüzinyan katedrali, sonra Osmanlı camii olmuş muhteşem yapı.',
    description:
      'Lala Mustafa Paşa Camii, 1328 yılında Lüzinyan Krallığı döneminde inşa edilmiş ve Fransa\'daki Reims Katedrali\'nden ilham alınmıştır. Doğu Akdeniz\'deki en önemli Gotik yapılardan biri kabul edilen bu katedrale, 1571\'de Osmanlı fethinin ardından minare eklenerek camiye dönüştürülmüş ve Lüzinyan komutanlarından birinin adı verilmiştir.',
    history:
      '14. yüzyılda tamamlanan yapı, Kıbrıs\'taki Lüzinyan Krallığı\'nın taç giyme törenlerine ev sahipliği yapmıştır. İspanyol İnkizisyonu\'ndan kaçan Yahudiler, 16. yüzyılda bu yapının güvencesi altında Gazimağusa\'ya sığınmıştır.',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    admission: {
      isFree: true,
      notes:
        'Ücretsiz. Sabit ziyaret saati resmi olarak doğrulanamadı; aktif bir cami olduğundan namaz vakitlerinde ziyarete kapatılır, dışındaki saatlerde genellikle açıktır. Mütevazı kıyafet önerilir.',
    },
    address: 'Lala Mustafa Paşa Meydanı, Gazimağusa Suriçi, KKTC',
    latitude: 35.1241,
    longitude: 33.9415,
    accessibility: {
      wheelchairAccessible: true,
    },
    estimatedVisitMinutes: 30,
    featured: false,
    nearbyPlaceSlugs: ['othello-kalesi', 'namik-kemal-zindani', 'gazimagusa-surlari'],
    sourceUrl: 'https://www.visitncy.com/kesfet/lala-mustafa-pasa-camii/',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'f5',
    name: 'Namık Kemal Zindanı',
    slug: 'namik-kemal-zindani',
    category: 'Historical Place',
    city: 'Gazimağusa',
    region: 'Gazimağusa',
    shortDescription:
      'Türk şair Namık Kemal\'in üç yıl sürgün hayatı yaşadığı tarihi zindan; edebî ve siyasi tarih açısından önemli bir durak.',
    description:
      'Lüzinyan döneminden kalma bu zindan, 19. yüzyıl Osmanlı muhalif şairi ve yazarı Namık Kemal\'in 1873-1876 yılları arasında sürgün edildiği mekân olarak bilinmektedir. Bugün küçük bir müzeye dönüştürülmüş olan yapı, Osmanlı ve Türk edebiyatı tarihine ilgi duyanlar için önemli bir ziyaret noktasıdır.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–15:30',
      tuesday: '08:00–15:30',
      wednesday: '08:00–15:30',
      thursday: '08:00–15:30',
      friday: '08:00–15:30',
      saturday: null,
      sunday: null,
    },
    admission: {
      isFree: false,
      adultPrice: 100,
      childPrice: 0,
      currency: 'TRY',
      notes:
        '12 yaş altı ücretsizdir; öğrenci ücreti 50 TRY. KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi; hafta sonu ve resmi tatillerde kapalıdır. 9 Mayıs 2023\'te restorasyon sonrası yeniden açılmıştır.',
    },
    address: 'Namık Kemal Meydanı, Gazimağusa Suriçi, KKTC',
    latitude: 35.1244,
    longitude: 33.9418,
    estimatedVisitMinutes: 30,
    featured: false,
    nearbyPlaceSlugs: ['lala-mustafa-pasa-camii', 'othello-kalesi'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'f6',
    name: 'Gazimağusa Venedik Surları',
    slug: 'gazimagusa-surlari',
    category: 'Historical Place',
    city: 'Gazimağusa',
    region: 'Gazimağusa',
    shortDescription:
      '16. yüzyıldan kalma ve dünyanın en iyi korunmuş Venedik surlarından biri; tarihin içinde yürüyüş imkânı.',
    description:
      'Gazimağusa\'nın Venedik surları, Ortaçağ ve Rönesans dönemi askeri mimarisinin en olağanüstü örneklerinden birini oluşturur. Surlar boyunca yürürken hem şehrin tarihi suriçini hem de Akdeniz\'e bakan manzarayı aynı anda deneyimleyebilirsiniz. Osmanlı kuşatmasından önce Venediklilerin 40 yıl boyunca çalışarak tamamladığı bu yapı, 1974\'ten bu yana UNESCO\'nun geçici dünya mirası listesindedir.',
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes: 'Açık kentsel alan; giriş ücreti ve sabit ziyaret saati yoktur.',
    },
    address: 'Gazimağusa Surları, Gazimağusa, KKTC',
    latitude: 35.1233,
    longitude: 33.9410,
    estimatedVisitMinutes: 60,
    featured: false,
    nearbyPlaceSlugs: ['othello-kalesi', 'lala-mustafa-pasa-camii'],
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },

  // ══════════════════════════════════════════════════════════════
  // LEFKOŞA (NICOSIA NORTH)
  // ══════════════════════════════════════════════════════════════

  {
    id: 'l1',
    name: 'Büyük Han',
    slug: 'buyuk-han',
    category: 'Historical Place',
    city: 'Lefkoşa',
    region: 'Lefkoşa',
    shortDescription:
      'Kıbrıs\'ın en büyük Osmanlı han yapısı; restorasyon sonrası kültür ve zanaat atölyelerine dönüştürülmüş tarihi bir mekân.',
    description:
      'Büyük Han, Kıbrıs\'ta inşa edilen ilk Osmanlı yapılarından biri olup 1572\'de Lala Mustafa Paşa\'nın emriyle yaptırılmıştır. Lefkoşa\'nın kuzey kesiminde bulunan ve kare planlı bir iç avlu etrafında şekillenen iki katlı yapı, kervan hanı olarak tasarlanmıştır. Günümüzde çarşamba akşamları kurulan antika pazarı ve zanaat atölyeleriyle kültürel yaşamın canlı bir parçası olmaya devam etmektedir.',
    history:
      '1572\'de, Osmanlı\'nın Kıbrıs\'ı fethinin hemen ardından inşa edilen Büyük Han, yüzyıllar boyunca önce caravan sarayı, ardından Kıbrıs kolonisi döneminde kadın hapishanesi, daha sonra düşkünler yurdu olarak kullanılmıştır. 1991\'de restore edilerek kültür merkezi işlevi kazanmıştır.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:30–17:30',
      tuesday: '09:30–17:30',
      wednesday: '09:30–17:30',
      thursday: '09:30–17:30',
      friday: '09:30–17:30',
      saturday: '09:30–17:30',
      sunday: null,
    },
    admission: {
      isFree: true,
      notes:
        'Avlu ücretsiz gezilebilir; içindeki atölye ve dükkanlar kendi saatlerinde ve ücretleriyle hizmet verir. Belirtilen saatler genel bir tahmindir, resmi olarak doğrulanamadı.',
    },
    address: 'Asmaaltı, Lefkoşa, KKTC',
    latitude: 35.1766,
    longitude: 33.3643,
    accessibility: {
      wheelchairAccessible: true,
    },
    estimatedVisitMinutes: 45,
    featured: true,
    nearbyPlaceSlugs: ['selimiye-camii', 'mevlevi-tekke-muzesi', 'kumarcilar-hani'],
    sourceUrl: 'https://www.tripadvisor.com/Attraction_Review-g190383-d2253694-Reviews-Buyuk_Han-Nicosia_Nicosia_District.html',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'l2',
    name: 'Selimiye Camii (Ayasofya Katedrali)',
    slug: 'selimiye-camii',
    category: 'Historical Place',
    city: 'Lefkoşa',
    region: 'Lefkoşa',
    shortDescription:
      'Gotik kubbeleri ve iki Osmanlı minaresiyle Lefkoşa\'nın siluetine hâkim olan ve katman katman tarih taşıyan anıtsal yapı.',
    description:
      'Selimiye Camii, 1209-1325 yılları arasında inşa edilen ve Kuzey Kıbrıs\'ın en önemli dini miraslarından biri olan yapıdır. Lüzinyan Krallığı\'nın taç giyme merasimleri için inşa edilen bu Gotik katedral, 1571\'de Osmanlı fethinin ardından iki minaresi eklenerek camiye dönüştürülmüştür. Lüzinyan döneminin taç giyme törenleri bu yapıda gerçekleşirdi.',
    history:
      'Katedral yapımına 1209\'da başlanmış, 100 yılı aşkın bir süre içinde tamamlanmıştır. Yapı, 1571\'deki Osmanlı fethinin ardından minareler eklenerek Sultan II. Selim adına Selimiye Camii olarak düzenlenmiştir.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    admission: {
      isFree: true,
      notes:
        'Ücretsiz. Sabit ziyaret saati yoktur; aktif bir cami olduğundan günde 5 kez namaz vakitlerinde ziyarete kapatılır. Baş örtüsü/mütevazı kıyafet gereklidir, ayakkabılar girişte çıkarılır.',
    },
    address: 'Selimiye Meydanı, Lefkoşa, KKTC',
    latitude: 35.1744,
    longitude: 33.3624,
    accessibility: {
      wheelchairAccessible: true,
    },
    estimatedVisitMinutes: 30,
    featured: false,
    nearbyPlaceSlugs: ['buyuk-han', 'mevlevi-tekke-muzesi'],
    sourceUrl: 'https://www.tripadvisor.com/Attraction_Review-g190383-d2314145-Reviews-Selimiye_Camii-Nicosia_Nicosia_District.html',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'l3',
    name: 'Mevlevi Tekke Müzesi',
    slug: 'mevlevi-tekke-muzesi',
    category: 'Museum',
    city: 'Lefkoşa',
    region: 'Lefkoşa',
    shortDescription:
      'Osmanlı döneminden kalma dervişan tekkesi; Mevlevi semâ törenleri ve Kıbrıs\'ın çok kültürlü tarihini anlatan koleksiyon.',
    description:
      'Mevlevi Tekke Müzesi, Kuzey Kıbrıs\'ta Osmanlı kültürel mirasının en özgün örneklerinden biridir. Lefkoşa\'nın kalp noktasında yer alan bu yapı, Osmanlı döneminde Mevlevi dervişlerinin yaşadığı ve semâ törenlerini icra ettiği bir tekkedir. Müzede Mevlevi kıyafetleri, müzik aletleri ve Osmanlı Kıbrıs\'ına ait günlük yaşam eşyaları sergilenmektedir.',
    history:
      '17. yüzyılda inşa edilen tekke, Kıbrıs\'taki en uzun süre faaliyet gösteren Mevlevi merkezlerinden biridir. 1925\'te Türkiye\'de tekke ve zaviyelerin kapatılmasının ardından Kıbrıs\'taki bu yapı semâ törenlerine bir süre daha devam etmiştir.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–15:30',
      tuesday: '08:00–15:30',
      wednesday: '08:00–15:30',
      thursday: '08:00–15:30',
      friday: '08:00–15:30',
      saturday: null,
      sunday: null,
    },
    admission: {
      isFree: false,
      adultPrice: 100,
      childPrice: 0,
      currency: 'TRY',
      notes:
        '12 yaş altı ücretsizdir; öğrenci ücreti 50 TRY. KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi; hafta sonu kapalıdır.',
    },
    address: 'Girne Caddesi, Lefkoşa, KKTC',
    latitude: 35.1751,
    longitude: 33.3626,
    accessibility: {
      wheelchairAccessible: false,
    },
    estimatedVisitMinutes: 45,
    featured: false,
    nearbyPlaceSlugs: ['buyuk-han', 'selimiye-camii'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'l4',
    name: 'Kumarcilar Hanı',
    slug: 'kumarcilar-hani',
    category: 'Historical Place',
    city: 'Lefkoşa',
    region: 'Lefkoşa',
    shortDescription:
      'Büyük Han\'ın küçük kardeşi; Lefkoşa\'nın kalbi Asmaaltı\'nda 16. yüzyıldan gelen görece mütevazı Osmanlı hanı.',
    description:
      'Kumarcilar Hanı, Lefkoşa\'nın tarihi Asmaaltı bölgesinde yer alan küçük ölçekli bir Osmanlı hanıdır. İki katlı avlulu yapı, günümüzde sanat galerisine ve butik zanaatkâr dükkânlarına ev sahipliği yapmaktadır. Büyük Han ile aynı dönemde inşa edildiği tahmin edilen bu yapı, tarihi çarşı dokusunun önemli bir parçasıdır.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes:
        'Avlu ücretsiz gezilebilir. 2018 restorasyonu sonrası yapı büyük ölçüde bir kafe/restoran (MekHan) olarak işletilmektedir; ziyaretçi genelde ücretli kafeyle karşılaşır, avlunun kendisi ücretsizdir.',
    },
    address: 'Asmaaltı, Lefkoşa, KKTC',
    latitude: 35.1758,
    longitude: 33.3640,
    estimatedVisitMinutes: 20,
    featured: false,
    nearbyPlaceSlugs: ['buyuk-han', 'selimiye-camii'],
    sourceUrl: 'https://en.wikipedia.org/wiki/Kumarcilar_Han',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'l5',
    name: 'Buffavento Kalesi',
    slug: 'buffavento-kalesi',
    category: 'Castle',
    city: 'Değirmenlik',
    region: 'Lefkoşa',
    shortDescription:
      '954 m yükseklikte Beşparmak Dağları\'nda saklı Bizans kalesi; panoramik manzarası için yorucu ama ödüllendirici bir yürüyüş.',
    description:
      'Buffavento Kalesi, Beşparmak Dağları\'nın 954 metre yüksekliğindeki zirvesine kurulmuş bir Bizans yapısıdır. "Şiddetli rüzgarların kalesi" anlamına gelen adıyla ünlü olan bu kale, kötü hava koşullarına ve rüzgara karşı dayanıklılığıyla bilinir. Girne Kalesi ve St. Hilarion ile birlikte Beşparmak Dağları\'nın üç önemli kalesinden birini oluşturur.',
    history:
      'MS 10. yüzyılda Bizanslılar tarafından inşa edilen kale, sonradan Lüzinyanların eline geçmiş ve kraliyet ailesinin hapsedilmesinde kullanılan bir zindan olarak da işlev görmüştür.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes:
        'Bakımsız, girişi ücretsiz bir harabe; sabit ziyaret saati veya görevlisi yoktur (KKTC Eski Eserler ve Müzeler Dairesi\'nin resmi tarife listesinde yer almaz). Sadece gündüz saatlerinde ve sağlam ayakkabıyla tırmanılması önerilir; patika gece güvenli değildir.',
    },
    address: 'Beşparmak Dağları, Lefkoşa Bölgesi, KKTC',
    latitude: 35.2934,
    longitude: 33.3992,
    accessibility: {
      wheelchairAccessible: false,
    },
    estimatedVisitMinutes: 120,
    featured: false,
    nearbyPlaceSlugs: ['st-hilarion-kalesi'],
    sourceUrl: 'https://www.sightsofnorthcyprus.com/buffavento-castle',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },

  // ══════════════════════════════════════════════════════════════
  // İSKELE
  // ══════════════════════════════════════════════════════════════

  {
    id: 'i1',
    name: 'Altın Sahil (Karpaz Yarımadası)',
    slug: 'altin-sahil-karpaz',
    category: 'Beach',
    city: 'Karpaz',
    region: 'İskele',
    shortDescription:
      'Kuzey Kıbrıs\'ın en uzun ve en bakir kumsalı; nesli tükenmekte olan deniz kaplumbağalarının yuvası.',
    description:
      'Altın Sahil, Karpaz Yarımadası\'nın ucundaki bu kumsalın kıyı şeridi ile Akdeniz\'in berrak suları arasındaki temaşa edebileceğiniz en etkileyici Kuzey Kıbrıs manzaralarından birini sunar. Uzunluğu 1 km\'yi aşan ve turizm tesislerinden uzak tutulan bu plaj, özellikle yeşil deniz kaplumbağası ve caretta caretta kaplumbağalarının yumurtlama alanı olarak koruma altındadır. Yakın çevredeki vahşi eşekler bu bölgenin simgesi haline gelmiştir.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes:
        'Açık, gelişmemiş kumsal; giriş ücreti ve gişesi yoktur. Deniz kaplumbağası yuvalama alanı olarak koruma altındadır; çevresinde kamp yapmak yasaktır.',
    },
    address: 'Karpaz Yarımadası, İskele, KKTC',
    latitude: 35.6012,
    longitude: 34.3976,
    estimatedVisitMinutes: 180,
    featured: true,
    nearbyPlaceSlugs: ['apostolos-andreas-manastiri'],
    sourceUrl: 'https://en.wikipedia.org/wiki/Golden_Beach,_Cyprus',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },

  {
    id: 'i2',
    name: 'Apostolos Andreas Manastırı',
    slug: 'apostolos-andreas-manastiri',
    category: 'Monastery',
    city: 'Karpaz',
    region: 'İskele',
    shortDescription:
      'Karpaz Yarımadası\'nın en ucunda, denize bakan kayalıklarda saklı hac yeri; Kıbrıs\'ın "Kutsal Burnu".',
    description:
      'Apostolos Andreas Manastırı, Karpaz Yarımadası\'nın en doğu ucunda yer alan ve Kıbrıslı Rumların en önemli hac mekânlarından biri olarak kabul edilen dini bir komplekstir. Denize nazır konumuyla eşsiz bir manzaraya sahip olan manastır, son yıllarda yürütülen ortak restorasyon çalışmalarıyla yeniden ziyarete açılmıştır.',
    history:
      'Efsaneye göre Aziz Andreas (Apostol Andrew), Kıbrıs açıklarında geçerken kör denizcilerden birini iyileştirmiş ve bu mucize üzerine manastır kurulmuştur. 1974\'ten bu yana bakımsız kalan yapı, BM gözetiminde yürütülen restorasyon çalışmalarıyla yeniden hayat bulmuştur.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    admission: {
      isFree: true,
      notes:
        'Ücretsiz, bağış kutusu bulunur. Sabit ziyaret saati resmi olarak doğrulanamadı; aktif bir hac/ibadet yeri olarak genellikle gündüz saatlerinde açıktır.',
    },
    address: 'Zafer Burnu, Karpaz, İskele, KKTC',
    latitude: 35.6558,
    longitude: 34.5793,
    estimatedVisitMinutes: 60,
    featured: false,
    nearbyPlaceSlugs: ['altin-sahil-karpaz'],
    sourceUrl: 'https://en.wikipedia.org/wiki/Apostolos_Andreas_Monastery',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  // ══════════════════════════════════════════════════════════════
  // GÜZELYURT
  // ══════════════════════════════════════════════════════════════

  {
    id: 'gu1',
    name: 'Güzelyurt Müzesi',
    slug: 'guzelyurt-muzesi',
    category: 'Museum',
    city: 'Güzelyurt',
    region: 'Güzelyurt',
    shortDescription:
      'Güzelyurt\'un merkezindeki bu çift işlevli yapı; arkeolojik eserleri ve doğa tarihi koleksiyonunu birlikte sergilemektedir.',
    description:
      'Güzelyurt Müzesi, hem arkeoloji hem de doğa tarihi bölümlerinden oluşan iki gözlü küçük bir bölge müzesidir. Arkeoloji bölümünde bölgeden elde edilen Tunç Çağı\'ndan Roma dönemine uzanan bulgular yer alırken, doğa tarihi bölümünde Kıbrıs\'a özgü hayvan türleri ve doğal yaşam örnekleri sergilenmektedir. Müze, yakın çevredeki antik Soli ve Morfou tapınak alanlarına ilgi duyanlar için iyi bir başlangıç noktasıdır.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–18:00',
      tuesday: '08:00–18:00',
      wednesday: '08:00–18:00',
      thursday: '08:00–18:00',
      friday: '08:00–18:00',
      saturday: '08:00–18:00',
      sunday: '08:00–18:00',
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci). Bazı ikincil kaynaklar hafta sonu kapalı olduğunu belirtiyor; resmi sayfa kapalı gün belirtmiyor, ziyaret öncesi teyit edin.',
    },
    address: 'Atatürk Caddesi, Güzelyurt, KKTC',
    latitude: 35.2013,
    longitude: 32.9937,
    accessibility: {
      wheelchairAccessible: true,
    },
    estimatedVisitMinutes: 60,
    featured: false,
    nearbyPlaceSlugs: ['soli-antik-kenti'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  {
    id: 'gu2',
    name: 'Soli Antik Kenti',
    slug: 'soli-antik-kenti',
    category: 'Archaeological Site',
    city: 'Güzelyurt',
    region: 'Güzelyurt',
    shortDescription:
      'Deniz kenarındaki Roma mosaikleriyle ünlü antik kent; Aphrodite ve Augustus mozaikleri hâlâ yerinde sergilenmektedir.',
    description:
      'Soli Antik Kenti, Kuzey Kıbrıs\'ın batı kıyısında yer alan ve özellikle Aphrodite mozaiğiyle tanınan önemli bir arkeolojik alandır. Kazılarda gün yüzüne çıkarılan Roma dönemi agora, bazilika, tiyatro ve konut yapıları günümüzde açık hava müzesi olarak ziyarete açıktır.',
    history:
      'MÖ 6. yüzyılda kurulan Soli, antik çağda Kıbrıs\'ın altı krallığından biri olarak büyük bir güç ve zenginlik yaşamıştır. Kentin adının "söylev" anlamına gelen Latince "soliloquy" kelimesine de kök oluşturduğu düşünülmektedir.',
    image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00–18:00',
      tuesday: '08:00–18:00',
      wednesday: '08:00–18:00',
      thursday: '08:00–18:00',
      friday: '08:00–18:00',
      saturday: '08:00–18:00',
      sunday: '08:00–18:00',
    },
    admission: {
      isFree: false,
      adultPrice: 150,
      childPrice: 50,
      currency: 'TRY',
      notes:
        'KKTC Eski Eserler ve Müzeler Dairesi resmi tarifesi (yetişkin/öğrenci); ayrı çocuk tarifesi yok. Son giriş kapanıştan 1 saat öncedir.',
    },
    address: 'Soli Yolu, Güzelyurt, KKTC',
    latitude: 35.1620,
    longitude: 32.8860,
    accessibility: {
      wheelchairAccessible: false,
    },
    estimatedVisitMinutes: 90,
    featured: false,
    nearbyPlaceSlugs: ['guzelyurt-muzesi'],
    sourceUrl: 'https://eemd.gov.ct.tr/Ziyaret-Saatleri',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'unverified',
  },

  // ══════════════════════════════════════════════════════════════
  // LEFKE
  // ══════════════════════════════════════════════════════════════

  {
    id: 'le1',
    name: 'Lefke Tarihi Kasabası',
    slug: 'lefke-tarihi-kasabasi',
    category: 'Cultural Site',
    city: 'Lefke',
    region: 'Lefke',
    shortDescription:
      'Osmanlı mirasını koruyan, narenciye bahçeleriyle çevrili sakin Kıbrıs kasabası; ağırlıklı olarak Türk Kıbrıslı dokusuyla özgün bir deneyim.',
    description:
      'Lefke, Kuzey Kıbrıs\'ın batı kesiminde yer alan, Osmanlı döneminden kalma geleneksel konut dokusunu büyük ölçüde korumuş küçük bir kasabadır. Narenciye bahçeleri ve derin vadilerin arasında saklanan kasabanın eski çarşısı, taş yapılı evleri ve camileriyle tarihin içinde yürüyüş imkânı sunmaktadır. Bunun yanı sıra Lefke, önemli bir manevi öneme sahip Şeyh Nazım Türbesi\'ne de ev sahipliği yapmaktadır.',
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes:
        'Açık kasaba dokusu, giriş ücreti yoktur. Yakındaki Şeyh Nazım Dergahı ayrı ve ücretsiz ziyaret edilebilen bir mekandır (mütevazı kıyafet gereklidir).',
    },
    address: 'Lefke Çarşısı, Lefke, KKTC',
    latitude: 35.1183,
    longitude: 32.8479,
    estimatedVisitMinutes: 90,
    featured: false,
    nearbyPlaceSlugs: ['soli-antik-kenti'],
    sourceUrl: 'https://www.lefkebelediyesi.com/en/about-lefke/historical-places/item/14-soli-antik-kenti.html',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },

  // ══════════════════════════════════════════════════════════════
  // GAZİMAĞUSA — additional
  // ══════════════════════════════════════════════════════════════

  {
    id: 'f7',
    name: 'Karpaz Doğa Parkı',
    slug: 'karpaz-doga-parki',
    category: 'Natural Attraction',
    city: 'Karpaz',
    region: 'İskele',
    shortDescription:
      'Kuzey Kıbrıs\'ın en el değmemiş bölgesi; vahşi eşekler, deniz kaplumbağaları, sessiz koylar ve bozkır manzaraları.',
    description:
      'Karpaz Yarımadası, Kuzey Kıbrıs\'ın kuzeydoğuya uzanan ve Kıbrıs\'ın en bakir doğa alanlarından birini oluşturan bölümüdür. Kaplumbağa plajları, vahşi eşek sürüleri ve el değmemiş plajlarıyla adanın en doğal haliyle karşılaşabileceğiniz bu yarımada, hem botanik hem de vahşi yaşam açısından olağanüstü zenginlik sunar.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes:
        'Ücretsiz, sınırlandırılmamış doğal koruma alanı; gişesi veya sabit saati yoktur. Erişim yolu bazı kesimlerde bakımsız olabilir.',
    },
    address: 'Karpaz Yarımadası, İskele, KKTC',
    latitude: 35.5500,
    longitude: 34.2500,
    estimatedVisitMinutes: 240,
    featured: true,
    nearbyPlaceSlugs: ['altin-sahil-karpaz', 'apostolos-andreas-manastiri'],
    sourceUrl: 'https://www.tripadvisor.com/Attraction_Review-g190375-d6211321-Reviews-Dipkarpaz_Milli_Parki_Karpaz_National_Park_Wild_Donkey_Protection_Area-Famagusta_.html',
    lastVerifiedAt: '2026-08-29',
    verificationStatus: 'verified',
  },
];
