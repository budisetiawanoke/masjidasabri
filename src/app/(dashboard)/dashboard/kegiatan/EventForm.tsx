"use client";

import { useActionState, useEffect } from "react";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createEventAction, updateEventAction } from "@/app/(dashboard)/dashboard/kegiatan/actions";
import { initialActionState } from "@/lib/action-state";

type EventDefaults = {
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  startAt?: string;
  endAt?: string | null;
  location?: string | null;
  speaker?: string | null;
};

export function EventForm({ defaults, onSaved }: { defaults?: EventDefaults; onSaved?: () => void }) {
  const isEdit = Boolean(defaults?.id);
  const [state, formAction, pending] = useActionState(isEdit ? updateEventAction : createEventAction, initialActionState);

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
      <FieldGroup label="Judul" htmlFor="title" error={state.fieldErrors?.title}>
        <Input id="title" name="title" defaultValue={defaults?.title} required />
      </FieldGroup>
      <FieldGroup label="Kategori" htmlFor="category" error={state.fieldErrors?.category}>
        <Select id="category" name="category" defaultValue={defaults?.category ?? "KAJIAN"}>
          <option value="KAJIAN">Kajian</option>
          <option value="TPA">TPA</option>
          <option value="PHBI">PHBI</option>
          <option value="RAPAT">Rapat</option>
          <option value="LAINNYA">Lainnya</option>
        </Select>
      </FieldGroup>
      <FieldGroup label="Deskripsi" htmlFor="description" error={state.fieldErrors?.description}>
        <Textarea id="description" name="description" defaultValue={defaults?.description} required />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Mulai" htmlFor="startAt" error={state.fieldErrors?.startAt}>
          <Input id="startAt" name="startAt" type="datetime-local" defaultValue={defaults?.startAt} required />
        </FieldGroup>
        <FieldGroup label="Selesai (opsional)" htmlFor="endAt" error={state.fieldErrors?.endAt}>
          <Input id="endAt" name="endAt" type="datetime-local" defaultValue={defaults?.endAt ?? ""} />
        </FieldGroup>
      </div>
      <FieldGroup label="Lokasi" htmlFor="location" error={state.fieldErrors?.location}>
        <Input id="location" name="location" placeholder="Aula Masjid ASABRI" defaultValue={defaults?.location ?? ""} />
      </FieldGroup>
      <FieldGroup label="Pemateri / Khatib" htmlFor="speaker" error={state.fieldErrors?.speaker}>
        <Input id="speaker" name="speaker" defaultValue={defaults?.speaker ?? ""} />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kegiatan"}
      </Button>
    </form>
  );
}
