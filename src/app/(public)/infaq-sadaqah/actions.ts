"use server";

import { revalidatePath } from "next/cache";
import { infaqRecordSchema } from "@/server/donations/schema";
import { registerInfaqPublic, INFAQ_CATEGORY_LABEL } from "@/server/donations/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";
import { UploadError } from "@/lib/upload";
import { formatRupiah } from "@/lib/format";

export async function submitInfaqAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = infaqRecordSchema.safeParse({
    category: formData.get("category"),
    donorName: formData.get("donorName"),
    contactInfo: formData.get("contactInfo") || undefined,
    amount: formData.get("amount") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  }

  const proof = formData.get("proofImage");

  try {
    const record = await registerInfaqPublic(parsed.data, proof instanceof File ? proof : null);
    // Supaya kartu "Laporan Infaq & Sadaqah per Peruntukan" di halaman yang
    // sama langsung menampilkan angka terbaru tanpa perlu jamaah me-refresh
    // manual (server action tidak otomatis menyegarkan data RSC lain di
    // halaman yang sama tanpa ini).
    revalidatePath("/infaq-sadaqah");
    return {
      ok: true,
      message: "Jazakumullahu khairan. Infaq/sadaqah Anda telah kami catat dan akan diperiksa pengurus.",
      receiptUrl: `/api/bukti-bayar/infaq/${record.id}`,
      receiptPreview: {
        kind: "INFAQ",
        donorName: record.donorName,
        detailLabel: "Peruntukan",
        detailValue: INFAQ_CATEGORY_LABEL[record.category] ?? record.category,
        amountLabel: record.amount ? formatRupiah(record.amount) : null,
      },
    };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: e.message };
    return { ok: false, message: errorMessage(e) };
  }
}
