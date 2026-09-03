# Panduan Deploy — Vercel + Supabase

Jalur ini dipilih untuk Masjid ASABRI: gratis untuk skala satu yayasan,
tanpa perlu mengelola server sendiri. Ikuti langkah berikut secara berurutan.

**Catatan penting**: aplikasi ini hanya memakai Supabase sebagai **database
Postgres biasa** lewat Prisma — bukan client SDK Supabase, bukan Supabase
Auth. Otentikasi & RBAC aplikasi ini sepenuhnya ditangani sendiri (Auth.js),
jadi tidak perlu instal `@supabase/supabase-js` atau `@supabase/ssr`.

## 1. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) → daftar/masuk (gratis, tanpa kartu kredit).
2. Buat project baru, mis. nama `masjidasabri`. Catat/simpan kata sandi
   database yang diminta saat pembuatan (atau reset lewat Project Settings →
   Database bila lupa).
3. Di dashboard project → klik **Connect** → tab **ORMs** → pilih **Prisma**.
   Salin dua connection string yang ditampilkan:
   - **Transaction pooler** (port `6543`) → ini jadi `DATABASE_URL`
   - **Session pooler** (port `5432`) → ini jadi `DIRECT_URL`
4. **Ganti placeholder password** di kedua string dengan kata sandi asli, dan
   **URL-encode karakter spesial** (`#`, `=`, `@`, dll.) bila kata sandi
   mengandungnya — mis. `#` → `%23`, `=` → `%3D`. Kalau salah encode, Prisma
   gagal parse dengan error "invalid port number".

Batas paket gratis Supabase: 500MB database, maks. 2 project aktif per akun,
project di-pause otomatis setelah 1 minggu tanpa aktivitas (bangunkan manual
lewat dashboard bila itu terjadi).

## 2. Push kode ke GitHub

Jika kode belum ada di GitHub:

```bash
git remote add origin https://github.com/<username-anda>/masjid-asabri.git
git branch -M main
git push -u origin main
```

(Ganti `<username-anda>` sesuai akun GitHub Anda — buat repository kosong
dulu di github.com/new bila belum ada.)

## 3. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → daftar dengan akun GitHub yang sama.
2. **Add New → Project** → pilih repository `masjid-asabri`.
3. Di bagian **Environment Variables**, isi:
   - `DATABASE_URL` — connection string transaction pooler dari langkah 1
   - `DIRECT_URL` — connection string session pooler dari langkah 1
   - `AUTH_SECRET` — string acak panjang. Generate dengan:
     ```bash
     openssl rand -base64 32
     ```
   - `NEXTAUTH_URL` — **tidak perlu diisi** (Auth.js otomatis mendeteksi
     origin dari header `Host` permintaan yang masuk — lihat komentar di
     `.env`). Isi hanya kalau memang ingin memaksa satu origin tertentu.
4. Klik **Deploy**.

## 4. Terapkan skema database & data awal

Setelah deploy pertama berhasil, jalankan sekali dari komputer Anda:

```bash
DATABASE_URL="<transaction-pooler-url>" DIRECT_URL="<session-pooler-url>" npx prisma migrate deploy
DATABASE_URL="<transaction-pooler-url>" npx tsx prisma/seed.ts
```

**Segera ganti seluruh kata sandi akun contoh** (lihat README) setelah
langkah ini — jangan biarkan kata sandi default aktif di lingkungan publik.

## 5. Aktifkan penyimpanan berkas (Vercel Blob)

Wajib — tanpa ini, unggah foto/poster/QRIS/bukti transaksi akan gagal di
Vercel (filesystem-nya tidak permanen).

1. Di dashboard proyek Vercel → tab **Storage** → **Create Database** → pilih
   **Blob**.
2. Vercel otomatis menambahkan environment variable `BLOB_READ_WRITE_TOKEN`
   ke proyek Anda — tidak perlu isi manual.
3. Redeploy proyek (Vercel biasanya melakukan ini otomatis setelah
   menambah storage; jika tidak, klik **Redeploy** di tab Deployments).

## 6. (Opsional) Domain kustom

Di tab **Domains** proyek Vercel, tambahkan domain milik yayasan (mis.
`masjidasabri.org`) dan ikuti instruksi DNS yang ditampilkan.

## Setelah deploy — verifikasi

- Buka URL produksi, pastikan beranda tampil dengan jadwal sholat & data.
- Login dengan akun Super Admin contoh, langsung ganti kata sandinya lewat
  dashboard **Pengguna**.
- Coba unggah satu foto pengurus untuk memastikan Vercel Blob aktif.
- Isi **Pengaturan Yayasan** dengan data asli (alamat, koordinat, rekening).

## Update berikutnya

Setiap `git push` ke branch `main` otomatis di-deploy ulang oleh Vercel.
Perubahan skema database (`prisma/schema.prisma`) perlu `prisma migrate
deploy` dijalankan manual seperti langkah 4 (Vercel tidak menjalankannya
otomatis, demi keamanan — migrasi skema adalah operasi sensitif).

## Dev lokal = Supabase (satu database, keputusan sadar)

`.env` lokal menunjuk **langsung ke Supabase yang sama dengan produksi** —
bukan Postgres lokal terpisah. Ini pilihan yang sengaja dibuat untuk
kesederhanaan (satu database untuk dikelola, bukan dua), dengan trade-off:
coding/testing sehari-hari (`npm run dev`, `npm test`) menyentuh database
yang sama dengan yang dilihat jamaah sungguhan setelah aplikasi live.

Mitigasi yang sudah ada:
- `prisma/seed.ts` memakai `upsert` untuk akun & kategori — aman dijalankan
  berkali-kali, tidak membuat duplikat.
- `tests/unit/finance-service.test.ts` membersihkan seluruh baris yang
  dibuatnya sendiri di `afterAll` (user/kategori/transaksi/audit log
  bertanda `@test.local`).
- Playwright (`tests/e2e/*`) TIDAK melakukan ini secara otomatis — setiap
  `npx playwright test` meninggalkan data uji (transaksi, tiket saran, dsb.)
  di database. Sesekali bersihkan manual, atau jalankan E2E hanya saat
  benar-benar perlu memverifikasi ulang alur kritis, bukan setiap iterasi kecil.

Kalau nanti jamaah sungguhan sudah memakai aplikasi ini dan risiko data
tercampur jadi masalah nyata, pertimbangkan pisahkan lagi jadi dua database
(lihat riwayat commit sebelum migrasi ini untuk pola pemisahannya).
