import { z } from "zod";
import { looseUrlOrPath } from "@/lib/zod-helpers";

export const memberSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(150),
  gender: z.enum(["L", "P"]).optional().nullable(),
  birthDate: z.coerce.date().optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  domicile: z.string().trim().max(150).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.string().trim().email().optional().nullable().or(z.literal("")),
  isVolunteer: z.boolean().optional(),
  notes: z.string().trim().max(500).optional().nullable(),
});
export type MemberInput = z.infer<typeof memberSchema>;

export const boardMemberSchema = z.object({
  name: z.string().trim().min(2).max(150),
  position: z.string().trim().min(2).max(100),
  periodLabel: z.string().trim().min(4).max(30),
  photoUrl: looseUrlOrPath,
  order: z.coerce.number().int().min(0).default(0),
});
export type BoardMemberInput = z.infer<typeof boardMemberSchema>;
