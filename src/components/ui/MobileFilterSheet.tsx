'use client';
// components/ui/MobileFilterSheet.tsx
// Generic bottom-sheet shell for compact mobile filter panels — shared by
// PlaceFilters and the /harita discovery view so both use one sheet
// implementation instead of two hand-rolled overlays. Plain conditional
// rendering + CSS transitions, no animation library or extra dependency.

import { ReactNode, useEffect, useRef } from 'react';
import { CloseIcon } from './icons';

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function MobileFilterSheet({ open, onClose, title, children, footer }: MobileFilterSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Kapat"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col rounded-t-lg border-t border-line bg-surface shadow-[var(--shadow-ink)]">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-card-title font-semibold text-strong">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-muted hover:text-strong"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
