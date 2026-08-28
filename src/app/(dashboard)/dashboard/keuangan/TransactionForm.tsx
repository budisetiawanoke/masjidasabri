"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createTransactionAction } from "@/app/(dashboard)/dashboard/keuangan/actions";
import { initialActionState } from "@/lib/action-state";

type Category = { id: string; name: string; kind: string };

export function TransactionForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createTransactionAction, initialActionState);
  const today = new Date().toISOString().slice(0, 10);

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
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Tanggal" htmlFor="date" error={state.fieldErrors?.date}>
          <Input id="date" name="date" type="date" defaultValue={today} required />
        </FieldGroup>
        <FieldGroup label="Nominal (Rp)" htmlFor="amount" error={state.fieldErrors?.amount}>
          <Input id="amount" name="amount" type="number" min={1} required />
        </FieldGroup>
      </div>
      <FieldGroup label="Kategori" htmlFor="categoryId" error={state.fieldErrors?.categoryId}>
        <Select id="categoryId" name="categoryId" required>
          <option value="">Pilih kategori</option>
          <optgroup label="Pemasukan">
            {categories.filter((c) => c.kind === "MASUK").map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Pengeluaran">
            {categories.filter((c) => c.kind === "KELUAR").map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        </Select>
      </FieldGroup>
      <FieldGroup label="Keterangan" htmlFor="description" error={state.fieldErrors?.description}>
        <Textarea id="description" name="description" required />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : "Catat Transaksi"}
      </Button>
    </form>
  );
}
