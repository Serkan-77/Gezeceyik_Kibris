// lib/routes/reorder.ts
// Pure array-reordering helpers for the manual route builder. Kept
// framework-free and DB-free so they're trivially unit-testable and so the
// client can compute the optimistic new order before the server action
// confirms it (see components/route/RouteBuilderClient.tsx).

/** Moves the item at `index` one position earlier. No-op if already first. */
export function moveUp<T>(items: T[], index: number): T[] {
  if (index <= 0 || index >= items.length) return items;
  const next = [...items];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  return next;
}

/** Moves the item at `index` one position later. No-op if already last. */
export function moveDown<T>(items: T[], index: number): T[] {
  if (index < 0 || index >= items.length - 1) return items;
  const next = [...items];
  [next[index], next[index + 1]] = [next[index + 1], next[index]];
  return next;
}

/** Moves the item at `fromIndex` to `toIndex` (used by drag-and-drop). */
export function moveTo<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}
