"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { suggestionResponseSchema } from "@/server/suggestions/schema";
import { respondToSuggestion } from "@/server/suggestions/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

export async function respondToSuggestionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = suggestionResponseSchema.safeParse({
    ticketId: formData.get("ticketId"),
    response: formData.get("response"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await respondToSuggestion(actor, parsed.data);
    revalidatePath("/dashboard/kotak-saran");
    return { ok: true, message: "Tanggapan tersimpan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
