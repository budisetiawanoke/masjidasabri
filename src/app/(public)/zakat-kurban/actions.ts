"use server";

import { zakatRecordSchema, qurbanRecordSchema } from "@/server/zakat/schema";
import { registerZakatPublic, registerQurbanPublic } from "@/server/zakat/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

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

  try {
    await registerZakatPublic(parsed.data);
    return { ok: true, message: "Pendaftaran zakat berhasil dicatat. Jazakumullahu khairan." };
  } catch (e) {
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

  try {
    await registerQurbanPublic(parsed.data);
    return { ok: true, message: "Pendaftaran qurban berhasil dicatat. Silakan lakukan pembayaran sesuai instruksi panitia." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
