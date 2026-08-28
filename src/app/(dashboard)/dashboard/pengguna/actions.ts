"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { createUserSchema, updateUserSchema, resetPasswordSchema } from "@/server/users/schema";
import { createUser, updateUser, resetUserPassword } from "@/server/users/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

export async function createUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createUser(actor, parsed.data);
    revalidatePath("/dashboard/pengguna");
    return { ok: true, message: "Akun pengguna dibuat." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateUserSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await updateUser(actor, parsed.data);
    revalidatePath("/dashboard/pengguna");
    return { ok: true, message: "Data pengguna diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await resetUserPassword(actor, parsed.data.id, parsed.data.password);
    return { ok: true, message: "Kata sandi direset." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
