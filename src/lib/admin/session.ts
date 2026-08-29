// lib/admin/session.ts
// Minimal single-password admin session. There is exactly one admin
// "account" — the shared ADMIN_PASSWORD env var — so there is no user
// database, no per-user identity, and no authorization layer beyond "is this
// request holding a valid session cookie." The cookie's value is an HMAC of
// a fixed string keyed by the password, not the password itself, so it
// never round-trips the secret to the browser, but it is still a shared
// secret suitable for a single-operator internal tool only.
//
// Used from both src/proxy.ts (Node.js runtime, see version history in
// node_modules/next/dist/docs/.../proxy.md — Proxy defaults to Node.js in
// Next 16, so `crypto` is available) and every admin Server Action, per the
// framework's own guidance: a proxy-level check controls page rendering, but
// each Server Function is a separate network-reachable entry point and must
// re-verify the session itself.

import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      'Missing required ADMIN_PASSWORD environment variable — set it in .env.local to enable the admin panel.'
    );
  }
  return password;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Checks a submitted password against ADMIN_PASSWORD. */
export function isCorrectPassword(candidate: string): boolean {
  return timingSafeStringEqual(candidate, getAdminPassword());
}

/** The cookie value a valid session must carry. Stateless — recomputed, never stored. */
export function computeSessionToken(): string {
  return createHmac('sha256', getAdminPassword()).update('kktc-admin-session').digest('hex');
}

/** Checks whether a cookie value is a valid admin session token. */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  return timingSafeStringEqual(token, computeSessionToken());
}
