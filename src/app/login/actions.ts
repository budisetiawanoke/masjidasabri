"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import type { ActionState } from "@/lib/action-state";
import { isRateLimited, recordFailedAttempt } from "@/lib/rate-limit";

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/dashboard");

  if (!email || !password) {
    return { ok: false, message: "Email dan kata sandi wajib diisi." };
  }

  // Batasi percobaan login per email agar tidak mudah ditebak paksa (brute
  // force). Hanya MENGECEK di sini — hitungan baru bertambah lewat
  // recordFailedAttempt() di bawah, dan hanya untuk percobaan yang benar-benar
  // gagal, supaya pengguna sah yang berhasil login berkali-kali tidak ikut
  // terkunci.
  const rateLimitKey = `login:${email}`;
  if (isRateLimited(rateLimitKey)) {
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
      recordFailedAttempt(rateLimitKey);
      return { ok: false, message: "Email atau kata sandi salah, atau akun Anda dinonaktifkan." };
    }
    // NEXT_REDIRECT dilempar oleh signIn saat berhasil — biarkan Next.js menanganinya.
    throw error;
  }
}
