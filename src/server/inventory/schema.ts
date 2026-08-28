import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().trim().min(2).max(150),
  category: z.string().trim().min(2).max(80),
  condition: z.enum(["BAIK", "PERLU_PERBAIKAN", "RUSAK"]),
  quantity: z.coerce.number().int().min(0),
  location: z.string().trim().max(150).optional().nullable(),
  acquiredAt: z.coerce.date().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
  responsibleId: z.string().optional().nullable(),
});
export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;

export const maintenanceLogSchema = z.object({
  itemId: z.string().min(1),
  description: z.string().trim().min(3).max(500),
  cost: z.coerce.number().int().min(0).optional().nullable(),
  performedAt: z.coerce.date(),
});
