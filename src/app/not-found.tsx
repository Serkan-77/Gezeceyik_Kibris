// app/not-found.tsx — Custom 404 page.

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold text-[#e8651a]">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-[#1a1a1a]">
        Page not found
      </h1>
      <p className="mt-3 text-[#6b7280]">
        This page doesn&apos;t exist, or the place you were looking for has
        moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/places"
          className="rounded bg-[#e8651a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9540e]"
        >
          Browse all places
        </Link>
        <Link
          href="/"
          className="rounded border border-[#e8e4de] px-5 py-2.5 text-sm font-medium text-[#4b5563] transition-colors hover:border-[#e8651a] hover:text-[#e8651a]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
