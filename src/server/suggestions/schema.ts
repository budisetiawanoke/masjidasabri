import { z } from "zod";

export const suggestionSchema = z.object({
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(5).max(2000),
  category: z.enum(["SARAN", "PENGADUAN"]),
  isAnonymous: z.boolean().optional(),
  contactInfo: z.string().trim().max(150).optional().nullable(),
});
export type SuggestionInput = z.infer<typeof suggestionSchema>;

export const suggestionResponseSchema = z.object({
  ticketId: z.string().min(1),
  response: z.string().trim().min(3).max(2000),
  status: z.enum(["DITINDAKLANJUTI", "SELESAI"]),
});
