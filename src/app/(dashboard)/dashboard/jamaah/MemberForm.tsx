"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createMemberAction, updateMemberAction } from "@/app/(dashboard)/dashboard/jamaah/actions";
import { initialActionState } from "@/lib/action-state";

type MemberDefaults = {
  id?: string;
  fullName?: string;
  gender?: string | null;
  birthDate?: string | null;
  address?: string | null;
  domicile?: string | null;
  phone?: string | null;
  email?: string | null;
  isVolunteer?: boolean;
  notes?: string | null;
};

export function MemberForm({ defaults }: { defaults?: MemberDefaults }) {
  const isEdit = Boolean(defaults?.id);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateMemberAction : createMemberAction,
    initialActionState
  );

  return (
    <form action={formAction} className="space-y-4">
      {isEdit && <input type="hidden" name="id" value={defaults!.id} />}
      {state.message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok ? "bg-brand-green-100 text-brand-green-900" : "bg-brand-terracotta-100 text-brand-terracotta-700"
          }`}
        >
          {state.message}
        </p>
      )}
      <FieldGroup label="Nama Lengkap" htmlFor="fullName" error={state.fieldErrors?.fullName}>
        <Input id="fullName" name="fullName" defaultValue={defaults?.fullName} required />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Jenis Kelamin" htmlFor="gender" error={state.fieldErrors?.gender}>
          <Select id="gender" name="gender" defaultValue={defaults?.gender ?? ""}>
            <option value="">-</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Select>
        </FieldGroup>
        <FieldGroup label="Tanggal Lahir" htmlFor="birthDate" error={state.fieldErrors?.birthDate}>
          <Input id="birthDate" name="birthDate" type="date" defaultValue={defaults?.birthDate ?? ""} />
        </FieldGroup>
      </div>
      <FieldGroup label="Domisili" htmlFor="domicile" error={state.fieldErrors?.domicile}>
        <Input id="domicile" name="domicile" defaultValue={defaults?.domicile ?? ""} />
      </FieldGroup>
      <FieldGroup label="Alamat Lengkap" htmlFor="address" error={state.fieldErrors?.address}>
        <Textarea id="address" name="address" defaultValue={defaults?.address ?? ""} />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="No. HP" htmlFor="phone" error={state.fieldErrors?.phone}>
          <Input id="phone" name="phone" defaultValue={defaults?.phone ?? ""} />
        </FieldGroup>
        <FieldGroup label="Email" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" defaultValue={defaults?.email ?? ""} />
        </FieldGroup>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground/70">
        <input type="checkbox" name="isVolunteer" defaultChecked={defaults?.isVolunteer} className="h-4 w-4 rounded border-border-subtle" />
        Relawan / panitia aktif
      </label>
      <FieldGroup label="Catatan" htmlFor="notes" error={state.fieldErrors?.notes}>
        <Textarea id="notes" name="notes" defaultValue={defaults?.notes ?? ""} />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Jamaah"}
      </Button>
    </form>
  );
}
