// components/home/WhySection.tsx
// Value proposition section — refined spacing, consistent icons, better text width.

export function WhySection() {
  const features = [
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Find places instantly',
      description:
        'Search and filter museums, castles, beaches, monasteries, and archaeological sites across all six regions of Cyprus.',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Opening hours & prices',
      description:
        'See opening times and entrance fees before you travel — so you can plan your day without surprises at the gate.',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      title: 'Get directions instantly',
      description:
        'Every place links directly to navigation. One tap and you\'re on your way — no copy-pasting addresses.',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Rich cultural context',
      description:
        'Each place comes with historical background — not just logistics, but real understanding of what you\'re seeing.',
    },
  ];

  return (
    <section className="bg-[#1a1a1a] py-16 sm:py-24" aria-labelledby="why-section-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#e8651a]">
            Why Cyprus Discovery
          </p>
          <h2
            id="why-section-heading"
            className="font-display text-2xl font-bold text-white sm:text-3xl"
          >
            Everything you need to explore Cyprus
          </h2>
          <p className="mt-4 leading-relaxed text-[#9ca3af]">
            Cyprus has 10,000 years of layered history — Mycenaean, Greek, Roman,
            Byzantine, Crusader, Venetian, Ottoman, British. We help you navigate
            it all in one place.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="flex flex-col gap-4">
              {/* Icon container */}
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-[#e8651a]">
                {icon}
              </div>
              <div>
                <h3 className="mb-1.5 text-sm font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-[#9ca3af]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
