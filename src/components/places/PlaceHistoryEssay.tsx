// components/places/PlaceHistoryEssay.tsx
// The history essay — a real editorial composition, independent of
// extracting dates/people from the free-text field. Long history gets a
// drop cap and real paragraph rhythm; short history collapses into a
// single large pull-quote treatment.

import { Place } from '@/types/place';

interface PlaceHistoryEssayProps {
  place: Place;
}

const SHORT_THRESHOLD = 220;

export function PlaceHistoryEssay({ place }: PlaceHistoryEssayProps) {
  if (!place.history) return null;

  const isShort = place.history.length < SHORT_THRESHOLD;
  const paragraphs = place.history.split(/\n+/).filter(Boolean);

  return (
    <section className="border-t border-line pt-10" aria-labelledby="history-heading">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">§ Tarih ve Arka Plan</p>
      <h2 id="history-heading" className="sr-only">
        Tarih ve Arka Plan
      </h2>

      {isShort ? (
        <p className="mt-4 max-w-2xl font-serif text-xl leading-relaxed text-ink-soft text-pretty">
          {place.history}
        </p>
      ) : (
        <div className="mt-4">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`prose-body font-serif text-lg leading-8 text-ink-soft text-pretty ${i > 0 ? 'mt-5' : ''} ${
                i === 0
                  ? 'first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-strong'
                  : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
