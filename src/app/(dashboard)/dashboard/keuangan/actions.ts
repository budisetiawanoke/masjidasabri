"use server";

import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/require-actor";
import { createTransactionSchema, reviseTransactionSchema, createCategorySchema } from "@/server/finance/schema";
import {
  createTransaction,
  approveTransaction,
  voidTransaction,
  reviseTransaction,
  createCategory,
} from "@/server/finance/service";
import { zodErrorToFieldErrors, errorMessage, type ActionState } from "@/lib/action-state";

export async function createTransactionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createTransactionSchema.safeParse({
    date: formData.get("date"),
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    memberId: formData.get("memberId") || undefined,
    attachmentUrl: formData.get("attachmentUrl") || undefined,
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createTransaction(actor, parsed.data);
    revalidatePath("/dashboard/keuangan");
    revalidatePath("/dashboard");
    revalidatePath("/laporan-keuangan");
    return { ok: true, message: "Transaksi berhasil dicatat." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function approveTransactionAction(transactionId: string) {
  const actor = await requireActor();
  await approveTransaction(actor, transactionId);
  revalidatePath("/dashboard/keuangan");
  revalidatePath("/dashboard");
  revalidatePath("/laporan-keuangan");
}

export async function voidTransactionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const transactionId = String(formData.get("transactionId") || "");
  const reason = String(formData.get("reason") || "");
  try {
    const actor = await requireActor();
    await voidTransaction(actor, transactionId, reason);
    revalidatePath("/dashboard/keuangan");
    revalidatePath("/laporan-keuangan");
    return { ok: true, message: "Transaksi dibatalkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function reviseTransactionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = reviseTransactionSchema.safeParse({
    transactionId: formData.get("transactionId"),
    date: formData.get("date"),
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await reviseTransaction(actor, parsed.data);
    revalidatePath("/dashboard/keuangan");
    revalidatePath("/laporan-keuangan");
    return { ok: true, message: "Koreksi tersimpan dengan jejak audit." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function createCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    kind: formData.get("kind"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: zodErrorToFieldErrors(parsed.error) };

  try {
    const actor = await requireActor();
    await createCategory(actor, parsed.data);
    revalidatePath("/dashboard/keuangan");
    return { ok: true, message: "Kategori ditambahkan." };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
