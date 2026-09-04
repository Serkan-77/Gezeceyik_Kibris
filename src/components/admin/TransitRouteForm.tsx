'use client';
// components/admin/TransitRouteForm.tsx
// Shared create/edit form for an inter-city bus route. Mirrors PlaceForm.tsx
// — the bound Server Action (createTransitRouteAction or
// updateTransitRouteAction pre-bound to the route id) is passed in as a
// prop from the Server Component page.

import { useActionState } from 'react';
import { TransitRouteInput } from '@/lib/db/transitRouteSchema';
import { REGIONS, VERIFICATION_STATUSES } from '@/lib/db/placeSchema';
import { TransitRouteFormState } from '@/app/admin/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type TransitRouteAction = (prevState: TransitRouteFormState, formData: FormData) => Promise<TransitRouteFormState>;

interface Props {
  // TransitRouteInput, not the raw TransitRouteRow: the page strips
  // any non-input fields (id, createdAt, updatedAt) before handing this to
  // a Client Component — see the same note in PlaceForm.tsx.
  route: TransitRouteInput | null;
  action: TransitRouteAction;
}

const labelClass = 'mb-1.5 block text-sm font-medium text-strong';
const textareaClass =
  'w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-strong transition-colors placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

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

const initialState: TransitRouteFormState = {};

export function TransitRouteForm({ route, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const schedule = route?.schedule;
  const defaultScheduleType = schedule?.type ?? 'unpublished';
  const defaultFixedTimes = schedule?.type === 'fixed' ? schedule.times.join(', ') : '';
  const defaultFirstDeparture = schedule?.type === 'frequency' ? schedule.firstDeparture : '';
  const defaultLastDeparture = schedule?.type === 'frequency' ? schedule.lastDeparture : '';
  const defaultIntervalMinutes = schedule?.type === 'frequency' ? schedule.intervalMinutes : undefined;

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <p className="rounded-sm border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Hat Bilgileri</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Operatör" htmlFor="operator">
            <Input id="operator" name="operator" defaultValue={route?.operator} required placeholder="İtimat" />
          </Field>
          <Field label="Yolculuk Süresi (dakika)" htmlFor="durationMinutes">
            <Input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              min={1}
              required
              defaultValue={route?.durationMinutes}
            />
          </Field>
          <Field label="Kalkış Bölgesi" htmlFor="fromRegion">
            <Select id="fromRegion" name="fromRegion" defaultValue={route?.fromRegion} required>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Varış Bölgesi" htmlFor="toRegion">
            <Select id="toRegion" name="toRegion" defaultValue={route?.toRegion} required>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Kalkış Durağı Adı" htmlFor="fromStopName">
            <Input id="fromStopName" name="fromStopName" defaultValue={route?.fromStop.name} required />
          </Field>
          <Field label="Kalkış Durağı Şehri" htmlFor="fromStopCity">
            <Input id="fromStopCity" name="fromStopCity" defaultValue={route?.fromStop.city} required />
          </Field>
          <Field label="Varış Durağı Adı" htmlFor="toStopName">
            <Input id="toStopName" name="toStopName" defaultValue={route?.toStop.name} required />
          </Field>
          <Field label="Varış Durağı Şehri" htmlFor="toStopCity">
            <Input id="toStopCity" name="toStopCity" defaultValue={route?.toStop.city} required />
          </Field>
          <Field label="Ücret (TRY, opsiyonel)" htmlFor="fareTRY">
            <Input id="fareTRY" name="fareTRY" type="number" step="any" min={0} defaultValue={route?.fareTRY} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Sefer Tarifesi</h2>
        <Field label="Tarife Tipi" htmlFor="scheduleType">
          <Select id="scheduleType" name="scheduleType" defaultValue={defaultScheduleType} required>
            <option value="fixed">Sabit saatler</option>
            <option value="frequency">İlk/son sefer + sıklık</option>
            <option value="unpublished">Sabit tarife yok (sadece süre/operatör bilgisi)</option>
          </Select>
        </Field>
        <p className="text-meta text-subtle">
          Yalnızca yukarıda seçtiğiniz tipe uygun alanlar kullanılır, diğerleri kaydedilirken yok sayılır.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sabit Saatler (virgülle ayırın, örn. 07:00, 08:00)" htmlFor="fixedTimes">
            <Input id="fixedTimes" name="fixedTimes" defaultValue={defaultFixedTimes} placeholder="07:00, 08:00, 09:00" />
          </Field>
          <Field label="Sıklık (dakika)" htmlFor="intervalMinutes">
            <Input id="intervalMinutes" name="intervalMinutes" type="number" min={1} defaultValue={defaultIntervalMinutes} />
          </Field>
          <Field label="İlk Sefer" htmlFor="firstDeparture">
            <Input id="firstDeparture" name="firstDeparture" type="time" defaultValue={defaultFirstDeparture} />
          </Field>
          <Field label="Son Sefer" htmlFor="lastDeparture">
            <Input id="lastDeparture" name="lastDeparture" type="time" defaultValue={defaultLastDeparture} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-card-title font-semibold text-strong">Kaynak ve Doğrulama</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon (virgülle ayırın, opsiyonel)" htmlFor="phone">
            <Input id="phone" name="phone" defaultValue={route?.phone?.join(', ')} placeholder="+90 392 000 00 00" />
          </Field>
          <Field label="Kaynak URL" htmlFor="sourceUrl">
            <Input id="sourceUrl" name="sourceUrl" type="url" defaultValue={route?.sourceUrl} required />
          </Field>
          <Field label="Son Doğrulama Tarihi" htmlFor="lastVerifiedAt">
            <Input
              id="lastVerifiedAt"
              name="lastVerifiedAt"
              type="date"
              required
              defaultValue={route?.lastVerifiedAt?.slice(0, 10)}
            />
          </Field>
          <Field label="Doğrulama Durumu" htmlFor="verificationStatus">
            <Select id="verificationStatus" name="verificationStatus" defaultValue={route?.verificationStatus ?? 'unverified'}>
              {VERIFICATION_STATUSES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Not (opsiyonel, tahminler, istisnalar, vb.)" htmlFor="notes">
          <textarea id="notes" name="notes" defaultValue={route?.notes} rows={3} className={textareaClass} />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-card-title font-semibold text-strong">Durum</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="active"
            defaultChecked={route?.active ?? true}
            className="h-4 w-4 rounded-sm border-line accent-brand"
          />
          Aktif (gezi planlayıcı bu hattı kullanabilir)
        </label>
      </section>

      <div className="flex justify-end gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : route ? 'Değişiklikleri Kaydet' : 'Hattı Ekle'}
        </Button>
      </div>
    </form>
  );
}
