'use client';
// components/admin/CuratedRouteForm.tsx
// Shared create/edit form for a "hazır rota" (curated, editorial itinerary
// shown on the homepage / /rotalar — see lib/curatedRoutes.ts). Mirrors
// PlaceForm.tsx/TransitRouteForm.tsx: the bound Server Action is passed in
// as a prop from the Server Component page.
//
// Each day is entered as a comma-separated list of existing place slugs
// (same convention as PlaceForm's "Yakındaki Yerler" field) — the days
// array itself is client-side state only so admins can add/remove days
// before submitting; the actual list of place slugs per day is read
// straight from each day's input by the server action.

import { useActionState, useState } from 'react';
import { CuratedRouteInput, CURATED_ROUTE_TRANSPORT_MODES } from '@/lib/db/curatedRouteSchema';
import { REGIONS } from '@/lib/db/placeSchema';
import { CuratedRouteFormState } from '@/app/admin/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type CuratedRouteAction = (prevState: CuratedRouteFormState, formData: FormData) => Promise<CuratedRouteFormState>;

interface Props {
  // CuratedRouteInput, not the raw CuratedRouteRow — see the same note in PlaceForm.tsx.
  route: CuratedRouteInput | null;
  action: CuratedRouteAction;
}

const labelClass = 'mb-1.5 block text-sm font-medium text-strong';
const textareaClass =
  'w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-strong transition-colors placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

const TRANSPORT_LABELS: Record<(typeof CURATED_ROUTE_TRANSPORT_MODES)[number], string> = {
  car: 'Araç',
  walking: 'Yürüyüş',
  public: 'Toplu Taşıma',
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

const initialState: CuratedRouteFormState = {};

export function CuratedRouteForm({ route, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [days, setDays] = useState<string[]>(() => {
    const fromRoute = route?.days.map((slugs) => slugs.join(', '));
    return fromRoute && fromRoute.length > 0 ? fromRoute : [''];
  });

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <p className="rounded-sm border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Rota Bilgileri</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (URL, benzersiz)" htmlFor="slug">
            <Input id="slug" name="slug" defaultValue={route?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          </Field>
          <Field label="Başlık" htmlFor="title">
            <Input id="title" name="title" defaultValue={route?.title} required placeholder="Mağusa'da 3 Gün" />
          </Field>
        </div>
        <Field label="Özet (kartlarda görünür)" htmlFor="summary">
          <textarea id="summary" name="summary" defaultValue={route?.summary} required rows={2} className={textareaClass} />
        </Field>
        <Field label="Kapak Görseli URL (opsiyonel — boş bırakılırsa ilk durağın fotoğrafı kullanılır)" htmlFor="coverImage">
          <Input id="coverImage" name="coverImage" defaultValue={route?.coverImage} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Konaklama ve Ulaşım</h2>
        <p className="text-meta text-subtle">
          Her günün başlangıç/dönüş süresi ve gerektiğinde otobüs bilgisi buradan hesaplanır — tıpkı gezi
          planlayıcıdaki gibi.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Konaklama Adı" htmlFor="accLabel">
            <Input id="accLabel" name="accLabel" defaultValue={route?.accommodation.label} required placeholder="Gazimağusa Merkez" />
          </Field>
          <Field label="Şehir" htmlFor="accCity">
            <Input id="accCity" name="accCity" defaultValue={route?.accommodation.city} required />
          </Field>
          <Field label="Bölge" htmlFor="accRegion">
            <Select id="accRegion" name="accRegion" defaultValue={route?.accommodation.region} required>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ulaşım" htmlFor="transport">
            <Select id="transport" name="transport" defaultValue={route?.transport ?? 'car'} required>
              {CURATED_ROUTE_TRANSPORT_MODES.map((t) => (
                <option key={t} value={t}>
                  {TRANSPORT_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Enlem (latitude)" htmlFor="accLat">
            <Input id="accLat" name="accLat" type="number" step="any" required defaultValue={route?.accommodation.lat} />
          </Field>
          <Field label="Boylam (longitude)" htmlFor="accLng">
            <Input id="accLng" name="accLng" type="number" step="any" required defaultValue={route?.accommodation.lng} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Günler</h2>
        <p className="text-meta text-subtle">
          Her gün için, o gün ziyaret edilecek yerlerin slug&apos;larını sırasıyla virgülle ayırarak girin (örn.
          &quot;othello-kalesi, lala-mustafa-pasa-camii&quot;). Slug&apos;lar yayında olan gerçek yerlerle eşleşmeli.
        </p>
        <div className="space-y-3">
          {days.map((value, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <Field label={`${i + 1}. Gün`} htmlFor={`day_${i}`}>
                  <Input
                    id={`day_${i}`}
                    name={`day_${i}`}
                    value={value}
                    onChange={(e) => setDays((prev) => prev.map((d, idx) => (idx === i ? e.target.value : d)))}
                    placeholder="othello-kalesi, lala-mustafa-pasa-camii"
                  />
                </Field>
              </div>
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => setDays((prev) => prev.filter((_, idx) => idx !== i))}
                  className="mt-8 shrink-0 text-meta text-subtle hover:text-danger"
                >
                  Kaldır
                </button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setDays((prev) => [...prev, ''])}>
          + Gün Ekle
        </Button>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-card-title font-semibold text-strong">Yayın Durumu</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="published"
              defaultChecked={route?.published ?? false}
              className="h-4 w-4 rounded-sm border-line accent-brand"
            />
            Yayında (ana sayfada ve /rotalar&apos;da görünür)
          </label>
          <Field label="Sıralama (küçük sayı önce gösterilir)" htmlFor="displayOrder">
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={route?.displayOrder ?? 0} />
          </Field>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : route ? 'Değişiklikleri Kaydet' : 'Rotayı Ekle'}
        </Button>
      </div>
    </form>
  );
}
