import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cyprus-discovery.com'),
  title: {
    default: 'Cyprus Discovery — Explore Museums, Castles, Beaches & Culture',
    template: '%s | Cyprus Discovery',
  },
  description:
    'Discover the best places to visit in Cyprus — museums, castles, archaeological sites, beaches, monasteries, and cultural destinations. Opening hours, prices, locations, and visitor guides.',
  keywords: [
    'Cyprus tourism',
    'places to visit in Cyprus',
    'Cyprus museums',
    'Cyprus castles',
    'Cyprus beaches',
    'Cyprus archaeological sites',
    'Cyprus travel guide',
    'what to see in Cyprus',
  ],
  authors: [{ name: 'Cyprus Discovery' }],
  creator: 'Cyprus Discovery',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Cyprus Discovery',
    title: 'Cyprus Discovery — Explore Museums, Castles, Beaches & Culture',
    description:
      'Discover the best places to visit in Cyprus. Museums, castles, beaches, monasteries, archaeological sites and more — with opening hours, prices and visitor guides.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cyprus Discovery — Explore the island',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyprus Discovery — Explore Museums, Castles, Beaches & Culture',
    description:
      'Find museums, castles, beaches, monasteries and cultural sites across Cyprus.',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-[#fafaf8] text-[#1a1a1a]">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
