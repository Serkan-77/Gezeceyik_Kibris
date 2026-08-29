'use client';
// components/admin/LoginForm.tsx
// Single-password admin login. useActionState gives inline error display
// without a redirect round-trip; on success the action itself redirects.

import { useActionState } from 'react';
import { loginAction, LoginState } from '@/app/admin/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-strong">
          Admin Şifresi
        </label>
        <Input id="password" name="password" type="password" required autoFocus />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Kontrol ediliyor…' : 'Giriş Yap'}
      </Button>
    </form>
  );
}
