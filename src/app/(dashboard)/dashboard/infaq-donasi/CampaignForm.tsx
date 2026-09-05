"use client";

import { useActionState, useEffect } from "react";
import { FieldGroup, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createCampaignAction, updateCampaignAction } from "@/app/(dashboard)/dashboard/infaq-donasi/actions";
import { initialActionState } from "@/lib/action-state";

type Defaults = {
  id?: string;
  title?: string;
  description?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankAccountName?: string | null;
};

/**
 * Form tambah/ubah kampanye donasi — dipakai dua tujuan (pola sama dengan
 * BoardMemberForm.tsx): tanpa `defaults.id` untuk kampanye baru, dengan
 * `defaults.id` untuk mengubah kampanye yang sudah ada. Rekening tujuan
 * bersifat opsional — kosong berarti jamaah memakai rekening yayasan umum
 * (lihat komentar di prisma/schema.prisma, model DonationCampaign).
 */
export function CampaignForm({ defaults, onSaved }: { defaults?: Defaults; onSaved?: () => void }) {
  const isEdit = Boolean(defaults?.id);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateCampaignAction : createCampaignAction,
    initialActionState
  );

  useEffect(() => {
    // Hanya auto-tutup saat MENGUBAH kampanye — saat menambah kampanye
    // baru, form dibiarkan terbuka supaya pesan konfirmasi tetap terlihat
    // (pola sama seperti BoardMemberForm.tsx).
    if (state.ok && isEdit) onSaved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={formAction} className="space-y-3">
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
      <FieldGroup label="Judul Kampanye" htmlFor="title" error={state.fieldErrors?.title}>
        <Input id="title" name="title" placeholder="mis. Bantuan Korban Bencana Alam" defaultValue={defaults?.title} required />
      </FieldGroup>
      <FieldGroup label="Deskripsi (opsional)" htmlFor="description" error={state.fieldErrors?.description}>
        <Textarea id="description" name="description" defaultValue={defaults?.description ?? ""} />
      </FieldGroup>

      <div className="rounded-xl border border-border-subtle bg-brand-cream-50/50 p-3 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/60">
          Rekening Tujuan Khusus (opsional)
        </p>
        <p className="text-xs text-foreground/60">
          Kosongkan kalau kampanye ini memakai rekening yayasan umum (lihat Pengaturan Yayasan). Isi hanya
          kalau kampanye ini butuh rekening berbeda, mis. rekening posko bencana.
        </p>
        <FieldGroup label="Nama Bank" htmlFor="bankName" error={state.fieldErrors?.bankName}>
          <Input id="bankName" name="bankName" placeholder="mis. Bank Syariah Indonesia" defaultValue={defaults?.bankName ?? ""} />
        </FieldGroup>
        <FieldGroup label="Nomor Rekening" htmlFor="bankAccountNo" error={state.fieldErrors?.bankAccountNo}>
          <Input id="bankAccountNo" name="bankAccountNo" defaultValue={defaults?.bankAccountNo ?? ""} />
        </FieldGroup>
        <FieldGroup label="Atas Nama" htmlFor="bankAccountName" error={state.fieldErrors?.bankAccountName}>
          <Input id="bankAccountName" name="bankAccountName" defaultValue={defaults?.bankAccountName ?? ""} />
        </FieldGroup>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kampanye"}
      </Button>
    </form>
  );
}
