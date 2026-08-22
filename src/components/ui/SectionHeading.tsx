// components/ui/SectionHeading.tsx
// Reusable section heading with optional subtitle and orange accent line.

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Alignment of the heading. Defaults to 'left'. */
  align?: 'left' | 'center';
  /** Show a small orange accent rule above the title. */
  accent?: boolean;
  /** HTML heading level to render. Defaults to h2. */
  as?: 'h1' | 'h2' | 'h3';
  /** Optional id for the heading element (for aria-labelledby). */
  id?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  accent = false,
  as: Tag = 'h2',
  id,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      {accent && (
        <span className="block h-0.5 w-10 rounded bg-[#e8651a]" aria-hidden="true" />
      )}
      <Tag id={id} className="font-display text-2xl font-semibold text-[#1a1a1a] sm:text-3xl">
        {title}
      </Tag>
      {subtitle && (
        <p className="max-w-2xl text-base text-[#6b7280]">{subtitle}</p>
      )}
    </div>
  );
}
