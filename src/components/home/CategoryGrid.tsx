// components/home/CategoryGrid.tsx
// Turkish category grid — 9 categories for KKTC Discovery.
// Inline SVG icons, no emoji.

import Link from 'next/link';

interface CategoryItem {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const categories: CategoryItem[] = [
  {
    href: '/museums',
    label: 'Müzeler',
    description: 'Arkeoloji, sanat ve tarih koleksiyonları',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
  {
    href: '/castles',
    label: 'Kaleler',
    description: 'Ortaçağ kaleleri ve Haçlı surları',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21V9l9-6 9 6v12M9 21v-6h6v6M3 9h18M9 9V3m6 6V3" />
      </svg>
    ),
  },
  {
    href: '/places?category=Archaeological+Site',
    label: 'Arkeolojik Alanlar',
    description: 'Antik kentler, tiyatrolar ve mozaikler',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    href: '/places?category=Monastery',
    label: 'Manastırlar',
    description: 'Bizans kiliseleri ve dini miras',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    href: '/beaches',
    label: 'Plajlar',
    description: 'Berrak sular ve el değmemiş koylar',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    href: '/places?category=Natural+Attraction',
    label: 'Doğa',
    description: 'Milli parklar, vadiler ve deniz mağaraları',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l7 14 7-14M5 3l7 7 7-7" />
      </svg>
    ),
  },
  {
    href: '/historical-places',
    label: 'Tarihi Yerler',
    description: 'Osmanlı hanları, surlar ve miras alanları',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/places?category=Viewpoint',
    label: 'Seyir Noktaları',
    description: 'Panoramik Akdeniz ve dağ manzaraları',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    href: '/places?category=Cultural+Site',
    label: 'Kültürel Alanlar',
    description: 'Çarşılar, hanlar ve kültürel mekânlar',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
            Türe göre keşfet
          </p>
          <h2
            id="categories-heading"
            className="font-display text-2xl font-bold text-[#1a1a1a] sm:text-3xl"
          >
            Ne arıyorsunuz?
          </h2>
        </div>

        <ul
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          role="list"
        >
          {categories.map(({ href, label, description, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex flex-col gap-3 rounded-md border border-[#e8e4de] bg-white p-4 transition-all hover:border-[#e8651a]/40 hover:shadow-sm sm:p-5"
              >
                {/* Icon */}
                <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#f5f2ee] text-[#6b7280] transition-colors group-hover:bg-[#e8651a]/10 group-hover:text-[#e8651a]">
                  {icon}
                </span>

                {/* Label */}
                <span className="font-display text-sm font-semibold text-[#1a1a1a]">
                  {label}
                </span>

                {/* Description */}
                <span className="hidden text-xs leading-relaxed text-[#9ca3af] sm:block">
                  {description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
