import type { ZodError } from "zod";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Kode pelacakan tiket kotak saran — lihat submitSuggestionAction. */
  trackingCode?: string;
};

export const initialActionState: ActionState = { ok: false };

export function zodErrorToFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan tak terduga.";
}
