"use server";

import { donationRecordSchema } from "@/server/donations/schema";
import { registerDonationPublic } from "@/server/donations/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";
import { UploadError } from "@/lib/upload";

export async function submitDonationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = donationRecordSchema.safeParse({
    campaignId: formData.get("campaignId"),
    donorName: formData.get("donorName"),
    contactInfo: formData.get("contactInfo") || undefined,
    amount: formData.get("amount") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  }

  const proof = formData.get("proofImage");

  try {
    await registerDonationPublic(parsed.data, proof instanceof File ? proof : null);
    return {
      ok: true,
      message: "Jazakumullahu khairan. Donasi Anda telah kami catat dan akan diperiksa pengurus.",
    };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: e.message };
    return { ok: false, message: errorMessage(e) };
  }
}
