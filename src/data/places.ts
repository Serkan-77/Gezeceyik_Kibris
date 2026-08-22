// data/places.ts
// ============================================================
// SAMPLE DATA — For development purposes only.
// All opening hours, prices, and contact details are
// ILLUSTRATIVE and have NOT been verified against official sources.
// verificationStatus: 'sample' on every record.
// Replace with verified data before going to production.
// ============================================================

import { Place } from '@/types/place';

export const places: Place[] = [
  // ── MUSEUMS ─────────────────────────────────────────────────
  {
    id: '1',
    name: 'Cyprus Museum',
    slug: 'cyprus-museum',
    category: 'Museum',
    city: 'Nicosia',
    region: 'Nicosia',
    shortDescription:
      'The largest and most important archaeological museum in Cyprus, housing artefacts spanning 10,000 years of history.',
    description:
      "The Cyprus Museum in Nicosia is the island's premier archaeological institution, offering an extraordinary journey through Cypriot civilisation from the Neolithic era to the end of the Roman period. Its 14 galleries house an unrivalled collection of pottery, sculpture, jewellery, and coins excavated from sites across the island.",
    history:
      'Established in 1882, the Cyprus Museum occupies a neoclassical building completed in 1908. Its collections were significantly expanded following the systematic archaeological excavations of the 20th century. Among its most prized exhibits are the terracotta army from Agia Irini (circa 7th to 6th century BC) and the iconic Aphrodite of Soloi sculpture.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:00\u201317:00',
      tuesday: '09:00\u201317:00',
      wednesday: '09:00\u201317:00',
      thursday: '09:00\u201317:00',
      friday: '09:00\u201317:00',
      saturday: '09:00\u201317:00',
      sunday: '10:00\u201313:00',
    },
    admission: {
      isFree: false,
      adultPrice: 5,
      childPrice: 2.5,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    phone: '+357 22 865 888',
    website: 'https://www.visitcyprus.com',
    address: 'Mouseiou 1, Nicosia 1097, Cyprus',
    latitude: 35.1723,
    longitude: 33.3591,
    accessibility: {
      wheelchairAccessible: true,
      audioGuide: true,
      guidedTours: true,
    },
    estimatedVisitMinutes: 90,
    featured: true,
    nearbyPlaceSlugs: ['leventis-municipal-museum', 'byzantine-museum-nicosia'],
    sourceUrl: 'https://www.visitcyprus.com',
    verificationStatus: 'sample',
  },
  {
    id: '2',
    name: 'Leventis Municipal Museum',
    slug: 'leventis-municipal-museum',
    category: 'Museum',
    city: 'Nicosia',
    region: 'Nicosia',
    shortDescription:
      'Award-winning free museum tracing the history of Nicosia from antiquity to the modern era through fascinating everyday objects.',
    description:
      "The Leventis Municipal Museum of Nicosia tells the story of the city across more than ten thousand years of habitation. Spread across a beautifully restored building in the old city, the museum uses everyday objects, maps, and interactive displays to bring Nicosia's layered history to life.",
    history:
      'Opened in 1989 and winner of the Council of Europe Museum Prize in 1991, the Leventis Municipal Museum is housed in a landmark 19th-century building in Laiki Geitonia, the restored old quarter of Nicosia. Its permanent collection covers periods from ancient times through Frankish, Venetian, Ottoman, British Colonial, and modern Cypriot rule.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: null,
      tuesday: '10:00\u201316:30',
      wednesday: '10:00\u201316:30',
      thursday: '10:00\u201316:30',
      friday: '10:00\u201316:30',
      saturday: '10:00\u201316:30',
      sunday: null,
    },
    admission: {
      isFree: true,
      notes: 'Free entry.',
    },
    phone: '+357 22 661 475',
    website: 'https://www.leventismuseum.org.cy',
    address: 'Hippocrates 17, Nicosia 1016, Cyprus',
    latitude: 35.1696,
    longitude: 33.3637,
    accessibility: {
      wheelchairAccessible: true,
      audioGuide: false,
      guidedTours: true,
    },
    estimatedVisitMinutes: 60,
    featured: true,
    nearbyPlaceSlugs: ['cyprus-museum', 'byzantine-museum-nicosia'],
    sourceUrl: 'https://www.leventismuseum.org.cy',
    verificationStatus: 'sample',
  },
  {
    id: '3',
    name: 'Byzantine Museum of Nicosia',
    slug: 'byzantine-museum-nicosia',
    category: 'Museum',
    city: 'Nicosia',
    region: 'Nicosia',
    shortDescription:
      'Home to one of the finest collections of Byzantine icons and ecclesiastical art in the Eastern Mediterranean.',
    description:
      "The Byzantine Museum houses an exceptional collection of Byzantine and post-Byzantine icons, mosaics, and ecclesiastical artefacts spanning the 6th to the 19th century. It occupies the Archbishop's Palace complex in the heart of old Nicosia and represents an irreplaceable window into Cypriot religious and artistic heritage.",
    history:
      'The collection was established to safeguard Cypriot ecclesiastical art and grew significantly after 1974, when many icons and artefacts were displaced from occupied areas. The museum\'s most notable treasures include 6th-century mosaics from the Church of Panagia Kanakaria in Lythrangomi.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:00\u201317:00',
      tuesday: '09:00\u201317:00',
      wednesday: '09:00\u201317:00',
      thursday: '09:00\u201317:00',
      friday: '09:00\u201317:00',
      saturday: '09:00\u201313:00',
      sunday: null,
    },
    admission: {
      isFree: false,
      adultPrice: 5,
      childPrice: 2,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    phone: '+357 22 430 008',
    address: 'Archbishop Kyprianos Square, Nicosia 1016, Cyprus',
    latitude: 35.1701,
    longitude: 33.365,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: true,
    },
    estimatedVisitMinutes: 60,
    featured: false,
    nearbyPlaceSlugs: ['leventis-municipal-museum', 'cyprus-museum'],
    verificationStatus: 'sample',
  },

  // ── CASTLES ──────────────────────────────────────────────────
  {
    id: '4',
    name: 'Kyrenia Castle',
    slug: 'kyrenia-castle',
    category: 'Castle',
    city: 'Kyrenia',
    region: 'Kyrenia',
    shortDescription:
      "A magnificent Byzantine-era castle guarding Kyrenia's picturesque harbour, housing the remarkable Shipwreck Museum.",
    description:
      "Kyrenia Castle is one of the best-preserved medieval fortresses in the Eastern Mediterranean. Dominating the old harbour at Kyrenia, the castle was built by the Byzantines, extended by the Lusignans, and reinforced by the Venetians. Inside, it houses the Shipwreck Museum \u2014 home to a 2,300-year-old Greek merchant vessel, the oldest recovered ship in the world.",
    history:
      'The earliest Byzantine fortifications on this site date to the 7th century AD, constructed as a defence against Arab raids. The Lusignan dynasty greatly expanded the castle in the 12th and 13th centuries, adding the distinctive round towers. The Venetians reinforced it further in the 16th century, though the Ottomans captured it in 1570 after a brief siege.',
    image: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00\u201317:00',
      tuesday: '08:00\u201317:00',
      wednesday: '08:00\u201317:00',
      thursday: '08:00\u201317:00',
      friday: '08:00\u201317:00',
      saturday: '08:00\u201317:00',
      sunday: '08:00\u201317:00',
    },
    admission: {
      isFree: false,
      adultPrice: 6,
      childPrice: 3,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    address: 'Kyrenia Harbour, Kyrenia, Cyprus',
    latitude: 35.3415,
    longitude: 33.3186,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: true,
      notes: 'Steep ramparts and stairs limit wheelchair access.',
    },
    estimatedVisitMinutes: 90,
    featured: true,
    nearbyPlaceSlugs: ['bellapais-abbey'],
    verificationStatus: 'sample',
  },
  {
    id: '5',
    name: 'Limassol Medieval Castle',
    slug: 'limassol-medieval-castle',
    category: 'Castle',
    city: 'Limassol',
    region: 'Limassol',
    shortDescription:
      "A compact medieval castle at the heart of Limassol's old town, famously the site of Richard the Lionheart's wedding in 1191.",
    description:
      'Limassol Medieval Castle stands at the centre of the old town, a short walk from the seafront. Now home to the Cyprus Medieval Museum, it houses an impressive collection of Byzantine and medieval artefacts, armour, coins, and ecclesiastical items. The castle\'s most remarkable historical claim is that Richard I of England married Berengaria of Navarre here in 1191 during the Third Crusade.',
    history:
      'The earliest fortification on this site dates to the Byzantine period. The current structure was largely built by the Lusignan kings and later modified by the Venetians and Ottomans. After the Ottoman conquest of 1570 it served as a prison, before eventually being restored and opened as a museum.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:00\u201317:00',
      tuesday: '09:00\u201317:00',
      wednesday: '09:00\u201317:00',
      thursday: '09:00\u201317:00',
      friday: '09:00\u201317:00',
      saturday: '09:00\u201317:00',
      sunday: '10:00\u201313:00',
    },
    admission: {
      isFree: false,
      adultPrice: 4.5,
      childPrice: 2,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    phone: '+357 25 305 419',
    address: 'Richard and Berengaria Street, Limassol 3041, Cyprus',
    latitude: 34.6715,
    longitude: 33.0446,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: true,
    },
    estimatedVisitMinutes: 60,
    featured: true,
    nearbyPlaceSlugs: ['kolossi-castle'],
    verificationStatus: 'sample',
  },
  {
    id: '6',
    name: 'Kolossi Castle',
    slug: 'kolossi-castle',
    category: 'Castle',
    city: 'Kolossi',
    region: 'Limassol',
    shortDescription:
      'A well-preserved Crusader castle and former headquarters of the Knights of Saint John, surrounded by vineyards west of Limassol.',
    description:
      'Kolossi Castle is a compact but strikingly well-preserved three-storey Crusader fortress dating from the 15th century. Situated amid the vineyards of the Kolossi village, it was the Grand Commandery of the Knights Hospitaller and later the Knights of Saint John. The area was historically famous for Commandaria \u2014 one of the world\'s oldest named wines, still produced in the region today.',
    history:
      'The original castle on this site was granted to the Knights of Saint John in 1210. The current structure was rebuilt in 1454 by the Lusignan ruler John de Lastique. After the Ottoman conquest, the castle fell into disuse and disrepair before being restored by the Cyprus Department of Antiquities in the 20th century.',
    image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:30\u201317:00',
      tuesday: '08:30\u201317:00',
      wednesday: '08:30\u201317:00',
      thursday: '08:30\u201317:00',
      friday: '08:30\u201317:00',
      saturday: '08:30\u201317:00',
      sunday: '08:30\u201317:00',
    },
    admission: {
      isFree: false,
      adultPrice: 2.5,
      childPrice: 1,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    address: 'Kolossi, Limassol District, Cyprus',
    latitude: 34.6698,
    longitude: 32.9313,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: false,
    },
    estimatedVisitMinutes: 45,
    featured: false,
    nearbyPlaceSlugs: ['limassol-medieval-castle', 'kourion-ancient-theatre'],
    verificationStatus: 'sample',
  },

  // ── ARCHAEOLOGICAL SITES ─────────────────────────────────────
  {
    id: '7',
    name: 'Paphos Archaeological Park',
    slug: 'paphos-archaeological-park',
    category: 'Archaeological Site',
    city: 'Paphos',
    region: 'Paphos',
    shortDescription:
      'A UNESCO World Heritage Site containing some of the most spectacular Roman mosaics ever discovered, set in an open-air coastal park.',
    description:
      'The Paphos Archaeological Park (Kato Paphos) is a UNESCO World Heritage Site of extraordinary significance. The park encompasses the remains of ancient villas, a Roman odeon, a lighthouse, medieval fortifications, and \u2014 most spectacularly \u2014 the Houses of Dionysos, Theseus, Aion, and Orpheus, whose floor mosaics are among the finest examples of Roman art in the Eastern Mediterranean.',
    history:
      'The area around Kato Paphos has been continuously inhabited since the Neolithic period. The ancient city of Nea Paphos became the capital of Cyprus during the Hellenistic period and was an important Roman administrative centre. The mosaics, created in the 3rd and 4th centuries AD, decorated the floors of wealthy Roman villas and depict scenes from Greek mythology with extraordinary skill and colour.',
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:00\u201319:30',
      tuesday: '08:00\u201319:30',
      wednesday: '08:00\u201319:30',
      thursday: '08:00\u201319:30',
      friday: '08:00\u201319:30',
      saturday: '08:00\u201319:30',
      sunday: '08:00\u201319:30',
    },
    admission: {
      isFree: false,
      adultPrice: 8.5,
      childPrice: 4,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting. Combination tickets may be available.',
    },
    phone: '+357 26 306 217',
    website: 'https://www.visitcyprus.com',
    address: 'Kato Paphos, Paphos 8101, Cyprus',
    latitude: 34.7546,
    longitude: 32.4074,
    accessibility: {
      wheelchairAccessible: true,
      audioGuide: true,
      guidedTours: true,
      notes: 'Most mosaic areas accessible. Some paths may be uneven.',
    },
    estimatedVisitMinutes: 120,
    featured: true,
    nearbyPlaceSlugs: [],
    sourceUrl: 'https://www.visitcyprus.com',
    verificationStatus: 'sample',
  },
  {
    id: '8',
    name: 'Kourion Ancient Theatre',
    slug: 'kourion-ancient-theatre',
    category: 'Archaeological Site',
    city: 'Episkopi',
    region: 'Limassol',
    shortDescription:
      'A stunning Greco-Roman theatre carved into a clifftop overlooking the Mediterranean, still used for live performances today.',
    description:
      'The ancient city of Kourion is one of the most dramatic archaeological sites in Cyprus. Its centrepiece is the beautifully restored Greco-Roman theatre, which looks out across a vast expanse of the Mediterranean. The wider site includes remarkable mosaic floors in the House of Eustolios, early Christian baths, and the remains of an early Christian basilica.',
    history:
      'Kourion was one of the most powerful city-kingdoms of ancient Cyprus, with settlement dating back to the Mycenaean period (around 1200 BC). The theatre was originally built in the 2nd century BC and significantly expanded during the Roman period. A catastrophic earthquake in 365 AD devastated much of the city.',
    image: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '08:30\u201317:00',
      tuesday: '08:30\u201317:00',
      wednesday: '08:30\u201317:00',
      thursday: '08:30\u201317:00',
      friday: '08:30\u201317:00',
      saturday: '08:30\u201317:00',
      sunday: '08:30\u201317:00',
    },
    admission: {
      isFree: false,
      adultPrice: 4.5,
      childPrice: 2,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    address: 'Episkopi, Limassol District, Cyprus',
    latitude: 34.6598,
    longitude: 32.8884,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: true,
      notes: 'Rocky terrain limits wheelchair access.',
    },
    estimatedVisitMinutes: 90,
    featured: false,
    nearbyPlaceSlugs: ['kolossi-castle', 'limassol-medieval-castle'],
    verificationStatus: 'sample',
  },

  // ── HISTORICAL PLACES ────────────────────────────────────────
  {
    id: '9',
    name: 'Bellapais Abbey',
    slug: 'bellapais-abbey',
    category: 'Historical Place',
    city: 'Bellapais',
    region: 'Kyrenia',
    shortDescription:
      'Hauntingly beautiful Gothic abbey ruins perched in a hilltop village north of Kyrenia, immortalised by Lawrence Durrell.',
    description:
      "Bellapais Abbey is among the finest examples of Gothic architecture in the Eastern Mediterranean. Set in the charming hilltop village of Bellapais, the ruined abbey commands breathtaking views of the Kyrenia coastline and the plain below. Its elegant cloister, magnificent refectory, and soaring church arcades are preserved well enough to give a vivid impression of its former grandeur.",
    history:
      'Founded by Augustinian monks around 1200, Bellapais Abbey \u2014 its name derived from "Abbaye de la Paix" (Abbey of Peace) \u2014 flourished under Lusignan patronage in the 13th and 14th centuries. The abbey fell into decline after the Ottoman conquest of 1570. British author Lawrence Durrell lived in the village in the 1950s and immortalised it in his memoir "Bitter Lemons of Cyprus".',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:00\u201317:00',
      tuesday: '09:00\u201317:00',
      wednesday: '09:00\u201317:00',
      thursday: '09:00\u201317:00',
      friday: '09:00\u201317:00',
      saturday: '09:00\u201317:00',
      sunday: '09:00\u201317:00',
    },
    admission: {
      isFree: false,
      adultPrice: 4,
      childPrice: 2,
      currency: 'EUR',
      notes: 'Sample price \u2014 verify before visiting.',
    },
    address: 'Bellapais Village, Kyrenia, Cyprus',
    latitude: 35.3136,
    longitude: 33.3479,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: true,
    },
    estimatedVisitMinutes: 60,
    featured: true,
    nearbyPlaceSlugs: ['kyrenia-castle'],
    verificationStatus: 'sample',
  },

  // ── MONASTERIES ──────────────────────────────────────────────
  {
    id: '10',
    name: 'Kykkos Monastery',
    slug: 'kykkos-monastery',
    category: 'Monastery',
    city: 'Troodos',
    region: 'Nicosia',
    shortDescription:
      'The wealthiest and most celebrated monastery in Cyprus, home to a revered icon of the Virgin Mary attributed to Saint Luke.',
    description:
      'Kykkos Monastery is the most important and richest monastery on the island, perched at 1,140 metres in the Troodos Mountains. Its museum houses an extraordinary collection of ecclesiastical treasures, manuscripts, vestments, and Byzantine icons accumulated over nine centuries.',
    history:
      'Founded around 1092 during the Byzantine period by the monk Isaiah with the support of the Byzantine Emperor Alexios I Komnenos, Kykkos was granted one of the three icons of the Virgin Mary believed to have been painted by Saint Luke the Evangelist. Archbishop Makarios III, the first President of Cyprus, is buried nearby on Throni Hill.',
    image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '10:00\u201318:00',
      tuesday: '10:00\u201318:00',
      wednesday: '10:00\u201318:00',
      thursday: '10:00\u201318:00',
      friday: '10:00\u201318:00',
      saturday: '10:00\u201318:00',
      sunday: '10:00\u201318:00',
    },
    admission: {
      isFree: false,
      adultPrice: 5,
      childPrice: 2,
      currency: 'EUR',
      notes: 'Museum admission. Monastery church is free. Sample price \u2014 verify before visiting.',
    },
    phone: '+357 22 942 736',
    website: 'https://www.kykkos-museum.cy.net',
    address: 'Kykkos Monastery, Troodos 2560, Cyprus',
    latitude: 34.9839,
    longitude: 32.7369,
    accessibility: {
      wheelchairAccessible: true,
      audioGuide: false,
      guidedTours: true,
      notes: 'Most areas accessible. Modest dress code required.',
    },
    estimatedVisitMinutes: 90,
    featured: false,
    nearbyPlaceSlugs: [],
    verificationStatus: 'sample',
  },

  // ── CULTURAL SITES ────────────────────────────────────────────
  {
    id: '11',
    name: 'Hala Sultan Tekke',
    slug: 'hala-sultan-tekke',
    category: 'Cultural Site',
    city: 'Larnaca',
    region: 'Larnaca',
    shortDescription:
      'An important Islamic shrine and mosque on the shore of Larnaca Salt Lake, set in a peaceful palm-fringed garden.',
    description:
      "Hala Sultan Tekke is one of the most sacred Islamic sites in the world, housing the tomb of Umm Haram bint Milhan, a companion of the Prophet Muhammad. Set beside the shimmering Larnaca Salt Lake \u2014 famous for its winter flamingo population \u2014 the mosque and gardens form one of the most serene and photogenic spots on the island, open to visitors of all faiths.",
    history:
      'The site marks the place where Umm Haram bint Milhan fell from her mule and died during an Arab raid on Cyprus in 649 AD. A simple tomb was established at the site, which grew in significance over the centuries. The current mosque complex was built in 1816 by the Ottoman Governor of Cyprus.',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80',
    gallery: [],
    openingHours: {
      monday: '09:00\u201317:30',
      tuesday: '09:00\u201317:30',
      wednesday: '09:00\u201317:30',
      thursday: '09:00\u201317:30',
      friday: '09:00\u201317:30',
      saturday: '09:00\u201317:30',
      sunday: '09:00\u201317:30',
    },
    admission: {
      isFree: true,
      notes: 'Free entry. Modest dress required \u2014 headscarves available at entrance.',
    },
    address: 'Larnaca Salt Lake, Larnaca, Cyprus',
    latitude: 34.8688,
    longitude: 33.6068,
    accessibility: {
      wheelchairAccessible: true,
      audioGuide: false,
      guidedTours: false,
    },
    estimatedVisitMinutes: 45,
    featured: false,
    nearbyPlaceSlugs: ['fig-tree-bay'],
    verificationStatus: 'sample',
  },

  // ── NATURAL ATTRACTIONS ───────────────────────────────────────
  {
    id: '12',
    name: 'Cape Greco National Forest Park',
    slug: 'cape-greco',
    category: 'Natural Attraction',
    city: 'Ayia Napa',
    region: 'Famagusta',
    shortDescription:
      'A dramatic sea caves and cliff landscape at the southeastern tip of Cyprus, with turquoise waters and scenic coastal trails.',
    description:
      "Cape Greco (Cavo Greco) is one of the most spectacular natural areas in Cyprus, a rocky headland at the southeastern tip of the island where the Mediterranean's deep blues crash against white limestone cliffs. The national forest park offers sea caves accessible by boat or snorkel, cliff-edge viewpoints, well-marked walking and cycling trails, and some of the clearest water in the Mediterranean.",
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes: 'National forest park \u2014 free to enter. Sea cave boat trips are charged separately by local operators.',
    },
    address: 'Cape Greco, Famagusta District, Cyprus',
    latitude: 34.9603,
    longitude: 34.0786,
    accessibility: {
      wheelchairAccessible: false,
      audioGuide: false,
      guidedTours: false,
      notes: 'Rocky coastal terrain. Some trail sections accessible.',
    },
    estimatedVisitMinutes: 120,
    featured: true,
    nearbyPlaceSlugs: ['fig-tree-bay'],
    verificationStatus: 'sample',
  },

  // ── BEACHES ───────────────────────────────────────────────────
  {
    id: '13',
    name: 'Fig Tree Bay',
    slug: 'fig-tree-bay',
    category: 'Beach',
    city: 'Protaras',
    region: 'Famagusta',
    shortDescription:
      "One of Cyprus's most celebrated beaches \u2014 a crescent of fine white sand and famously clear turquoise water at Protaras.",
    description:
      'Fig Tree Bay is consistently ranked among the most beautiful beaches in Cyprus and the Eastern Mediterranean. Its sheltered crescent of fine white sand and shallow, crystal-clear turquoise water makes it ideal for families and snorkellers alike. The beach is well-organised with sunbeds, watersports, and nearby tavernas, yet retains a natural beauty that draws visitors year after year.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
      notes: 'Public beach. Sunbed hire and watersports charged separately.',
    },
    address: 'Fig Tree Bay, Protaras, Famagusta District, Cyprus',
    latitude: 35.0166,
    longitude: 34.0573,
    accessibility: {
      wheelchairAccessible: true,
      audioGuide: false,
      guidedTours: false,
      notes: 'Beach wheelchair available from local operators.',
    },
    estimatedVisitMinutes: 180,
    featured: false,
    nearbyPlaceSlugs: ['cape-greco'],
    verificationStatus: 'sample',
  },

  // ── VIEWPOINTS ────────────────────────────────────────────────
  {
    id: '14',
    name: 'Aphrodite Hills Viewpoint',
    slug: 'aphrodite-hills-viewpoint',
    category: 'Viewpoint',
    city: 'Kouklia',
    region: 'Paphos',
    shortDescription:
      'Sweeping panoramic views over the birthplace of Aphrodite and the Paphos coastline from the Aphrodite Hills.',
    description:
      "The Aphrodite Hills area above Kouklia offers one of the most iconic panoramic views in Cyprus, looking out over the legendary Rock of Aphrodite (Petra tou Romiou) and the deep blue Mediterranean below. The viewpoint is easily accessible and provides a dramatic perspective of the rugged coastline that, according to mythology, is where the goddess Aphrodite rose from the sea.",
    history:
      'The surrounding area of Kouklia is the site of ancient Palaipaphos \u2014 the most important sanctuary of Aphrodite in the ancient world. The Temple of Aphrodite at Palaipaphos attracted pilgrims from across the Greek and Roman world. The famous "Birthplace of Aphrodite" rock formation offshore is listed as a UNESCO World Heritage Site as part of the Paphos area.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gallery: [],
    admission: {
      isFree: true,
    },
    address: 'Aphrodite Hills, Kouklia, Paphos District, Cyprus',
    latitude: 34.7139,
    longitude: 32.5079,
    estimatedVisitMinutes: 30,
    featured: false,
    nearbyPlaceSlugs: ['paphos-archaeological-park'],
    verificationStatus: 'sample',
  },
];
