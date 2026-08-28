import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(200),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "BENDAHARA", "JAMAAH"]),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(150),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "BENDAHARA", "JAMAAH"]),
  isActive: z.boolean(),
});

export const resetPasswordSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(8).max(200),
});
