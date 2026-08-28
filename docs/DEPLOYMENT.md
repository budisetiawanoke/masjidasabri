# Panduan Deploy — Vercel + Database Cloud Gratis

Jalur ini dipilih untuk Masjid ASABRI: gratis untuk skala satu yayasan,
tanpa perlu mengelola server sendiri. Ikuti langkah berikut secara berurutan.

## 1. Buat database Postgres gratis (Neon)

1. Buka [neon.com](https://neon.com) → daftar (bisa pakai akun Google/GitHub).
2. Buat proyek baru, mis. nama `masjid-asabri`.
3. Salin **connection string** yang diberikan (formatnya
   `postgresql://user:password@host/dbname?sslmode=require`).

_Alternatif: [Supabase](https://supabase.com) atau **Vercel Postgres**
(bisa dibuat langsung dari dalam dashboard Vercel di langkah 3, tanpa akun
terpisah) — pilih salah satu saja, tidak perlu semua._

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
   - `DATABASE_URL` — connection string dari langkah 1 (atau buat Vercel
     Postgres di sini langsung jika belum punya Neon).
   - `AUTH_SECRET` — string acak panjang. Generate dengan:
     ```bash
     openssl rand -base64 32
     ```
   - `NEXTAUTH_URL` — isi sementara dengan URL yang Vercel tampilkan setelah
     deploy pertama (mis. `https://masjid-asabri.vercel.app`), lalu update
     lagi setelah domain kustom terpasang (langkah 5).
4. Klik **Deploy**.

## 4. Terapkan skema database & data awal

Setelah deploy pertama berhasil, jalankan sekali dari komputer Anda (butuh
`DATABASE_URL` yang sama seperti di Vercel — salin ke `.env` sementara atau
jalankan inline):

```bash
DATABASE_URL="<connection-string-dari-langkah-1>" npx prisma migrate deploy
DATABASE_URL="<connection-string-dari-langkah-1>" npx tsx prisma/seed.ts
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
`masjidasabri.org`) dan ikuti instruksi DNS yang ditampilkan. Setelah aktif,
update environment variable `NEXTAUTH_URL` ke domain tersebut dan redeploy.

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
