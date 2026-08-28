"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { markZakatDistributed, updateQurbanStatus } from "@/server/zakat/service";
import { errorMessage } from "@/lib/action-state";

export async function markZakatDistributedAction(id: string, distributedTo: string) {
  const actor = await requireActor();
  await markZakatDistributed(actor, id, distributedTo);
  revalidatePath("/dashboard/zakat-kurban");
}

export async function updateQurbanStatusAction(id: string, status: string) {
  try {
    const actor = await requireActor();
    await updateQurbanStatus(actor, id, status);
    revalidatePath("/dashboard/zakat-kurban");
  } catch (e) {
    throw new Error(errorMessage(e));
  }
}
