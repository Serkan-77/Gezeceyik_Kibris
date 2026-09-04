import type { Metadata } from 'next';
import { Public_Sans, Spectral, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/layout/Analytics';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SITE_URL } from '@/lib/config';

// 'latin-ext' is required for correct Turkish glyphs (ı, ğ, ş, ç, ö, ü) —
// the 'latin' subset alone silently falls back to a system font for these,
// which is why display type has looked subtly inconsistent on Turkish copy.
const inter = Public_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// Display face — "Layered Light" art direction. Spectral's ink traps and
// angled stress read closer to carved/gilded lettering (mosaic captions,
// manuscript titling) than a bookish editorial face — it carries place,
// story and emotion (headlines, place names, history prose); UI chrome
// (nav, buttons, labels, filters) stays on the sans for legibility at
// small sizes. Italic is used for in-family emphasis in display type, so
// both styles are loaded.
const editorialSerif = Spectral({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

// Numeral/technical face — coordinates, prices, hours, distances only.
// Never used for prose or UI copy.
const plexMono = Roboto_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür',
    template: '%s | Gezeceyik Kıbrıs',
  },
  description:
    'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin: müzeler, kaleler, arkeolojik alanlar, plajlar, manastırlar ve kültürel destinasyonlar. Açılış saatleri, fiyatlar, konumlar ve ziyaretçi rehberleri.',
  keywords: [
    'Kuzey Kıbrıs gezilecek yerler',
    'KKTC turizm',
    'Kuzey Kıbrıs müzeleri',
    'Kuzey Kıbrıs kaleleri',
    'Kuzey Kıbrıs plajları',
    'Kuzey Kıbrıs arkeolojik alanları',
    'Kuzey Kıbrıs gezi rehberi',
    'Kuzey Kıbrıs\'ta ne görülür',
  ],
  authors: [{ name: 'Gezeceyik Kıbrıs' }],
  creator: 'Gezeceyik Kıbrıs',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Gezeceyik Kıbrıs',
    title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür',
    description:
      'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin. Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası: açılış saatleri, fiyatlar ve ziyaretçi rehberleriyle.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gezeceyik Kıbrıs: Adayı keşfedin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür',
    description:
      'Kuzey Kıbrıs\'taki müzeleri, kaleleri, plajları, manastırları ve kültürel alanları keşfedin.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${editorialSerif.variable} ${plexMono.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-paper text-strong">
        <div
          style={{ display: 'contents' }}
          dangerouslySetInnerHTML={{
            __html:
              '<!-- DESIGN DIRECTION CONTRACT (revision 2 — supersedes seed 0e117ca0)\n' +
              'THESIS: A confident, cinematic editorial travel brand — one strong authored photograph per moment, huge quiet type, real motion — not a mosaic-pattern concept, not a token recolor of the incumbent template.\n' +
              'OWN-WORLD: Terracotta action color, antique-gold as a single restrained hairline (never a repeating pattern), lapis-ink immersive dark register, Spectral display serif over Public Sans UI, Roboto Mono for measured facts, GSAP + Lenis choreography.\n' +
              'STORY: A visitor reads "this is a premium, art-directed guide" within the first viewport, not "a listings template with a coat of paint."\n' +
              'FIRST VIEWPORT: Full-bleed single verified photo, GSAP word-stagger headline reveal, minimal chrome, terracotta primary CTA, no decorative pattern competing with the photo.\n' +
              'FORM: "Cinematic Editorial" — replaces the abandoned tile-mosaic execution; palette and type carried forward, composition and motion rebuilt from zero per explicit user direction.\n' +
              'FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.\n' +
              '-->',
          }}
        />
        <Analytics />
        <SmoothScroll />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
