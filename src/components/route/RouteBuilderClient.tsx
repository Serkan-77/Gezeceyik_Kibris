'use client';
// components/route/RouteBuilderClient.tsx
// The manual route builder (Section 3 of the spec) — powers both /rotam
// (the visitor's current draft, backed by the global DraftRouteContext so
// "Rotaya ekle" everywhere else stays in sync) and /rotam/[id] (a saved
// route being reopened for editing, whose state is local to this page).
//
// Stop mutations (add/remove/reorder) persist immediately — there is no
// separate "unsaved changes" state to lose on navigation, only the route
// NAME has an explicit save step, and the draft→saved transition has its
// own explicit "Rotayı kaydet" action (Section 7/11).

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Route, RouteStop } from '@/types/route';
import { PlaceLite } from '@/types/place';
import { useDraftRoute } from '@/context/DraftRouteContext';
import { moveUp, moveDown, moveTo } from '@/lib/routes/reorder';
import { haversineKm, drivingMinutes } from '@/lib/trip-planner/distance';
import {
  addStopToRouteAction,
  removeStopAction,
  reorderRouteAction,
  renameRouteAction,
  saveDraftRouteAction,
  deleteRouteAction,
} from '@/app/rotam/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddStopSearch } from './AddStopSearch';
import { RouteBuilderMapWrapper } from './RouteBuilderMapWrapper';
import { tr } from '@/lib/i18n/tr';
import { ChevronUpIcon, ChevronDownIcon, TrashIcon, GripIcon, CompassIcon } from '@/components/ui/icons';

