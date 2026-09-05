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
- Playwright (`tests/e2e/*`) TIDAK membersihkan data yang dibuatnya secara
  otomatis — setiap run meninggalkan data uji (kampanye, transaksi, tiket
  saran, dsb.) di database. Sesekali bersihkan manual, atau jalankan E2E
  hanya saat benar-benar perlu memverifikasi ulang alur kritis, bukan
  setiap iterasi kecil.
- `playwright.config.ts` MENOLAK jalan sama sekali kecuali `TEST_DATABASE_URL`
  (database Postgres/Supabase terpisah khusus pengujian) diset di `.env`,
  atau `E2E_ALLOW_SHARED_DB=1` diset untuk sengaja menguji ke database
  yang sama (lihat `.env.example`). Penjaga ini ditambahkan setelah
  kampanye "Kampanye Uji E2E ..." pernah nyasar tampil ke jamaah
  sungguhan di halaman publik `/donasi` — 13 kampanye uji & 19 transaksi
  uji terkumpul dari run-run sebelumnya sampai dibersihkan manual.

Kalau nanti jamaah sungguhan sudah memakai aplikasi ini dan risiko data
tercampur jadi masalah nyata, pertimbangkan pisahkan lagi jadi dua database
(lihat riwayat commit sebelum migrasi ini untuk pola pemisahannya).

## Deploy aktual: Firebase App Hosting (bukan Vercel)

Bagian "3. Deploy ke Vercel" di atas sudah usang — aplikasi ini sekarang
live di **Firebase App Hosting**
(`https://masjidasabri--masjidasabri-a959d.asia-southeast1.hosted.app`),
terhubung otomatis ke branch `main` repo GitHub. Setiap `git push` ke
`main` memicu build & rollout baru secara otomatis lewat GitHub App
Firebase. Env vars (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
`FIREBASE_STORAGE_BUCKET`) diisi manual di Firebase Console → App
Hosting → backend → Settings → Environment.

### ⚠️ Bug ditemukan: `public/<subfolder>/berkas` selalu 404

Berkas statis di `public/` yang berada di **subfolder mana pun**
(`public/assets/foo.png`, `public/img/foo.png`, dst.) **selalu 404** di
Firebase App Hosting — sudah dites berkali-kali dengan nama folder
berbeda-beda, hasilnya konsisten. Hanya berkas di **root** `public/`
(`public/logo.png`, dst.) yang berpotensi tersaji, dan bahkan itu pun
TIDAK CUKUP kalau berkas itu cuma direferensikan sebagai string URL di
JSX (`<Image src="/foo.png">`) — harus ada kode server yang membacanya
lewat `readFileSync` (lihat pola di `src/lib/emblem-image.tsx`) supaya
Next.js men-trace & menyertakannya ke bundle produksi. Ini kemungkinan
bug di adapter Next.js milik App Hosting (output file tracing yang
salah kaprah menyertakan berkas `public/`, bukan menyalin seluruh folder
apa adanya seperti perilaku standar Next.js di platform lain).

**Solusi yang dipakai** (lihat `src/app/api/hero-image/route.ts` dan
`src/app/api/header-logo/route.ts`): sajikan gambar lewat route API
server yang membaca berkas dari `public/<nama-file-langsung-di-root>`
via `readFileSync`, bukan lewat URL statis langsung. Kalau menambah
gambar baru yang perlu tampil di App Hosting, ikuti pola yang sama —
jangan taruh di subfolder `public/` dan jangan andalkan URL statis
langsung tanpa route API pembungkus.

### Rollout lambat propagasi (~beberapa menit setelah "berhasil")

`firebase apphosting:rollouts:create` bisa melaporkan
"Successfully created a new rollout!" padahal konten barunya belum
benar-benar live selama beberapa menit setelahnya (pernah diamati
sampai ±10 menit). Jangan buru-buru trigger rollout baru lagi kalau
baru saja "berhasil" tapi belum kelihatan perubahannya — tunggu dulu,
karena memicu rollout beruntun dalam waktu singkat tampaknya memperparah
antrean/keterlambatan ini, bukan mempercepat.

## Merilis APK Android baru (unduhan publik di /api/download-apk)

Situs publik punya kartu "Pasang Aplikasi Android" (halaman Beranda) yang
mengunduh `public/masjid-asabri.apk` lewat `/api/download-apk` — pola
`readFileSync` yang sama seperti gambar (lihat bagian "Bug ditemukan" di
atas), supaya berkasnya ikut ter-bundle di Firebase App Hosting.

**Kunci penandatanganan rilis** (`android/app/masjidasabri-release.keystore`
+ `android/keystore.properties`, kredensialnya) **sengaja TIDAK di-commit**
ke git (lihat `android/.gitignore`) — siapa pun yang memegangnya bisa
menandatangani APK "resmi" palsu. Simpan salinannya di tempat aman
(mis. password manager tim) di luar repo; kalau hilang, jamaah yang
sudah pasang APK versi lama harus copot dulu sebelum pasang versi baru
(Android menolak update dengan tanda tangan berbeda dari yang terpasang).

Langkah merilis APK baru setelah ada perubahan kode:

```bash
# 1. Pastikan android/keystore.properties & masjidasabri-release.keystore
#    ada (generate sekali lewat keytool kalau proyek baru di-clone, lalu
#    simpan baik-baik — lihat bagian di atas).

# 2. Naikkan versionCode & versionName di android/app/build.gradle
#    (samakan versionName dengan versi di package.json).

# 3. Sinkron aset web terbaru ke proyek Android, lalu build rilis:
npm run android:sync
cd android
JAVA_HOME=$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home ./gradlew assembleRelease

# 4. Salin hasilnya ke public/, timpa yang lama:
cp app/build/outputs/apk/release/app-release.apk ../public/masjid-asabri.apk
cd ..

# 5. Commit & deploy seperti biasa (git add, commit, push, lalu
#    firebase apphosting:rollouts:create).
```

Jamaah yang sudah memasang APK lama tidak otomatis ter-update — mereka
perlu mengunduh & memasang ulang dari halaman Beranda kapan pun mereka
mau versi terbaru (tidak ada mekanisme auto-update di luar Play Store).
