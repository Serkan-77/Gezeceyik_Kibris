'use server';
// app/admin/actions.ts
// Server Actions behind the admin panel. Every action re-verifies the admin
// session itself — a Proxy-level check (src/proxy.ts) controls which pages
// render, but a Server Function is a separate, directly POST-able entry
// point and must not rely on that alone (see Next.js's Data Security guide,
// node_modules/next/dist/docs/01-app/02-guides/data-security.md).

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import {
  ADMIN_SESSION_COOKIE,
  computeSessionToken,
  isCorrectPassword,
  isValidSessionToken,
} from '@/lib/admin/session';
import * as placeRepository from '@/lib/repositories/placeRepository';
import * as transitRouteRepository from '@/lib/repositories/transitRouteRepository';
import { PlaceInput } from '@/lib/db/placeSchema';
import { TransitRouteInput } from '@/lib/db/transitRouteSchema';
import { Category, Region, VerificationStatus } from '@/types/place';

async function requireAdminSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    throw new Error('Unauthorized — no valid admin session.');
  }
}

// ─── Auth ───────────────────────────────────────────────────────

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get('password') ?? '');
  if (!password || !isCorrectPassword(password)) {
    return { error: 'Şifre yanlış.' };
  }

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, computeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}

// ─── Place mutations ────────────────────────────────────────────

export interface PlaceFormState {
  error?: string;
}

function optionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalNumber(formData: FormData, key: string): number | undefined {
  const value = optionalString(formData, key);
  if (value === undefined) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function dayHours(formData: FormData, day: string): string | null {
  return optionalString(formData, `hours_${day}`) ?? null;
}

function parseGallery(formData: FormData): string[] {
  const raw = optionalString(formData, 'gallery');
  if (!raw) return [];
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Builds a PlaceInput from the admin form's FormData. Validation happens in the repository (Zod). */
function parsePlaceForm(formData: FormData): PlaceInput {
  const nearbyPlaceSlugs = (optionalString(formData, 'nearbyPlaceSlugs') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const sourceUrl = optionalString(formData, 'sourceUrl');
  const isFree = formData.get('isFree') === 'on';

  return {
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    shortDescription: String(formData.get('shortDescription') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    history: optionalString(formData, 'history'),
    category: String(formData.get('category') ?? '') as Category,
    region: String(formData.get('region') ?? '') as Region,
    city: String(formData.get('city') ?? '').trim(),
    address: String(formData.get('address') ?? '').trim(),
    latitude: optionalNumber(formData, 'latitude') ?? 0,
    longitude: optionalNumber(formData, 'longitude') ?? 0,
    image: String(formData.get('imageCover') ?? '').trim(),
    gallery: parseGallery(formData),
    openingHours: {
      monday: dayHours(formData, 'monday'),
      tuesday: dayHours(formData, 'tuesday'),
      wednesday: dayHours(formData, 'wednesday'),
      thursday: dayHours(formData, 'thursday'),
      friday: dayHours(formData, 'friday'),
      saturday: dayHours(formData, 'saturday'),
      sunday: dayHours(formData, 'sunday'),
    },
    admission: {
      isFree,
      adultPrice: isFree ? undefined : optionalNumber(formData, 'adultPrice'),
      childPrice: isFree ? undefined : optionalNumber(formData, 'childPrice'),
      currency: isFree ? undefined : (optionalString(formData, 'currency') as 'TRY' | 'EUR' | undefined),
      notes: optionalString(formData, 'admissionNotes'),
    },
    phone: optionalString(formData, 'phone'),
    website: optionalString(formData, 'website'),
    estimatedVisitMinutes: optionalNumber(formData, 'visitDuration'),
    accessibility: {
      wheelchairAccessible: formData.get('wheelchairAccessible') === 'on',
      guidedTours: formData.get('guidedTours') === 'on',
      audioGuide: formData.get('audioGuide') === 'on',
      notes: optionalString(formData, 'accessibilityNotes'),
    },
    nearbyPlaceSlugs,
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    archived: false,
    verificationStatus: String(formData.get('verificationStatus') ?? 'sample') as VerificationStatus,
    sourceUrl,
    lastVerifiedAt: optionalString(formData, 'lastVerifiedAt'),
  };
}

function zodErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' · ');
  }
  return err instanceof Error ? err.message : String(err);
}

export async function createPlaceAction(_prevState: PlaceFormState, formData: FormData): Promise<PlaceFormState> {
  await requireAdminSession();

  const input = parsePlaceForm(formData);
  try {
    await placeRepository.createPlace(input);
  } catch (err) {
    return { error: zodErrorMessage(err) };
  }

  revalidatePath('/admin');
  revalidatePath('/places');
  redirect('/admin');
}

export async function updatePlaceAction(
  originalSlug: string,
  _prevState: PlaceFormState,
  formData: FormData
): Promise<PlaceFormState> {
  await requireAdminSession();

  const input = parsePlaceForm(formData);
  try {
    const updated = await placeRepository.updatePlace(originalSlug, input);
    if (!updated) {
      return { error: `"${originalSlug}" slug'ına sahip bir yer bulunamadı.` };
    }
  } catch (err) {
    return { error: zodErrorMessage(err) };
  }

  revalidatePath('/admin');
  revalidatePath('/places');
  revalidatePath(`/places/${originalSlug}`);
  if (input.slug !== originalSlug) revalidatePath(`/places/${input.slug}`);
  redirect('/admin');
}

export async function archivePlaceAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const slug = String(formData.get('slug') ?? '');
  if (!slug) return;
  await placeRepository.archivePlace(slug);
  revalidatePath('/admin');
  revalidatePath('/places');
}

