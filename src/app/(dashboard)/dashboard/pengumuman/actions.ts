"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { announcementSchema } from "@/server/events/schema";
import { createAnnouncement, deleteAnnouncement } from "@/server/events/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

export async function createAnnouncementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    isPinned: formData.get("isPinned") === "on",
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createAnnouncement(actor, parsed.data);
    revalidatePath("/dashboard/pengumuman");
    revalidatePath("/kegiatan");
    revalidatePath("/");
    return { ok: true, message: "Pengumuman dipublikasikan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function deleteAnnouncementAction(id: string) {
  const actor = await requireActor();
  await deleteAnnouncement(actor, id);
  revalidatePath("/dashboard/pengumuman");
  revalidatePath("/kegiatan");
}