interface RouteBuilderClientProps {
  mode: 'draft' | 'saved';
  initialRoute?: Route | null;
  places: PlaceLite[];
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function RouteBuilderClient({ mode, initialRoute, places }: RouteBuilderClientProps) {
  const router = useRouter();
  const draftCtx = useDraftRoute();
  const [localRoute, setLocalRoute] = useState<Route | null>(initialRoute ?? null);
  const route = mode === 'draft' ? draftCtx.route : localRoute;
  const routeHydrated = mode === 'draft' ? draftCtx.hydrated : true;

  // Local, optimistically-mutable copies of server state — reset whenever
  // the underlying route object changes (a fresh mutation response, or a
  // different route entirely), via React's documented "adjust state during
  // render" pattern rather than an Effect (an Effect here would commit an
  // extra, avoidable render on every server round-trip).
  const [stops, setStops] = useState<RouteStop[]>(route?.stops ?? []);
  const [syncedStopsFrom, setSyncedStopsFrom] = useState(route?.stops);
  if (route?.stops !== syncedStopsFrom) {
    setSyncedStopsFrom(route?.stops);
    setStops(route?.stops ?? []);
  }

  const [name, setName] = useState(route?.name ?? '');
  const [syncedNameFrom, setSyncedNameFrom] = useState(`${route?.id ?? ''}:${route?.name ?? ''}`);
  const nameKey = `${route?.id ?? ''}:${route?.name ?? ''}`;
  if (nameKey !== syncedNameFrom) {
    setSyncedNameFrom(nameKey);
    setName(route?.name ?? '');
  }
  const [nameSaved, setNameSaved] = useState(true);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);
  const [pendingAddSlug, setPendingAddSlug] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);

  function applyUpdatedRoute(updated: Route | null) {
    if (mode === 'draft') draftCtx.setRoute(updated);
    else setLocalRoute(updated);
  }

  async function persistOrder(nextStops: RouteStop[]) {
    if (!route) return;
    setStops(nextStops); // optimistic
    const result = await reorderRouteAction(
      route.id,
      nextStops.map((s) => s.place.id)
    );
    if (result.error) {
      setStops(route.stops); // roll back
      return;
    }
    if (result.route) applyUpdatedRoute(result.route);
  }

  async function handleMoveUp(index: number) {
    await persistOrder(moveUp(stops, index));
  }

  async function handleMoveDown(index: number) {
    await persistOrder(moveDown(stops, index));
  }

  async function handleRemove(stop: RouteStop) {
    if (!route) return;
    setStops((prev) => prev.filter((s) => s.id !== stop.id)); // optimistic

    if (mode === 'draft') {
      draftCtx.remove(stop.place.slug); // context handles its own optimism/rollback
      return;
    }
    const result = await removeStopAction(route.id, stop.place.id);
    if (result.error) {
      setStops(route.stops); // roll back
      return;
    }
    if (result.route) applyUpdatedRoute(result.route);
  }

  async function handleAddPlace(place: PlaceLite) {
    if (!route) return;
    setPendingAddSlug(place.slug);
    try {
      if (mode === 'draft') {
        draftCtx.add(place);
      } else {
        const result = await addStopToRouteAction(route.id, place.id);
        if (result.route) applyUpdatedRoute(result.route);
      }
    } finally {
      setPendingAddSlug(null);
    }
  }

  async function handleSaveName() {
    if (!route) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Rota adı boş olamaz.');
      return;
    }
    setNameError(null);
    setSaving(true);
    try {
      if (route.status === 'draft') {
        const result = await saveDraftRouteAction(route.id, trimmed);
        if (result.error) {
          setNameError(result.error);
          return;
        }
        if (result.route) {
          draftCtx.setRoute(null); // this draft is now saved — a future "Rotaya ekle" starts a fresh one
          router.replace(`/rotam/${result.route.id}`);
        }
      } else {
        const result = await renameRouteAction(route.id, trimmed);
        if (result.error) {
          setNameError(result.error);
          return;
        }
        if (result.route) applyUpdatedRoute(result.route);
        setNameSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!route) return;
    setDeleting(true);
    const result = await deleteRouteAction(route.id);
    setDeleting(false);
    if (result.error) return;
    router.push('/gezilerim');
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }
  function handleDragOver(index: number, e: React.DragEvent) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    setStops((prev) => moveTo(prev, dragIndex.current!, index));
    dragIndex.current = index;
  }
  function handleDragEnd() {
    if (dragIndex.current !== null) void persistOrder(stops);
    dragIndex.current = null;
  }

  const inRouteSlugs = useMemo(() => new Set(stops.map((s) => s.place.slug)), [stops]);
  const segments = useMemo(
    () =>
      stops.slice(0, -1).map((stop, i) => {
        const next = stops[i + 1];
        const a = { lat: stop.place.latitude, lng: stop.place.longitude };
        const b = { lat: next.place.latitude, lng: next.place.longitude };
        return { km: haversineKm(a, b), min: drivingMinutes(a, b) };
      }),
    [stops]
  );

  if (!routeHydrated) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-md bg-surface-muted" />
        ))}
      </div>
    );
  }

  if (!route || stops.length === 0) {
    return (
      <EmptyState
        icon={<CompassIcon className="h-6 w-6" />}
        title={tr.route.emptyDraftTitle}
        description={tr.route.emptyDraftBody}
        action={<Button href="/places">{tr.route.browsePlaces}</Button>}
      />
    );
  }

  const isDraft = route.status === 'draft';
  const nameDirty = name.trim() !== (route.name ?? '');
  const totalKm = segments.reduce((sum, s) => sum + s.km, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
      <div className="min-w-0">
        {/* Masthead: stop count as an oversized numeral beside the name
            field, echoing Discovery's "count as architecture" header —
            a journey ledger, not a settings form. */}
        <div className="grid gap-5 border-b border-line pb-6 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-8">
          <p className="font-display text-hero leading-[0.8] text-brand tabular-nums">
            {String(stops.length).padStart(2, '0')}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <div className="flex-1">
              <label htmlFor="route-name" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-subtle">
                Rota Adı
              </label>
              <Input
                id="route-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameSaved(false);
                  setNameError(null);
                }}
                placeholder={tr.route.namePlaceholder}
                maxLength={120}
              />
            </div>
            <Button onClick={handleSaveName} disabled={saving || (!isDraft && !nameDirty)} className="shrink-0">
              {saving ? tr.route.saving : isDraft ? tr.route.save : nameSaved ? tr.route.renamed : tr.route.rename}
            </Button>
          </div>
        </div>
        {nameError && <p className="mt-2 text-body-sm text-danger">{nameError}</p>}
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.05em] text-subtle">
          {stops.length > 1 && <span>~{totalKm.toFixed(0)} km toplam</span>}
          {!isDraft && route.updatedAt && <span>{tr.route.updatedAt(formatUpdatedAt(route.updatedAt))}</span>}
        </p>

        {/* Stop list as a plotted route: a hairline runs down the marker
            column connecting every stop, segment distance/time sits
            inline ON that line between stops (a leg of the journey), and
            each marker is a large display numeral rather than a small
            mono badge — the sequence itself is the point. */}
        <ol className="relative mt-8">
          <div className="absolute left-7 top-7 bottom-7 w-px bg-line" aria-hidden="true" />
          {stops.map((stop, i) => (
            <li key={stop.id} className="relative">
              <div
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(i, e)}
                onDragEnd={handleDragEnd}
                className="group flex items-center gap-4 py-2.5"
              >
                <span
                  className="relative z-10 flex h-14 w-14 shrink-0 cursor-grab items-center justify-center rounded-2xl border-2 border-brand bg-paper font-display text-xl leading-none text-brand tabular-nums shadow-[var(--shadow-card)] active:cursor-grabbing"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <Link
                  href={`/places/${stop.place.slug}`}
                  className="flex min-w-0 flex-1 items-center gap-3.5"
                  onMouseEnter={() => setFocusedSlug(stop.place.slug)}
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:h-16 sm:w-20">
                    {stop.place.image && (
                      <Image src={stop.place.image} alt="" fill sizes="80px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-serif text-card-title font-semibold text-strong group-hover:text-brand">
                      {stop.place.name}
                    </span>
                    <span className="block truncate font-mono text-meta text-subtle">{stop.place.city}</span>
                  </span>
                </Link>
                <div className="flex shrink-0 items-center gap-0.5">
                  <span className="hidden text-faint sm:block" aria-hidden="true">
                    <GripIcon className="h-4 w-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(i)}
                    disabled={i === 0}
                    aria-label={`${stop.place.name} — ${tr.route.moveUp.toLowerCase()}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-strong disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(i)}
                    disabled={i === stops.length - 1}
                    aria-label={`${stop.place.name} — ${tr.route.moveDown.toLowerCase()}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-strong disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(stop)}
                    aria-label={`${stop.place.name} ${tr.route.remove.toLowerCase()}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {segments[i] && (
                <div className="relative z-10 ml-[3.5rem] flex items-center gap-3 py-1 pl-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-faint">
                    {tr.route.segmentDistance(segments[i].km)} · {tr.route.segmentTime(segments[i].min)}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
        {stops.length > 1 && <p className="mt-3 text-caption text-faint">{tr.route.abstractRouteNote}</p>}

        <div className="mt-8 border-t border-line pt-6">
          <h2 className="mb-3 font-display text-block-title text-strong">{tr.route.addMore}</h2>
          <AddStopSearch places={places} inRouteSlugs={inRouteSlugs} pendingSlug={pendingAddSlug} onAdd={handleAddPlace} />
        </div>

        {!isDraft && (
          <div className="mt-8 border-t border-line pt-6">
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-body-sm font-medium text-danger hover:underline"
              >
                {tr.route.delete}
              </button>
            ) : (
              <div className="border border-danger-soft bg-danger-soft/40 p-4">
                <p className="text-body-sm font-medium text-strong">{tr.route.deleteConfirmTitle}</p>
                <p className="mt-1 text-body-sm text-muted">{tr.route.deleteConfirmBody(route.name ?? tr.route.unnamedRoute)}</p>
                <div className="mt-3 flex gap-2.5">
                  <Button variant="secondary" size="sm" onClick={() => setConfirmingDelete(false)}>
                    {tr.route.cancel}
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                    {tr.route.confirmDelete}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-72 overflow-hidden rounded-xl sm:h-96 lg:sticky lg:top-20">
        <RouteBuilderMapWrapper stops={stops} focusedSlug={focusedSlug} onSelectStop={setFocusedSlug} />
      </div>
    </div>
  );
}
