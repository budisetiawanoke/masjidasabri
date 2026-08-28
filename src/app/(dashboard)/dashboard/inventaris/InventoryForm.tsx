"use client";

import { useActionState, useEffect } from "react";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createInventoryItemAction, updateInventoryItemAction } from "@/app/(dashboard)/dashboard/inventaris/actions";
import { initialActionState } from "@/lib/action-state";

type ItemDefaults = {
  id?: string;
  name?: string;
  category?: string;
  condition?: string;
  quantity?: number;
  location?: string | null;
  notes?: string | null;
};

export function InventoryForm({ defaults, onSaved }: { defaults?: ItemDefaults; onSaved?: () => void }) {
  const isEdit = Boolean(defaults?.id);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateInventoryItemAction : createInventoryItemAction,
    initialActionState
  );

  useEffect(() => {
    if (state.ok && isEdit) onSaved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

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
      <FieldGroup label="Nama Aset" htmlFor="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" defaultValue={defaults?.name} required />
      </FieldGroup>
      <FieldGroup label="Kategori" htmlFor="category" error={state.fieldErrors?.category}>
        <Input
          id="category"
          name="category"
          placeholder="Elektronik, Karpet, Sound System, ..."
          defaultValue={defaults?.category}
          required
        />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Kondisi" htmlFor="condition" error={state.fieldErrors?.condition}>
          <Select id="condition" name="condition" defaultValue={defaults?.condition ?? "BAIK"}>
            <option value="BAIK">Baik</option>
            <option value="PERLU_PERBAIKAN">Perlu Perbaikan</option>
            <option value="RUSAK">Rusak</option>
          </Select>
        </FieldGroup>
        <FieldGroup label="Jumlah" htmlFor="quantity" error={state.fieldErrors?.quantity}>
          <Input id="quantity" name="quantity" type="number" min={0} defaultValue={defaults?.quantity ?? 1} required />
        </FieldGroup>
      </div>
      <FieldGroup label="Lokasi" htmlFor="location" error={state.fieldErrors?.location}>
        <Input id="location" name="location" defaultValue={defaults?.location ?? ""} />
      </FieldGroup>
      <FieldGroup label="Catatan" htmlFor="notes" error={state.fieldErrors?.notes}>
        <Textarea id="notes" name="notes" defaultValue={defaults?.notes ?? ""} />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Aset"}
      </Button>
    </form>
  );
}
