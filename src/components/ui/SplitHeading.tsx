'use client';
// components/ui/SplitHeading.tsx
// Word-by-word heading reveal for a section's first appearance. The real
// accessible name lives on the wrapping element (aria-label); the split
// word spans underneath are aria-hidden and exist only for the visual
// stagger. Visible immediately without JS (see [data-motion="words"] in
// globals.css) — this is decoration on top of real, already-readable text.

import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

type HeadingTag = 'h1' | 'h2' | 'h3';

interface SplitHeadingOwnProps {
  as?: HeadingTag;
  text: string;
  className?: string;
  /** Rendered after the split words, inside the accessible label but outside the stagger — e.g. a trailing non-split emphasis span. */
  suffix?: ReactNode;
  id?: string;
}

type SplitHeadingProps = SplitHeadingOwnProps & Omit<ComponentPropsWithoutRef<'h2'>, keyof SplitHeadingOwnProps>;

export function SplitHeading({ as: Tag = 'h2', text, className = '', suffix, ...rest }: SplitHeadingProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>();
  const words = text.split(' ');

  return (
    <Tag
      ref={ref}
      data-motion="words"
      data-enter={inView}
      aria-label={text}
      className={className}
      {...rest}
    >
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span className="word-mask" key={i}>
            <span className="word-inner" style={{ transitionDelay: `${i * 55}ms` }}>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
      {suffix}
    </Tag>
  );
}
