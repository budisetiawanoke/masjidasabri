import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(3).max(2000),
  category: z.enum(["KAJIAN", "TPA", "PHBI", "RAPAT", "LAINNYA"]),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  speaker: z.string().trim().max(150).optional().nullable(),
  posterUrl: z.string().url().optional().nullable().or(z.literal("")),
});
export type EventInput = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  title: z.string().trim().min(3).max(150),
  body: z.string().trim().min(3).max(5000),
  isPinned: z.boolean().optional(),
});
export type AnnouncementInput = z.infer<typeof announcementSchema>;
