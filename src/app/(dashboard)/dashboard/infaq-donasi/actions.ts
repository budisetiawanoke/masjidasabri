"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { donationCampaignSchema } from "@/server/donations/schema";
import {
  markInfaqConfirmed,
  markDonationConfirmed,
  createCampaign,
  setCampaignActive,
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

export async function toggleCampaignAction(id: string, isActive: boolean) {
  const actor = await requireActor();
  await setCampaignActive(actor, id, isActive);
  revalidatePath("/dashboard/infaq-donasi");
  revalidatePath("/donasi");
}

export async function createCampaignAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = donationCampaignSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createCampaign(actor, parsed.data);
    revalidatePath("/dashboard/infaq-donasi");
    revalidatePath("/donasi");
    return { ok: true, message: "Kampanye donasi ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
