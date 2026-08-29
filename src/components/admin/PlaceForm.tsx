'use client';
// components/admin/PlaceForm.tsx
// Shared create/edit form for a place. The bound Server Action (either
// createPlaceAction or updatePlaceAction pre-bound to the original slug) is
// passed in as a prop from the Server Component page — see
// "Passing actions as props" in Next.js's mutating-data guide.

import { useActionState } from 'react';
import { PlaceInput, CATEGORIES, REGIONS, VERIFICATION_STATUSES } from '@/lib/db/placeDocument';
import { PlaceFormState } from '@/app/admin/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { tr } from '@/lib/i18n/tr';

type PlaceAction = (prevState: PlaceFormState, formData: FormData) => Promise<PlaceFormState>;

interface Props {
  // PlaceInput, not PlaceDocument: the page passes a plain object with the
  // Mongo-only fields (_id, createdAt, updatedAt) stripped out. A Client
  // Component prop must be a plain serializable value — an ObjectId (and
  // its toJSON) is not, and passing one straight through fails at runtime.
  place: PlaceInput | null;
  action: PlaceAction;
}

const textareaClass =
  'w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-strong transition-colors placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

const labelClass = 'mb-1.5 block text-sm font-medium text-strong';
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar',
};

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

const initialState: PlaceFormState = {};

export function PlaceForm({ place, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <p className="rounded-sm border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Temel Bilgiler</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (URL, benzersiz)" htmlFor="slug">
            <Input id="slug" name="slug" defaultValue={place?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          </Field>
          <Field label="İsim" htmlFor="name">
            <Input id="name" name="name" defaultValue={place?.name} required />
          </Field>
          <Field label="Kategori" htmlFor="category">
            <Select id="category" name="category" defaultValue={place?.category} required>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {tr.categories[c]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Bölge" htmlFor="region">
            <Select id="region" name="region" defaultValue={place?.region} required>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Şehir" htmlFor="city">
            <Input id="city" name="city" defaultValue={place?.city} required />
          </Field>
          <Field label="Adres" htmlFor="address">
            <Input id="address" name="address" defaultValue={place?.address} required />
          </Field>
        </div>
        <Field label="Kısa Açıklama (kartlarda görünür)" htmlFor="shortDescription">
          <textarea
            id="shortDescription"
            name="shortDescription"
            defaultValue={place?.shortDescription}
            required
            rows={2}
            className={textareaClass}
          />
        </Field>
        <Field label="Detaylı Açıklama" htmlFor="description">
          <textarea
            id="description"
            name="description"
            defaultValue={place?.description}
            required
            rows={4}
            className={textareaClass}
          />
        </Field>
        <Field label="Tarihçe (opsiyonel)" htmlFor="history">
          <textarea id="history" name="history" defaultValue={place?.history} rows={3} className={textareaClass} />
        </Field>
        <Field label="Kapak Görseli URL" htmlFor="imageCover">
          <Input id="imageCover" name="imageCover" defaultValue={place?.images.cover} required />
        </Field>
        <input type="hidden" name="galleryJson" defaultValue={JSON.stringify(place?.images.gallery ?? [])} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Konum</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Enlem (latitude)" htmlFor="latitude">
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              required
              defaultValue={place?.location.coordinates[1]}
            />
          </Field>
          <Field label="Boylam (longitude)" htmlFor="longitude">
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              required
              defaultValue={place?.location.coordinates[0]}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Açılış Saatleri</h2>
        <p className="text-meta text-subtle">
          Her gün için serbest metin girin (örn. &quot;08:00–17:00&quot;). Boş bırakmak &quot;kapalı / sabit saat
          yok&quot; anlamına gelir.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((day) => (
            <Field key={day} label={DAY_LABELS[day]} htmlFor={`hours_${day}`}>
              <Input id={`hours_${day}`} name={`hours_${day}`} defaultValue={place?.openingHours?.[day] ?? ''} placeholder="08:00–17:00" />
            </Field>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Giriş Ücreti</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="isFree"
            defaultChecked={place?.entranceFee?.isFree ?? false}
            className="h-4 w-4 rounded-sm border-line accent-brand"
          />
          Ücretsiz
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Yetişkin Ücreti" htmlFor="adultPrice">
            <Input id="adultPrice" name="adultPrice" type="number" step="any" defaultValue={place?.entranceFee?.adultPrice} />
          </Field>
          <Field label="Çocuk Ücreti" htmlFor="childPrice">
            <Input id="childPrice" name="childPrice" type="number" step="any" defaultValue={place?.entranceFee?.childPrice} />
          </Field>
          <Field label="Para Birimi" htmlFor="currency">
            <Select id="currency" name="currency" defaultValue={place?.entranceFee?.currency ?? 'TRY'}>
              <option value="TRY">TRY</option>
              <option value="EUR">EUR</option>
            </Select>
          </Field>
        </div>
        <Field label="Ücret Notu (opsiyonel)" htmlFor="admissionNotes">
          <textarea
            id="admissionNotes"
            name="admissionNotes"
            defaultValue={place?.entranceFee?.notes}
            rows={2}
            className={textareaClass}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">İletişim ve Ziyaret</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon (opsiyonel)" htmlFor="phone">
            <Input id="phone" name="phone" defaultValue={place?.contact?.phone} />
          </Field>
          <Field label="Web Sitesi (opsiyonel, tam URL)" htmlFor="website">
            <Input id="website" name="website" type="url" defaultValue={place?.contact?.website} />
          </Field>
          <Field label="Tahmini Ziyaret Süresi (dakika)" htmlFor="visitDuration">
            <Input id="visitDuration" name="visitDuration" type="number" defaultValue={place?.visitDuration} />
          </Field>
          <Field label="Kaynak URL (opsiyonel)" htmlFor="sourceUrl">
            <Input id="sourceUrl" name="sourceUrl" type="url" defaultValue={place?.sources?.[0]} />
          </Field>
          <Field label="Son Doğrulama Tarihi (opsiyonel)" htmlFor="lastVerifiedAt">
            <Input id="lastVerifiedAt" name="lastVerifiedAt" type="date" defaultValue={place?.lastVerifiedAt?.slice(0, 10)} />
          </Field>
          <Field label="Doğrulama Durumu" htmlFor="verificationStatus">
            <Select id="verificationStatus" name="verificationStatus" defaultValue={place?.verificationStatus ?? 'sample'}>
              {VERIFICATION_STATUSES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Yakındaki Yerler (slug, virgülle ayırın — opsiyonel)" htmlFor="nearbyPlaceSlugs">
          <Input
            id="nearbyPlaceSlugs"
            name="nearbyPlaceSlugs"
            defaultValue={place?.nearbyPlaceSlugs?.join(', ')}
            placeholder="girne-kalesi, bellapais-manastiri"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-card-title font-semibold text-strong">Erişilebilirlik</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="wheelchairAccessible"
              defaultChecked={place?.accessibility?.wheelchairAccessible ?? false}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Tekerlekli sandalyeye uygun
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="guidedTours"
              defaultChecked={place?.accessibility?.guidedTours ?? false}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Rehberli tur mevcut
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="audioGuide"
              defaultChecked={place?.accessibility?.audioGuide ?? false}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Sesli rehber mevcut
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-card-title font-semibold text-strong">Yayın Durumu</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="published"
              defaultChecked={place?.published ?? false}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Yayında (sitede görünür)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={place?.featured ?? false}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Öne çıkan
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : place ? 'Değişiklikleri Kaydet' : 'Yeri Ekle'}
        </Button>
      </div>
    </form>
  );
}
