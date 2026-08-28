"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createInventoryItemAction } from "@/app/(dashboard)/dashboard/inventaris/actions";
import { initialActionState } from "@/lib/action-state";

export function InventoryForm() {
  const [state, formAction, pending] = useActionState(createInventoryItemAction, initialActionState);

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
      <FieldGroup label="Nama Aset" htmlFor="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" required />
      </FieldGroup>
      <FieldGroup label="Kategori" htmlFor="category" error={state.fieldErrors?.category}>
        <Input id="category" name="category" placeholder="Elektronik, Karpet, Sound System, ..." required />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Kondisi" htmlFor="condition" error={state.fieldErrors?.condition}>
          <Select id="condition" name="condition" defaultValue="BAIK">
            <option value="BAIK">Baik</option>
            <option value="PERLU_PERBAIKAN">Perlu Perbaikan</option>
            <option value="RUSAK">Rusak</option>
          </Select>
        </FieldGroup>
        <FieldGroup label="Jumlah" htmlFor="quantity" error={state.fieldErrors?.quantity}>
          <Input id="quantity" name="quantity" type="number" min={0} defaultValue={1} required />
        </FieldGroup>
      </div>
      <FieldGroup label="Lokasi" htmlFor="location" error={state.fieldErrors?.location}>
        <Input id="location" name="location" />
      </FieldGroup>
      <FieldGroup label="Catatan" htmlFor="notes" error={state.fieldErrors?.notes}>
        <Textarea id="notes" name="notes" />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : "Tambah Aset"}
      </Button>
    </form>
  );
}
