// components/ui/EmptyState.tsx
// Consistent empty-state pattern: icon, honest message, one clear action.

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-subtle">{icon}</div>
      <p className="mt-4 font-display text-block-title font-semibold text-strong">{title}</p>
      <p className="mt-2 max-w-sm text-body-sm text-subtle">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
