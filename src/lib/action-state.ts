import type { ZodError } from "zod";
import type { GivingKind } from "@/lib/quran-verses";

/**
 * Data untuk pratinjau bukti bayar DI DALAM APLIKASI (lihat
 * src/components/public/ReceiptPreviewCard.tsx) — dikirim langsung dari
 * action, bukan diambil ulang lewat fetch, karena action sudah punya semua
 * datanya begitu record selesai dibuat. Isinya sengaja identik dengan yang
 * dipakai bukti bayar PDF (src/server/pdf/ReceiptDocument.tsx) supaya
 * pratinjau & berkas yang diunduh selalu cocok.
 */
export type ReceiptPreview = {
  kind: GivingKind;
  donorName: string;
  detailLabel: string;
  detailValue: string;
  amountLabel: string | null;
};

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Kode pelacakan tiket kotak saran — lihat submitSuggestionAction. */
  trackingCode?: string;
  /** Tautan unduh bukti bayar PDF — lihat src/app/api/bukti-bayar/[type]/[id]. */
  receiptUrl?: string;
  /** Data pratinjau bukti bayar — lihat komentar ReceiptPreview di atas. */
  receiptPreview?: ReceiptPreview;
};

export const initialActionState: ActionState = { ok: false };

export function zodErrorToFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan tak terduga.";
}
