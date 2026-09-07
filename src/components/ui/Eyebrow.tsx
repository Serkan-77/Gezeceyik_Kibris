// components/ui/Eyebrow.tsx
// Small mono label that precedes a section heading — the one recurring
// device tying visually distinct homepage sections into one system.
// `tone="ink"` for sections on the paper/surface ground (brand blue reads
// fine there); `tone="on-ink"` for full-bleed dark sections, where
// brand-bright is the only blue rated for small text on a dark ground.

interface EyebrowProps {
  children: string;
  tone?: 'ink' | 'on-ink';
  className?: string;
}

export function Eyebrow({ children, tone = 'ink', className = '' }: EyebrowProps) {
  const color = tone === 'on-ink' ? 'text-brand-bright' : 'text-brand';
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.14em] ${color} ${className}`}>{children}</p>
  );
}
