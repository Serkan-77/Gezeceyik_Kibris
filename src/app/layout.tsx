import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/layout/Analytics';
import { DraftRouteProvider } from '@/context/DraftRouteContext';
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteSchema, organizationSchema } from '@/lib/seo/structuredData';
import { SITE_URL } from '@/lib/config';

// 'latin-ext' is required for correct Turkish glyphs (ı, ğ, ş, ç, ö, ü) —
// the 'latin' subset alone silently falls back to a system font for these.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// Display face — carries destination names, headlines and story. Fraunces'
// optical sizing and warm ink traps read as an editorial travel voice, not
// a bookish serif; italic is used for in-family emphasis. UI chrome (nav,
// buttons, labels, filters) stays on the sans for legibility at small sizes.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

// Numeral/technical face — coordinates, prices, hours, distances only.
// Never used for prose or UI copy.
const jbMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jbmono',
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
  // No openGraph/twitter `images` here: the previous default (`/og-image.jpg`)
  // does not exist anywhere in `public/` — every social share preview on
  // the whole site was silently pointing at a 404. Omitting `images`
  // entirely means link previews fall back to text-only (title +
  // description), which is a real, honest result — a broken image icon
  // is worse. Add a real 1200×630 `public/og-image.jpg` and restore an
  // `images` array here (and it will apply to every page that doesn't
  // set its own, e.g. category pages) — see the launch report for this
  // flagged as a manual follow-up.
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Gezeceyik Kıbrıs',
    title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür',
    description:
      'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin. Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası: açılış saatleri, fiyatlar ve ziyaretçi rehberleriyle.',
  },
  twitter: {
    card: 'summary',
    title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür',
    description:
      'Kuzey Kıbrıs\'taki müzeleri, kaleleri, plajları, manastırları ve kültürel alanları keşfedin.',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Default canonical for any page that doesn't set its own (see
  // lib/config.ts for why SITE_URL is the one place a future custom
  // domain gets configured). Indexable pages each set a specific one;
  // this is the fallback, not the source of truth for those.
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${fraunces.variable} ${jbMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-strong">
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <Analytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-overlay focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          İçeriğe geç
        </a>
        <DraftRouteProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </DraftRouteProvider>
      </body>
    </html>
  );
}
