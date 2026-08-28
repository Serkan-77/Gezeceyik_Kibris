// components/places/PlaceListingHeader.tsx
// Shared header for /places and every category landing page — was five
// near-identical copies of the same eyebrow/h1/subtitle block.

import { SectionHeader } from '@/components/ui/SectionHeader';

interface PlaceListingHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function PlaceListingHeader({ eyebrow, title, subtitle }: PlaceListingHeaderProps) {
  return (
    <header className="mb-10 border-b border-line pb-8">
      <SectionHeader as="h1" size="page" eyebrow={eyebrow} title={title} subtitle={subtitle} />
    </header>
  );
}
