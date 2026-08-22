'use client';
// components/ui/AddToTripButton.tsx
// Plus/check toggle button backed by useTripSelection localStorage hook.

import { useTripSelection } from '@/hooks/useTripSelection';

interface AddToTripButtonProps {
  placeSlug: string;
  placeName: string;
  large?: boolean;
  className?: string;
}

export function AddToTripButton({ placeSlug, placeName, large, className }: AddToTripButtonProps) {
  const { isSelected, toggle, hydrated } = useTripSelection();
  const active = hydrated && isSelected(placeSlug);

  const baseClass = large
    ? 'flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors'
    : 'flex h-8 w-8 items-center justify-center rounded-sm backdrop-blur-sm transition-colors';

  const activeClass = large
    ? 'border-[#e8651a]/30 bg-[#e8651a]/10 text-[#e8651a] hover:bg-[#e8651a]/20'
    : 'bg-white/90 text-[#e8651a] hover:bg-white';

  const inactiveClass = large
    ? 'border-[#e8e4de] bg-white text-[#6b7280] hover:border-[#e8651a]/30 hover:text-[#e8651a]'
    : 'bg-white/70 text-[#9ca3af] hover:bg-white hover:text-[#e8651a]';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(placeSlug);
      }}
      aria-label={active ? `${placeName} geziden çıkar` : `${placeName} geziye ekle`}
      aria-pressed={active}
      className={`${baseClass} ${active ? activeClass : inactiveClass} ${className ?? ''}`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {active ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        )}
      </svg>
      {large && (active ? 'Geziden Çıkar' : 'Geziye Ekle')}
    </button>
  );
}
