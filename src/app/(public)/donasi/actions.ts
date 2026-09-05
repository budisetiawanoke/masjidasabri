"use server";

import { revalidatePath } from "next/cache";
import { donationRecordSchema } from "@/server/donations/schema";
import { registerDonationPublic } from "@/server/donations/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";
import { UploadError } from "@/lib/upload";
import { formatRupiah } from "@/lib/format";

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
    const record = await registerDonationPublic(parsed.data, proof instanceof File ? proof : null);
    revalidatePath("/donasi");
    return {
      ok: true,
      message: "Jazakumullahu khairan. Donasi Anda telah kami catat dan akan diperiksa pengurus.",
      receiptUrl: `/api/bukti-bayar/donasi/${record.id}`,
      receiptPreview: {
        kind: "DONASI",
        donorName: record.donorName,
        detailLabel: "Kampanye",
        detailValue: record.campaign.title,
        amountLabel: record.amount ? formatRupiah(record.amount) : null,
      },
    };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: e.message };
    return { ok: false, message: errorMessage(e) };
  }
}
