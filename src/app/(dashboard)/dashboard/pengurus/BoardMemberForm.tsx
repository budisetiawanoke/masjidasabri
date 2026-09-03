"use client";

import { useActionState, useEffect, useState } from "react";
import { FieldGroup, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { createBoardMemberAction, updateBoardMemberAction } from "@/app/(dashboard)/dashboard/pengurus/actions";
import { initialActionState } from "@/lib/action-state";

type Defaults = {
  id?: string;
  name?: string;
  position?: string;
  periodLabel?: string;
  photoUrl?: string | null;
  order?: number;
};

export function BoardMemberForm({ defaults, onSaved }: { defaults?: Defaults; onSaved?: () => void }) {
  const isEdit = Boolean(defaults?.id);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateBoardMemberAction : createBoardMemberAction,
    initialActionState
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
      <FieldGroup label="Nama" htmlFor="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" defaultValue={defaults?.name} required />
      </FieldGroup>
      <FieldGroup label="Jabatan" htmlFor="position" error={state.fieldErrors?.position}>
        <Input id="position" name="position" placeholder="Ketua Yayasan, Bendahara, ..." defaultValue={defaults?.position} required />
      </FieldGroup>
      <FieldGroup label="Periode" htmlFor="periodLabel" error={state.fieldErrors?.periodLabel}>
        <Input id="periodLabel" name="periodLabel" defaultValue={defaults?.periodLabel ?? "2026 – 2030"} required />
      </FieldGroup>
      <FieldGroup label="Urutan Tampil" htmlFor="order" error={state.fieldErrors?.order} hint="Angka lebih kecil tampil lebih dulu">
        <Input id="order" name="order" type="number" min={0} defaultValue={defaults?.order ?? 0} />
      </FieldGroup>
      <FileUpload
        name="photoUrl"
        label="Foto (opsional)"
        category="board"
        defaultValue={defaults?.photoUrl}
        onUploadStateChange={setUploadingPhoto}
      />
      <Button type="submit" disabled={pending || uploadingPhoto} className="w-full">
        {uploadingPhoto ? "Menunggu foto selesai diunggah..." : pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Pengurus"}
      </Button>
    </form>
  );
}
