"use client";

import { useActionState } from "react";
import { FieldGroup, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/app/login/actions";
import { initialActionState } from "@/lib/action-state";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state.message && (
        <p className="rounded-lg bg-brand-terracotta-100 px-3 py-2 text-sm text-brand-terracotta-700" role="alert">
          {state.message}
        </p>
      )}
      <FieldGroup label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FieldGroup>
      <FieldGroup label="Kata Sandi" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
