import "server-only";

/**
 * Pembatas laju percobaan login sederhana berbasis memori proses — cukup
 * untuk deployment single-instance (mis. VPS tunggal, yang lazim untuk skala
 * satu yayasan masjid). Untuk deployment multi-instance/serverless, ganti
 * dengan penyimpanan bersama (mis. Redis) karena Map ini tidak dibagi antar
 * instance/proses.
 *
 * PENTING: hitungan hanya bertambah lewat `recordFailedAttempt()`, dipanggil
 * HANYA saat kredensial salah. Login yang BERHASIL tidak pernah menambah
 * hitungan — desain awal sempat memanggil pemeriksaan ini sebelum tahu hasil
 * autentikasi, sehingga pengguna sah yang login berkali-kali dalam 10 menit
 * (skenario normal, mis. keluar-masuk berulang) bisa ikut terkunci. Itu bug,
 * bukan perilaku yang diinginkan — pembatasan ini seharusnya hanya menyasar
 * percobaan tebak-paksa kata sandi yang gagal.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000; // 10 menit
const MAX_ATTEMPTS = 10;

/** Mengecek saja (tidak mengubah hitungan) — aman dipanggil sebelum tahu hasil autentikasi. */
export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) return false;
  return entry.count >= MAX_ATTEMPTS;
}

/** Panggil HANYA setelah kredensial terbukti salah. */
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

// Bersihkan entri kedaluwarsa secara berkala agar Map tidak tumbuh tanpa batas.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.resetAt < now) attempts.delete(key);
  }
}, WINDOW_MS).unref();
