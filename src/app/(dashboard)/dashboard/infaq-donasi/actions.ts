"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { donationCampaignSchema, donationCampaignUpdateSchema, closeCampaignSchema } from "@/server/donations/schema";
import {
  markInfaqConfirmed,
  markDonationConfirmed,
  createCampaign,
  updateCampaign,
  closeCampaign,
  reopenCampaign,
} from "@/server/donations/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

export async function markInfaqConfirmedAction(id: string) {
  const actor = await requireActor();
  await markInfaqConfirmed(actor, id);
  revalidatePath("/dashboard/infaq-donasi");
}

export async function markDonationConfirmedAction(id: string) {
  const actor = await requireActor();
  await markDonationConfirmed(actor, id);
  revalidatePath("/dashboard/infaq-donasi");
}

function revalidateCampaignPaths(id: string) {
  revalidatePath("/dashboard/infaq-donasi");
  revalidatePath("/donasi");
  // Halaman detail laporan dinamis (per periode) — revalidatePath tanpa
  // tipe "page" hanya menyegarkan path persis ini, tapi cukup karena
  // jamaah yang sedang membukanya akan me-refresh untuk lihat perubahan.
  revalidatePath(`/donasi/laporan/${id}`);
}

export async function createCampaignAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = donationCampaignSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    bankName: formData.get("bankName") || undefined,
    bankAccountNo: formData.get("bankAccountNo") || undefined,
    bankAccountName: formData.get("bankAccountName") || undefined,
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    const campaign = await createCampaign(actor, parsed.data);
    revalidateCampaignPaths(campaign.id);
    return { ok: true, message: "Kampanye donasi ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateCampaignAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = donationCampaignUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    bankName: formData.get("bankName") || undefined,
    bankAccountNo: formData.get("bankAccountNo") || undefined,
    bankAccountName: formData.get("bankAccountName") || undefined,
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await updateCampaign(actor, parsed.data);
    revalidateCampaignPaths(parsed.data.id);
    return { ok: true, message: "Kampanye donasi diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function closeCampaignAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = closeCampaignSchema.safeParse({
    id: formData.get("id"),
    closingNote: formData.get("closingNote"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await closeCampaign(actor, parsed.data.id, parsed.data.closingNote);
    revalidateCampaignPaths(parsed.data.id);
    return { ok: true, message: "Kampanye ditutup. Keterangan sudah ditampilkan untuk jamaah." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function reopenCampaignAction(id: string) {
  const actor = await requireActor();
  await reopenCampaign(actor, id);
  revalidateCampaignPaths(id);
}
