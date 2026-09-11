'use client';
// components/layout/ThemeToggle.tsx
// Explicit light/dark override on top of the system-preference default
// (see the dark-mode block in globals.css and the FOUC-prevention script
// in layout.tsx, which both key off documentElement's data-theme
// attribute). useSyncExternalStore — not useState+useEffect — because the
// current theme genuinely differs between the server render (no DOM, no
// matchMedia) and the client: it's the hook React built specifically for
// that case, with a getServerSnapshot so hydration doesn't warn/mismatch
// and no manual setState-in-effect is needed to correct it afterward.

import { useSyncExternalStore } from 'react';
import { SunIcon, MoonIcon } from '@/components/ui/icons';

type Theme = 'light' | 'dark';

const THEME_EVENT = 'gk-theme-change';

function subscribe(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    media.removeEventListener('change', callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Server has no DOM/matchMedia to read — 'light' matches globals.css's
// default :root color-scheme, so the very first paint (before the
// blocking script in layout.tsx can run) is never wrong for a
// light-system visitor, the common case.
function getServerSnapshot(): Theme {
  return 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('gk-theme', next);
    } catch {
      // Private browsing / blocked storage — theme still applies for
      // this page view via the DOM attribute, just doesn't persist.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
      className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:bg-surface-muted hover:text-strong"
    >
      {theme === 'dark' ? <SunIcon className="h-[18px] w-[18px]" /> : <MoonIcon className="h-[18px] w-[18px]" />}
    </button>
  );
}
