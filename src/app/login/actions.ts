"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import type { ActionState } from "@/lib/action-state";
import { isRateLimited } from "@/lib/rate-limit";

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/dashboard");

  if (!email || !password) {
    return { ok: false, message: "Email dan kata sandi wajib diisi." };
  }

  // Batasi percobaan login per email agar tidak mudah ditebak paksa (brute force).
  if (isRateLimited(`login:${email}`)) {
    return {
      ok: false,
      message: "Terlalu banyak percobaan masuk. Silakan coba lagi dalam beberapa menit.",
    };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Email atau kata sandi salah, atau akun Anda dinonaktifkan." };
    }
    // NEXT_REDIRECT dilempar oleh signIn saat berhasil — biarkan Next.js menanganinya.
    throw error;
  }
}
