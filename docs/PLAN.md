# Rencana Pengembangan — Masjid ASABRI

## Tahap 1 — Fondasi (dikerjakan berurutan, tidak boleh paralel karena semua modul bergantung padanya)
1. Scaffold Next.js + TS + Tailwind + Prisma/SQLite + Auth.js
2. Desain token merek (Tailwind theme) dari logo
3. Skema Prisma penuh + seed data contoh (yayasan, pengurus, kategori transaksi)
4. Auth + RBAC middleware + halaman login
5. Layout dasar: shell publik + shell dashboard

## Tahap 2 — Modul Fungsional (kepemilikan jelas per area, kontrak = skema Prisma + tipe di `src/server/*/types.ts` yang sudah dikunci di Tahap 1)
- **Modul Keuangan** (`src/server/finance`, `app/(dashboard)/keuangan`, `app/(public)/laporan-keuangan`)
- **Modul Jamaah & Pengurus** (`src/server/membership`, `app/(dashboard)/jamaah`, `app/(public)/profil`)
- **Modul Kegiatan & Pengumuman** (`src/server/events`, `app/(dashboard)/kegiatan`, `app/(public)/kegiatan`)
- **Modul Jadwal Sholat** (`src/server/prayer-times`, dipakai publik & dashboard)
- **Modul Inventaris, Zakat/Kurban, Kotak Saran** (`src/server/inventory`, `src/server/zakat`, `src/server/suggestions`)
- **Situs publik/landing** (`app/(public)/page.tsx` + komponen merek)

Setiap modul: schema Zod input, service function (server-only), route/server action, halaman UI, minimal 1 test.

## Tahap 3 — Verifikasi
1. `npm run build` bersih + `npm run lint` bersih
2. Vitest unit test tiap service (kalkulasi saldo, RBAC guard, kalkulator zakat)
3. Playwright E2E: login tiap role, alur catat transaksi → laporan publik ter-update, isolasi data antar role, akses ditolak untuk role salah
4. Uji adversarial: akses langsung API tanpa sesi, role spoofing di client, injeksi input form, XSS di kolom teks bebas (pengumuman/saran)
5. Aksesibilitas: kontras warna merek, navigasi keyboard, label ARIA
6. Perbaiki temuan → ulangi siklus hingga bersih

## Status
Lihat commit history & `docs/STATUS.md` (dibuat setelah fondasi selesai) untuk pelacakan progres real-time.
