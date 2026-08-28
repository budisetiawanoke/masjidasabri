import { z } from "zod";

export const zakatRecordSchema = z.object({
  type: z.enum(["FITRAH", "MAAL"]),
  payerName: z.string().trim().min(2).max(150),
  payerContact: z.string().trim().max(50).optional().nullable(),
  familyCount: z.coerce.number().int().min(1).default(1),
  amountRice: z.coerce.number().min(0).optional().nullable(),
  amountMoney: z.coerce.number().int().min(0).optional().nullable(),
  distributedTo: z.string().trim().max(150).optional().nullable(),
});
export type ZakatRecordInput = z.infer<typeof zakatRecordSchema>;

export const qurbanRecordSchema = z.object({
  animalType: z.enum(["SAPI", "KAMBING", "DOMBA"]),
  qurbanFor: z.string().trim().min(2).max(150),
  contactPhone: z.string().trim().max(30).optional().nullable(),
  sharesCount: z.coerce.number().int().min(1).default(1),
  amountPaid: z.coerce.number().int().min(0),
  year: z.coerce.number().int().min(2020).max(2100),
});
export type QurbanRecordInput = z.infer<typeof qurbanRecordSchema>;
