"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { inventoryItemSchema, maintenanceLogSchema } from "@/server/inventory/schema";
import { createInventoryItem, updateInventoryItem, deleteInventoryItem, addMaintenanceLog } from "@/server/inventory/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

function parseInventoryForm(formData: FormData) {
  return inventoryItemSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    quantity: formData.get("quantity"),
    location: formData.get("location") || undefined,
    acquiredAt: formData.get("acquiredAt") || undefined,
    notes: formData.get("notes") || undefined,
  });
}

export async function createInventoryItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseInventoryForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createInventoryItem(actor, parsed.data);
    revalidatePath("/dashboard/inventaris");
    return { ok: true, message: "Aset ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateInventoryItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") || "");
  const parsed = parseInventoryForm(formData);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await updateInventoryItem(actor, id, parsed.data);
    revalidatePath("/dashboard/inventaris");
    return { ok: true, message: "Aset diperbarui." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function deleteInventoryItemAction(id: string) {
  const actor = await requireActor();
  await deleteInventoryItem(actor, id);
  revalidatePath("/dashboard/inventaris");
}

export async function addMaintenanceLogAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = maintenanceLogSchema.safeParse({
    itemId: formData.get("itemId"),
    description: formData.get("description"),
    cost: formData.get("cost") || undefined,
    performedAt: formData.get("performedAt"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await addMaintenanceLog(actor, parsed.data);
    revalidatePath("/dashboard/inventaris");
    return { ok: true, message: "Riwayat pemeliharaan dicatat." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
