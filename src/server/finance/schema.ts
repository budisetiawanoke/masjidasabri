import { z } from "zod";
import { looseUrlOrPath } from "@/lib/zod-helpers";

export const createTransactionSchema = z.object({
  date: z.coerce.date(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  amount: z.coerce.number().int().positive("Nominal harus lebih dari 0"),
  description: z.string().trim().min(3, "Keterangan minimal 3 karakter").max(500),
  memberId: z.string().optional().nullable(),
  attachmentUrl: looseUrlOrPath,
});
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const reviseTransactionSchema = z.object({
  transactionId: z.string().min(1),
  date: z.coerce.date(),
  categoryId: z.string().min(1),
  amount: z.coerce.number().int().positive(),
  description: z.string().trim().min(3).max(500),
  reason: z.string().trim().min(5, "Alasan koreksi wajib diisi (min 5 karakter)").max(500),
});
export type ReviseTransactionInput = z.infer<typeof reviseTransactionSchema>;

export const voidTransactionSchema = z.object({
  transactionId: z.string().min(1),
  reason: z.string().trim().min(5, "Alasan pembatalan wajib diisi").max(500),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  kind: z.enum(["MASUK", "KELUAR"]),
});
