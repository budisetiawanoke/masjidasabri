"use client";

import { useActionState, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { updateUserAction, resetPasswordAction } from "@/app/(dashboard)/dashboard/pengguna/actions";
import { initialActionState } from "@/lib/action-state";

type UserItem = { id: string; name: string; email: string; role: Role; isActive: boolean };

export function UserRow({ user, isSelf }: { user: UserItem; isSelf: boolean }) {
  const [state, formAction, pending] = useActionState(updateUserAction, initialActionState);
  const [pwState, pwAction, pwPending] = useActionState(resetPasswordAction, initialActionState);
  const [showPwForm, setShowPwForm] = useState(false);

  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={user.id} />
        <div className="min-w-40 flex-1">
          <input type="hidden" name="name" value={user.name} />
          <p className="font-medium text-brand-green-900">{user.name}</p>
          <p className="text-xs text-foreground/70">{user.email}</p>
        </div>
        <Select name="role" defaultValue={user.role} disabled={isSelf} className="w-40 text-xs">
          {Object.entries(ROLE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <label className="flex items-center gap-1.5 text-xs text-foreground/70">
          <input type="checkbox" name="isActive" defaultChecked={user.isActive} disabled={isSelf} className="h-4 w-4 rounded border-border-subtle" />
          Aktif
        </label>
        <Button type="submit" variant="outline" disabled={pending || isSelf} className="px-3 py-1.5 text-xs">
          {pending ? "..." : "Simpan"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowPwForm((v) => !v)}
          className="px-3 py-1.5 text-xs"
        >
          Reset Sandi
        </Button>
        {!user.isActive && <Badge tone="terracotta">Nonaktif</Badge>}
      </form>
      {state.message && (
        <p className={`mt-2 text-xs ${state.ok ? "text-brand-green-900" : "text-brand-terracotta-700"}`}>{state.message}</p>
      )}

      {showPwForm && (
        <form action={pwAction} className="mt-3 flex items-center gap-2 border-t border-border-subtle pt-3">
          <input type="hidden" name="id" value={user.id} />
          <Input name="password" type="password" placeholder="Kata sandi baru (min 8 karakter)" required className="text-xs" />
          <Button type="submit" disabled={pwPending} className="shrink-0 px-3 py-1.5 text-xs">
            {pwPending ? "..." : "Set"}
          </Button>
        </form>
      )}
      {pwState.message && (
        <p className={`mt-1 text-xs ${pwState.ok ? "text-brand-green-900" : "text-brand-terracotta-700"}`}>{pwState.message}</p>
      )}
    </div>
  );
}
