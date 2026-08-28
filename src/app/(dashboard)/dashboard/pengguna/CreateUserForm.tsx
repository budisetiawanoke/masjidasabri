"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ROLE_LABEL } from "@/lib/rbac";
import { createUserAction } from "@/app/(dashboard)/dashboard/pengguna/actions";
import { initialActionState } from "@/lib/action-state";

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok ? "bg-brand-green-100 text-brand-green-900" : "bg-brand-terracotta-100 text-brand-terracotta-700"
          }`}
        >
          {state.message}
        </p>
      )}
      <FieldGroup label="Nama" htmlFor="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" required />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" required />
      </FieldGroup>
      <FieldGroup label="Kata Sandi Awal" htmlFor="password" error={state.fieldErrors?.password} hint="Minimal 8 karakter">
        <Input id="password" name="password" type="password" required minLength={8} />
      </FieldGroup>
      <FieldGroup label="Peran" htmlFor="role" error={state.fieldErrors?.role}>
        <Select id="role" name="role" defaultValue="JAMAAH">
          {Object.entries(ROLE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : "Buat Akun"}
      </Button>
    </form>
  );
}
