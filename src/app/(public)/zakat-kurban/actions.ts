"use server";

import { revalidatePath } from "next/cache";
import { zakatRecordSchema, qurbanRecordSchema } from "@/server/zakat/schema";
import {
  registerZakatPublic,
  registerQurbanPublic,
  ZAKAT_TYPE_LABEL,
  ANIMAL_TYPE_LABEL,
} from "@/server/zakat/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";
import { UploadError } from "@/lib/upload";
import { formatRupiah } from "@/lib/format";

export async function registerZakatAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = zakatRecordSchema.safeParse({
    type: formData.get("type"),
    payerName: formData.get("payerName"),
    payerContact: formData.get("payerContact") || undefined,
    familyCount: formData.get("familyCount") || 1,
    amountRice: formData.get("amountRice") || undefined,
    amountMoney: formData.get("amountMoney") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  }

  const proof = formData.get("proofImage");

  try {
    const record = await registerZakatPublic(parsed.data, proof instanceof File ? proof : null);
    revalidatePath("/zakat");
    const zakatAmountParts: string[] = [];
    if (record.amountMoney) zakatAmountParts.push(formatRupiah(record.amountMoney));
    if (record.amountRice) zakatAmountParts.push(`${record.amountRice} kg beras`);
    return {
      ok: true,
      message: "Pendaftaran zakat berhasil dicatat. Jazakumullahu khairan.",
      receiptUrl: `/api/bukti-bayar/zakat/${record.id}`,
      receiptPreview: {
        kind: "ZAKAT",
        donorName: record.payerName,
        detailLabel: "Jenis Zakat",
        detailValue: `${ZAKAT_TYPE_LABEL[record.type] ?? record.type} · ${record.familyCount} jiwa`,
        amountLabel: zakatAmountParts.length > 0 ? zakatAmountParts.join(" + ") : null,
      },
    };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: e.message };
    return { ok: false, message: errorMessage(e) };
  }
}

export async function registerQurbanAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = qurbanRecordSchema.safeParse({
    animalType: formData.get("animalType"),
    qurbanFor: formData.get("qurbanFor"),
    contactPhone: formData.get("contactPhone") || undefined,
    sharesCount: formData.get("sharesCount") || 1,
    amountPaid: formData.get("amountPaid"),
    year: formData.get("year") || new Date().getFullYear(),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  }

  const proof = formData.get("proofImage");

  try {
    const record = await registerQurbanPublic(parsed.data, proof instanceof File ? proof : null);
    revalidatePath("/kurban");
    return {
      ok: true,
      message: "Pendaftaran qurban berhasil dicatat. Silakan lakukan pembayaran sesuai instruksi panitia.",
      receiptUrl: `/api/bukti-bayar/kurban/${record.id}`,
      receiptPreview: {
        kind: "KURBAN",
        donorName: record.qurbanFor,
        detailLabel: "Jenis Kurban",
        detailValue: `${ANIMAL_TYPE_LABEL[record.animalType] ?? record.animalType} · ${record.sharesCount} bagian · Tahun ${record.year}`,
        amountLabel: formatRupiah(record.amountPaid),
      },
    };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: e.message };
    return { ok: false, message: errorMessage(e) };
  }
}
