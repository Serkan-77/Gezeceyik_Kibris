import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/layout/Analytics';
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
    <html lang="tr" className={`${inter.variable} ${fraunces.variable} ${jbMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-strong">
        <Analytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-overlay focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          İçeriğe geç
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
