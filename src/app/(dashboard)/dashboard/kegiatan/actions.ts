"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { eventSchema } from "@/server/events/schema";
import { createEvent, updateEvent, deleteEvent } from "@/server/events/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

function parseEventForm(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt") || undefined,
    location: formData.get("location") || undefined,
    speaker: formData.get("speaker") || undefined,
    posterUrl: formData.get("posterUrl") || undefined,
  });
}

export async function createEventAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseEventForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createEvent(actor, parsed.data);
    revalidatePath("/dashboard/kegiatan");
    revalidatePath("/kegiatan");
    revalidatePath("/");
    return { ok: true, message: "Kegiatan ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateEventAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") || "");
  const parsed = parseEventForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await updateEvent(actor, id, parsed.data);
    revalidatePath("/dashboard/kegiatan");
    revalidatePath("/kegiatan");
    revalidatePath("/");
    return { ok: true, message: "Kegiatan diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function deleteEventAction(id: string) {
  const actor = await requireActor();
  await deleteEvent(actor, id);
  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
}
