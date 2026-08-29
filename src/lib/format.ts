// lib/format.ts
// Pure display-formatting helpers with no data-access dependency, safe to
// import from Client Components. Kept separate from lib/places.ts, which is
// now a server-only data-access seam (it imports the MongoDB repository).

/** Format distance in metres for Turkish display. */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
