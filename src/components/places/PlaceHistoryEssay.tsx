// components/places/PlaceHistoryEssay.tsx
// The history essay — a real editorial composition that does NOT depend
// on extracting dates/people/phrases from the free-text history field
// (Phase 4 Correction 3: marginalia was optional progressive enhancement
// only, and this page must look strong without it). Long history gets a
// drop cap and real paragraph rhythm; short history collapses gracefully
// into a single large pull-quote treatment rather than sitting alone in
// a template built for a long read.

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
      <h2 id="history-heading" className="mb-5 text-label font-semibold uppercase tracking-wider text-subtle">
        Tarih ve Arka Plan
      </h2>

      {isShort ? (
        <p className="max-w-2xl font-display text-block-title leading-relaxed text-ink-soft text-pretty">
          {place.history}
        </p>
      ) : (
        paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className={`prose-body font-display text-body leading-8 text-ink-soft text-pretty ${
              i > 0 ? 'mt-5' : ''
            } ${
              i === 0
                ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-strong'
                : ''
            }`}
          >
            {paragraph}
          </p>
        ))
      )}
    </section>
  );
}