export async function togglePublishAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const slug = String(formData.get('slug') ?? '');
  const nextPublished = formData.get('nextPublished') === 'true';
  if (!slug) return;
  if (nextPublished) {
    await placeRepository.publishPlace(slug);
  } else {
    await placeRepository.unpublishPlace(slug);
  }
  revalidatePath('/admin');
  revalidatePath('/places');
}

// ─── Transit route mutations ────────────────────────────────────

export interface TransitRouteFormState {
  error?: string;
}

/** Builds a TransitRouteInput from the admin form's FormData. Validation happens in the repository (Zod). */
function parseTransitRouteForm(formData: FormData): TransitRouteInput {
  const scheduleType = String(formData.get('scheduleType') ?? 'unpublished');
  let schedule: TransitRouteInput['schedule'];

  if (scheduleType === 'fixed') {
    const times = String(formData.get('fixedTimes') ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    schedule = { type: 'fixed', times };
  } else if (scheduleType === 'frequency') {
    schedule = {
      type: 'frequency',
      firstDeparture: String(formData.get('firstDeparture') ?? '').trim(),
      lastDeparture: String(formData.get('lastDeparture') ?? '').trim(),
      intervalMinutes: Number(formData.get('intervalMinutes') ?? 0),
    };
  } else {
    schedule = { type: 'unpublished' };
  }

  const phone = String(formData.get('phone') ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    operator: String(formData.get('operator') ?? '').trim(),
    fromRegion: String(formData.get('fromRegion') ?? '') as Region,
    toRegion: String(formData.get('toRegion') ?? '') as Region,
    fromStop: {
      name: String(formData.get('fromStopName') ?? '').trim(),
      city: String(formData.get('fromStopCity') ?? '').trim(),
    },
    toStop: {
      name: String(formData.get('toStopName') ?? '').trim(),
      city: String(formData.get('toStopCity') ?? '').trim(),
    },
    durationMinutes: Number(formData.get('durationMinutes') ?? 0),
    fareTRY: optionalNumber(formData, 'fareTRY'),
    schedule,
    phone,
    notes: optionalString(formData, 'notes'),
    sourceUrl: String(formData.get('sourceUrl') ?? '').trim(),
    lastVerifiedAt: String(formData.get('lastVerifiedAt') ?? '').trim(),
    verificationStatus: String(formData.get('verificationStatus') ?? 'unverified') as VerificationStatus,
    active: formData.get('active') === 'on',
  };
}

export async function createTransitRouteAction(
  _prevState: TransitRouteFormState,
  formData: FormData
): Promise<TransitRouteFormState> {
  await requireAdminSession();

  const input = parseTransitRouteForm(formData);
  try {
    await transitRouteRepository.createRoute(input);
  } catch (err) {
    return { error: zodErrorMessage(err) };
  }

  revalidatePath('/admin/transit');
  revalidatePath('/gezi-planla');
  redirect('/admin/transit');
}

export async function updateTransitRouteAction(
  id: string,
  _prevState: TransitRouteFormState,
  formData: FormData
): Promise<TransitRouteFormState> {
  await requireAdminSession();

  const input = parseTransitRouteForm(formData);
  try {
    const updated = await transitRouteRepository.updateRoute(id, input);
    if (!updated) {
      return { error: 'Bu id ile bir otobüs hattı bulunamadı.' };
    }
  } catch (err) {
    return { error: zodErrorMessage(err) };
  }

  revalidatePath('/admin/transit');
  revalidatePath('/gezi-planla');
  redirect('/admin/transit');
}

export async function deleteTransitRouteAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await transitRouteRepository.deleteRoute(id);
  revalidatePath('/admin/transit');
  revalidatePath('/gezi-planla');
}

export async function toggleTransitRouteActiveAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '');
  const nextActive = formData.get('nextActive') === 'true';
  if (!id) return;
  await transitRouteRepository.setActive(id, nextActive);
  revalidatePath('/admin/transit');
  revalidatePath('/gezi-planla');
}
