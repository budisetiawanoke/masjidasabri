"use client";

import { useActionState } from "react";
import { FieldGroup, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/app/login/actions";
import { initialActionState } from "@/lib/action-state";
import { LogIn, AlertCircle } from "lucide-react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state.message && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-terracotta-100 p-3 text-sm font-semibold text-brand-terracotta-700 border border-brand-terracotta-500/30" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 text-brand-terracotta-700" />
          <span>{state.message}</span>
        </div>
      )}
      <FieldGroup label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required className="mt-1" />
      </FieldGroup>
      <FieldGroup label="Kata Sandi" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1" />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full mt-2 shadow-md">
        <LogIn className="h-4 w-4" />
        {pending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
