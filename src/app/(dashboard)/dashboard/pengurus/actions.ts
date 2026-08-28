"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { boardMemberSchema } from "@/server/membership/schema";
import {
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
  setBoardMemberActive,
} from "@/server/membership/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

function parseBoardMemberForm(formData: FormData) {
  return boardMemberSchema.safeParse({
    name: formData.get("name"),
    position: formData.get("position"),
    periodLabel: formData.get("periodLabel"),
    photoUrl: formData.get("photoUrl") || undefined,
    order: formData.get("order") || 0,
  });
}

export async function createBoardMemberAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseBoardMemberForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createBoardMember(actor, parsed.data);
    revalidatePath("/dashboard/pengurus");
    revalidatePath("/profil");
    return { ok: true, message: "Pengurus ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateBoardMemberAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") || "");
  const parsed = parseBoardMemberForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await updateBoardMember(actor, id, parsed.data);
    revalidatePath("/dashboard/pengurus");
    revalidatePath("/profil");
    return { ok: true, message: "Data pengurus diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function deleteBoardMemberAction(id: string) {
  const actor = await requireActor();
  await deleteBoardMember(actor, id);
  revalidatePath("/dashboard/pengurus");
  revalidatePath("/profil");
}

export async function setBoardMemberActiveAction(id: string, isActive: boolean) {
  const actor = await requireActor();
  await setBoardMemberActive(actor, id, isActive);
  revalidatePath("/dashboard/pengurus");
  revalidatePath("/profil");
}
