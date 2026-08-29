// src/proxy.ts
// Next.js 16 Proxy (formerly `middleware.ts` — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// Gatekeeps every /admin/* route except the login page itself: no valid
// session cookie means an immediate redirect to /admin/login, before any
// admin page ever renders. Each admin Server Action still re-checks the
// session independently (see src/app/admin/actions.ts) — the framework's own
// guidance is that a Server Function is a separate, directly POST-able entry
// point that a path-based Proxy matcher does not protect on its own.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/admin/session';

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
