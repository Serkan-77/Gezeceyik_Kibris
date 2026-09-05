'use client';
// components/rating/PlaceRatingWidget.tsx
// "Gezeceyik Puanı" — the community rating block on a place detail page.
// Not a visit-verified review system: anyone who feels informed enough to
// rate a place may do so (Section "Gezeceyik Community Rating" — no
// check-in, no GPS, no ticket verification). Editorial-styled, not an
// e-commerce review card: no yellow-everywhere, no giant white box, no
// oversized stars.
//
// The public average/count arrive as server-rendered props (safe to
// prerender — not visitor-specific). The visitor's OWN rating is fetched
// client-side from /api/ratings/mine on mount, for the same reason the
// draft route's data is client-fetched: this component sits on the
// statically-generated place-detail page (generateStaticParams +
// revalidate=3600 for all 121 places), and reading the anon cookie at
// render time there would force it dynamic for every visitor.

import { useEffect, useId, useState } from 'react';
import { submitRatingAction } from '@/app/places/actions';
import { starMeaning, communityDescriptor } from '@/lib/ratings/descriptors';
import { StarIcon } from '@/components/ui/icons';
import { tr } from '@/lib/i18n/tr';

interface PlaceRatingWidgetProps {
  placeId: string;
  initialAverage: number | undefined;
  initialCount: number;
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

export function PlaceRatingWidget({ placeId, initialAverage, initialCount }: PlaceRatingWidgetProps) {
  const groupId = useId();
  const [average, setAverage] = useState(initialAverage);
  const [count, setCount] = useState(initialCount);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/ratings/mine?placeId=${encodeURIComponent(placeId)}`)
      .then((res) => res.json())
      .then((data: { rating: number | null }) => {
        if (!cancelled) setMyRating(data.rating);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const displayValue = hoverValue ?? myRating ?? 0;
  const descriptor = communityDescriptor(average, count);

  async function handleRate(value: number) {
    if (submitting) return;
    const previous = myRating;
    setMyRating(value); // optimistic
    setError(null);
    setSubmitting(true);
    setJustSaved(false);
    try {
      const result = await submitRatingAction(placeId, value);
      if (result.error || !result.summary) {
        setMyRating(previous); // roll back — "do not permanently display the vote as saved"
        setError(tr.rating.saveFailed);
        return;
      }
      setAverage(result.summary.average);
      setCount(result.summary.count);
      setMyRating(result.summary.myRating);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch {
      setMyRating(previous);
      setError(tr.rating.saveFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-block-title font-semibold text-strong">{tr.rating.question}</h2>

      <div
        role="radiogroup"
        aria-label={tr.rating.puaniLabel}
        className="mt-4 flex items-center gap-1"
        onMouseLeave={() => setHoverValue(null)}
      >
        {STAR_VALUES.map((value) => {
          const filled = value <= displayValue;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={myRating === value}
              aria-label={tr.rating.starLabel(value, starMeaning(value))}
              id={`${groupId}-star-${value}`}
              disabled={submitting}
              onMouseEnter={() => setHoverValue(value)}
              onFocus={() => setHoverValue(value)}
              onBlur={() => setHoverValue(null)}
              onClick={() => handleRate(value)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-line transition-colors hover:bg-surface-muted disabled:pointer-events-none"
            >
              <StarIcon filled={filled} className={`h-6 w-6 ${filled ? 'text-terracotta' : 'text-line'}`} />
            </button>
          );
        })}
        <span className="ml-2 min-w-0 text-body-sm text-muted" aria-live="polite">
          {displayValue > 0 ? starMeaning(displayValue) : null}
          {justSaved && <span className="ml-1.5 text-success">· {tr.rating.saved} ✓</span>}
        </span>
      </div>

      {error && <p className="mt-2 text-body-sm text-danger">{error}</p>}

      <div className="mt-4 border-t border-line pt-4">
        {count === 0 ? (
          <p className="text-body-sm text-subtle">
            {tr.rating.empty} <span className="text-strong">{tr.rating.emptyCta}</span>
          </p>
        ) : (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-body-sm">
            <span className="font-display text-block-title font-semibold text-strong">
              {average?.toFixed(1)} <StarIcon filled className="inline h-4 w-4 -translate-y-0.5 text-terracotta" />
            </span>
            {descriptor && <span className="font-medium text-strong">{descriptor}</span>}
            <span className="text-subtle">{tr.rating.reviewCount(count)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
