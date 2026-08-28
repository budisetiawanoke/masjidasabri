import "server-only";

/**
 * Pembatas laju percobaan login sederhana berbasis memori proses — cukup
 * untuk deployment single-instance (mis. VPS tunggal, yang lazim untuk skala
 * satu yayasan masjid). Untuk deployment multi-instance/serverless, ganti
 * dengan penyimpanan bersama (mis. Redis) karena Map ini tidak dibagi antar
 * instance/proses.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000; // 10 menit
const MAX_ATTEMPTS = 10;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

// Bersihkan entri kedaluwarsa secara berkala agar Map tidak tumbuh tanpa batas.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.resetAt < now) attempts.delete(key);
  }
}, WINDOW_MS).unref();
