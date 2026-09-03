"use server";

import { suggestionSchema } from "@/server/suggestions/schema";
import { createSuggestion } from "@/server/suggestions/service";
import { auth } from "@/lib/auth";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

export async function submitSuggestionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = suggestionSchema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
    category: formData.get("category"),
    isAnonymous: formData.get("isAnonymous") === "on",
    contactInfo: formData.get("contactInfo") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };
  }

  try {
    const session = await auth();
    const actor = session?.user ? { id: session.user.id, role: session.user.role } : null;
    const ticket = await createSuggestion(actor, parsed.data);
    return {
      ok: true,
      message: "Terima kasih, masukan Anda telah kami terima dan akan ditindaklanjuti pengurus.",
      // Ditampilkan menonjol di form — inilah satu-satunya cara pengirim
      // (termasuk yang anonim / tanpa akun) mengecek status nanti.
      trackingCode: ticket.trackingCode ?? undefined,
    };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
