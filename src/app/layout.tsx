import type { Metadata } from 'next';
import { Inter, Anton, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
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

// Headline/index face — a single-weight, tall, condensed grotesk. No
// italics, no optical warmth: headlines are set, not written, like a
// survey plate or gazetteer title block. Carries H1s, era names, section
// numerals — never body copy.
const anton = Anton({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

// Reading face — long-form prose only (place descriptions, history essays,
// About/FAQ copy): a book serif for the archival-document register, distinct
// from the grotesk headline and the mono instrument readouts around it.
const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
});

// Instrument face — coordinates, prices, hours, distances, index numbers,
// nav labels. Its role is deliberately larger here than "numerals only":
// this is the field-notebook/survey-readout voice that frames the whole UI.
const jbMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
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
  // No openGraph/twitter `images` here: `app/opengraph-image.tsx` and
  // `app/twitter-image.tsx` (see lib/seo/ogImage.tsx) supply the image via
  // Next's file-convention auto-injection instead, and apply to every page
  // that doesn't define its own opengraph-image/twitter-image.
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Gezeceyik Kıbrıs',
    title: 'Gezeceyik Kıbrıs: Müzeler, Kaleler, Plajlar ve Kültür',
    description:
      'Kuzey Kıbrıs\'taki en iyi gezilecek yerleri keşfedin. Müzeler, kaleler, plajlar, manastırlar, arkeolojik alanlar ve daha fazlası: açılış saatleri, fiyatlar ve ziyaretçi rehberleriyle.',
  },
  twitter: {
    card: 'summary_large_image',
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
    <html lang="tr" className={`${inter.variable} ${anton.variable} ${sourceSerif.variable} ${jbMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Flips scroll-reveal motion (see [data-motion] in globals.css) from
            "default visible" to "hidden until observed" — only once JS is
            confirmed running, so content never stays invisible without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Applies a stored explicit light/dark override (see
            ThemeToggle.tsx) before first paint, so a dark-mode visitor never
            sees a flash of the light theme. No stored value = no attribute =
            the dark-mode block in globals.css falls through to
            prefers-color-scheme, so this only needs to run at all when
            there's an explicit override to apply. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('gk-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-paper text-strong">
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <Analytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-overlay focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
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
