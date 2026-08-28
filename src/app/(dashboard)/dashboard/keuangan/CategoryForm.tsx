"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createCategoryAction } from "@/app/(dashboard)/dashboard/keuangan/actions";
import { initialActionState } from "@/lib/action-state";

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, initialActionState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {state.message && (
        <p className={`sm:hidden text-sm ${state.ok ? "text-brand-green-900" : "text-brand-terracotta-700"}`}>
          {state.message}
        </p>
      )}
      <div className="flex-1">
        <FieldGroup label="Nama Kategori Baru" htmlFor="cat-name" error={state.fieldErrors?.name}>
          <Input id="cat-name" name="name" required />
        </FieldGroup>
      </div>
      <div className="w-40">
        <FieldGroup label="Jenis" htmlFor="cat-kind" error={state.fieldErrors?.kind}>
          <Select id="cat-kind" name="kind">
            <option value="MASUK">Pemasukan</option>
            <option value="KELUAR">Pengeluaran</option>
          </Select>
        </FieldGroup>
      </div>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "..." : "Tambah"}
      </Button>
    </form>
  );
}
