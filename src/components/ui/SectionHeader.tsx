// components/ui/SectionHeader.tsx
// Canonical section/page heading. Replaces the old SectionHeading —
// same job, now driven by the type-scale tokens and usable on both
// light and dark (on-ink) surfaces so every section reads as one system.

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  /** 'page' for the h1 of a listing/category page, 'section' for in-page headings. */
  size?: 'section' | 'page';
  tone?: 'default' | 'on-ink';
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  as: Tag = 'h2',
  id,
  size = 'section',
  tone = 'default',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const titleSizeClass = size === 'page' ? 'text-page-title' : 'text-section-title';
  const titleColorClass = tone === 'on-ink' ? 'text-white' : 'text-strong';
  const subtitleColorClass = tone === 'on-ink' ? 'text-on-ink-muted' : 'text-muted';

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <p className="text-label font-semibold uppercase tracking-[0.16em] text-brand">
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={`font-display ${titleSizeClass} font-semibold text-balance ${titleColorClass}`}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={`max-w-2xl text-body leading-relaxed text-pretty ${subtitleColorClass}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
