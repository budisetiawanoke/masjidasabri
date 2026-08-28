"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActor } from "@/lib/require-actor";
import { updateFoundationProfile } from "@/server/foundation/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";
import { looseUrlOrPath } from "@/lib/zod-helpers";

const profileSchema = z.object({
  name: z.string().trim().min(3).max(200),
  shortName: z.string().trim().min(2).max(60),
  periodLabel: z.string().trim().min(4).max(30),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(100),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.string().trim().email().optional().nullable().or(z.literal("")),
  bankName: z.string().trim().max(100).optional().nullable(),
  bankAccountNo: z.string().trim().max(50).optional().nullable(),
  bankAccountName: z.string().trim().max(150).optional().nullable(),
  qrisImageUrl: looseUrlOrPath,
  aboutText: z.string().trim().max(3000),
});

export async function updateFoundationProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    periodLabel: formData.get("periodLabel"),
    address: formData.get("address"),
    city: formData.get("city"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    bankName: formData.get("bankName") || undefined,
    bankAccountNo: formData.get("bankAccountNo") || undefined,
    bankAccountName: formData.get("bankAccountName") || undefined,
    qrisImageUrl: formData.get("qrisImageUrl") || undefined,
    aboutText: formData.get("aboutText"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await updateFoundationProfile(actor, {
      ...parsed.data,
      email: parsed.data.email || null,
      qrisImageUrl: parsed.data.qrisImageUrl || null,
    });
    revalidatePath("/dashboard/pengaturan");
    revalidatePath("/");
    revalidatePath("/profil");
    return { ok: true, message: "Profil yayasan diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
