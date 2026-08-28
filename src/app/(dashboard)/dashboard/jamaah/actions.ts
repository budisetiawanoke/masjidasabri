"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { memberSchema } from "@/server/membership/schema";
import { createMember, updateMember, deleteMember } from "@/server/membership/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

function parseMemberForm(formData: FormData) {
  return memberSchema.safeParse({
    fullName: formData.get("fullName"),
    gender: formData.get("gender") || undefined,
    birthDate: formData.get("birthDate") || undefined,
    address: formData.get("address") || undefined,
    domicile: formData.get("domicile") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    isVolunteer: formData.get("isVolunteer") === "on",
    notes: formData.get("notes") || undefined,
  });
}

export async function createMemberAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseMemberForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  try {
    const actor = await requireActor();
    await createMember(actor, parsed.data);
    revalidatePath("/dashboard/jamaah");
    return { ok: true, message: "Jamaah ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateMemberAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") || "");
  const parsed = parseMemberForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  try {
    const actor = await requireActor();
    await updateMember(actor, id, parsed.data);
    revalidatePath("/dashboard/jamaah");
    return { ok: true, message: "Data jamaah diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function deleteMemberAction(id: string) {
  const actor = await requireActor();
  await deleteMember(actor, id);
  revalidatePath("/dashboard/jamaah");
}
