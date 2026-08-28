# Masjid ASABRI

Sistem pengelolaan Yayasan Masjid ASABRI Jatiasih — situs publik (jadwal
sholat, laporan keuangan transparan, kegiatan, profil pengurus) dan dashboard
internal (keuangan, jamaah, inventaris, zakat/kurban, kotak saran) untuk
periode kepengurusan 2026–2030.

Lihat [docs/RESEARCH.md](docs/RESEARCH.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md),
dan [docs/PLAN.md](docs/PLAN.md) untuk riset produk, arsitektur, dan rencana
pengembangan. [docs/STATUS.md](docs/STATUS.md) melacak status implementasi
dan verifikasi terkini.

## Tumpukan Teknologi

- **Next.js 16** (App Router, TypeScript, Turbopack) — satu codebase untuk situs publik & dashboard admin
- **Prisma 6 + SQLite** (dev) — skema siap dipindah ke PostgreSQL untuk produksi skala lebih besar
- **Auth.js (NextAuth v5)** — sesi JWT, kredensial email/kata sandi, RBAC 4 peran
- **Tailwind CSS v4** — token merek kustom (lihat `docs/ARCHITECTURE.md`)
- **Vitest** (unit) + **Playwright** (E2E) untuk pengujian otomatis

## Menjalankan Secara Lokal

```bash
npm install
cp .env.example .env   # sudah ada nilai default untuk dev lokal
npm run db:migrate      # terapkan skema ke SQLite lokal
npm run db:seed         # isi data awal (yayasan, kategori, akun contoh)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Akun Contoh (dari `npm run db:seed`)

| Peran | Email | Kata Sandi |
|---|---|---|
| Super Admin | admin@masjidasabri.org | AsabriAdmin#2026 |
| Bendahara | bendahara@masjidasabri.org | AsabriBendahara#2026 |
| Pengurus (Admin) | pengurus@masjidasabri.org | AsabriPengurus#2026 |
| Jamaah | jamaah@masjidasabri.org | AsabriJamaah#2026 |

**Ganti seluruh kata sandi ini sebelum deployment produksi sungguhan.**

## Pengujian

```bash
npm run lint       # ESLint
npm test           # Vitest — unit test RBAC, kalkulasi zakat, hisab, dan alur keuangan (DB SQLite terpisah: test.db)
npx playwright test # E2E — alur login, RBAC, dan pencatatan→pengesahan transaksi (butuh dev server berjalan)
npm run build       # build produksi + type-check penuh
```

## Struktur Direktori

```
prisma/schema.prisma        Skema data (User, Transaction, Event, ...)
prisma/seed.ts               Seed data awal
src/app/(public)/            Situs publik: beranda, jadwal sholat, laporan keuangan, kegiatan, profil, zakat & kurban, kotak saran
src/app/(dashboard)/dashboard/  Dashboard internal per modul, dijaga sesi + RBAC
src/app/login/                Halaman & server action login
src/server/<modul>/           Logic domain server-only: schema Zod + service (satu-satunya jalur ke Prisma)
src/lib/                      auth, rbac, prisma client, format, validasi
src/components/               UI kit & komponen merek (Emblem, layout)
tests/unit/                   Vitest — RBAC, hisab, kalkulator zakat, service keuangan (DB nyata)
tests/e2e/                    Playwright — alur pengguna penuh di browser sungguhan
```

## Model Otorisasi (RBAC)

Empat peran — `SUPER_ADMIN`, `ADMIN` (Pengurus), `BENDAHARA`, `JAMAAH` — dengan
izin granular per modul di [src/lib/rbac.ts](src/lib/rbac.ts). Setiap halaman
dashboard memanggil `requirePagePermission()` di server (bukan hanya
menyembunyikan tautan menu), dan setiap server action memvalidasi ulang peran
dari sesi — klien tidak pernah dipercaya. Lihat tabel lengkap di
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#otorisasi-rbac).

## Catatan Keamanan & Batasan yang Disengaja

- **Tidak ada payment gateway sungguhan** (Midtrans/QRIS resmi) — butuh
  kredensial merchant milik yayasan. Modul donasi mencatat transfer manual
  yang dikonfirmasi bendahara, ditambah info rekening/QRIS statis (gambar
  yang diunggah admin), bukan proses pembayaran otomatis.
- **Rate limiting login** memakai memori proses ([src/lib/rate-limit.ts](src/lib/rate-limit.ts)) —
  cukup untuk deployment single-instance; untuk multi-instance/serverless
  ganti dengan penyimpanan bersama (mis. Redis).
- **Berkas unggahan** (foto pengurus, poster kegiatan, QRIS, bukti transaksi)
  disimpan di filesystem lokal `public/uploads/` ([src/lib/upload.ts](src/lib/upload.ts)) —
  cocok untuk VPS/single-server, TIDAK untuk platform serverless (filesystem-nya
  sementara/read-only). Endpoint `/api/upload` membatasi tipe MIME, ukuran
  (5MB), dan peran pengunggah; nama berkas selalu diacak (bukan nama asli).
- **3 kerentanan `npm audit` tersisa** berasal dari `@prisma/config` (tooling
  CLI Prisma, dipakai saat `prisma migrate`/`generate`, bukan bagian bundel
  runtime aplikasi) — perbaikan otomatis mensyaratkan downgrade ke Prisma versi
  lebih lama; risiko diterima dan dicatat di sini alih-alih diam-diam diabaikan.
- Audit trail keuangan bersifat **append-only**: koreksi transaksi tidak
  pernah menimpa data, selalu tercatat di `TransactionRevision` dengan
  snapshot sebelum/sesudah + alasan.
