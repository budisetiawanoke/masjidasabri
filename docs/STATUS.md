# Status Implementasi — Masjid ASABRI

_Diperbarui: siklus riset → pengembangan → verifikasi pertama selesai._

## Ringkasan

Aplikasi berjalan penuh end-to-end: situs publik + dashboard internal
4-peran, didukung database nyata (bukan mock), dengan `npm run build`,
`npm run lint`, `npm test` (Vitest), dan `npx playwright test` (E2E) **hijau
semua**.

## Modul yang Sudah Fungsional (bukan placeholder — semua tersambung ke database via Prisma)

| Modul | Fitur |
|---|---|
| Auth & RBAC | Login kredensial, 4 peran, proteksi rute (middleware/proxy) + guard di setiap halaman dashboard + validasi ulang di setiap server action |
| Keuangan | Catat transaksi, alur PENDING→APPROVED, pembatalan (void) dengan alasan, koreksi dengan jejak audit (before/after snapshot), kategori kustom, saldo real-time, laporan publik per bulan |
| Jamaah | CRUD data jamaah, pencarian, riwayat transaksi per jamaah |
| Struktur Pengurus | CRUD penuh (nama, jabatan, periode, foto, urutan, aktif/nonaktif), tampil publik di `/profil` |
| Kegiatan | CRUD penuh (tambah/ubah/hapus) kajian/TPA/PHBI/rapat, tampil publik & di jadwal sholat (khatib/kajian) |
| Pengumuman | CRUD, sematkan di atas, tampil publik |
| Jadwal Sholat | Live dari Aladhan API + fallback hisab lokal (algoritma posisi matahari sendiri) bila API tak terjangkau |
| Inventaris | CRUD penuh aset + kondisi + lokasi, plus riwayat pemeliharaan (catat perbaikan & biaya per aset) |
| Zakat & Kurban | Kalkulator publik (maal & fitrah), pendaftaran mandiri publik, admin menandai status/distribusi |
| Kotak Saran | Kirim publik (bisa anonim, tanpa perlu akun), admin menanggapi. Setiap tiket dapat kode pelacakan unik — siapa saja bisa cek status & tanggapan di `/kotak-saran/cek-status` tanpa login (lihat "Keputusan Produk" di bawah); pemilik akun peran JAMAAH (relawan/panitia) tetap bisa lihat riwayat tiketnya sendiri lewat dashboard sebagai bonus |
| Pengaturan Yayasan | Super Admin mengubah profil publik, koordinat (untuk jadwal sholat), info rekening, gambar QRIS |
| Manajemen Pengguna | Super Admin membuat akun, ubah peran/status aktif, reset kata sandi — dengan proteksi anti-lockout diri sendiri |
| Unggah Berkas | `/api/upload` — foto pengurus, poster kegiatan, gambar QRIS, bukti transaksi. Vercel Blob otomatis di produksi (atau `public/uploads/` lokal bila tanpa token), RBAC + whitelist MIME + nama berkas acak |
| PWA / Android | Installable (manifest + service worker), ikon adaptif Android (maskable), Add to Home Screen di iOS/Android — fondasi untuk pembungkus APK |
| Ekspor PDF | Laporan keuangan bulanan bisa diunduh sebagai PDF (`@react-pdf/renderer`, dirender server-side) langsung dari halaman publik |

## Temuan & Perbaikan Selama Verifikasi

1. **Broken access control (ditemukan & diperbaiki)** — beberapa halaman
   dashboard (`jamaah`, `kegiatan`, `pengumuman`, `inventaris`, `zakat-kurban`
   admin, `keuangan`) awalnya hanya mengandalkan tautan menu tersembunyi,
   bukan pemeriksaan izin di server. Diperbaiki dengan `requirePagePermission()`
   di setiap halaman + diverifikasi lewat Playwright (`tests/e2e/rbac.spec.ts`)
   yang mengetik URL modul terlarang secara langsung sebagai peran JAMAAH.
2. **Self-lockout Super Admin (ditemukan & diperbaiki)** — `updateUser()`
   awalnya hanya mencegah Super Admin menurunkan perannya sendiri, belum
   mencegah menonaktifkan akunnya sendiri. Ditambahkan pemeriksaan server-side
   (bukan hanya `disabled` di UI, yang bisa dilewati).
3. **Kontras warna gagal WCAG AA (ditemukan & diperbaiki)** — `text-foreground/40`
   dan `/50` (rasio 2.4:1–3.2:1) dan teks terracotta di atas latar terang
   (3.7:1–4.4:1) berada di bawah ambang AA 4.5:1 untuk teks normal. Diperbaiki:
   token teks pudar dinaikkan ke `/70` (≥5.9:1) dan ditambahkan
   `--brand-terracotta-700` (≥5.7:1) khusus teks di atas latar terang,
   dipakai lewat pengukuran kontras aktual (skrip Node, rumus WCAG), bukan
   perkiraan visual.
4. **Rate limiting login ditambahkan** proaktif (bukan dari temuan bug, tapi
   dari tinjauan ketahanan) — mencegah tebak-paksa kata sandi.
5. **Bug validasi Zod ditemukan sebelum sempat dipakai** — beberapa field URL
   gambar (`posterUrl`, `attachmentUrl`, `photoUrl`) memakai `.url()` yang
   menolak path relatif hasil unggahan lokal (`/uploads/...`). Ditemukan saat
   membangun fitur upload, diperbaiki dengan helper `looseUrlOrPath` sebelum
   fitur tersebut sempat rilis dengan bug.
6. **Rate limiter login mengunci pengguna sah (ditemukan & diperbaiki)** —
   desain awal menghitung SETIAP percobaan login (termasuk yang berhasil)
   ke arah batas 10x/10menit, jadi pengguna yang login-logout berulang secara
   normal (mis. saat pengujian, atau pengurus yang sering ganti perangkat)
   bisa ikut terkunci walau kata sandinya benar. Ditemukan saat pengujian
   E2E berulang menyebabkan login yang seharusnya sukses malah gagal.
   Diperbaiki: hitungan sekarang hanya bertambah untuk percobaan yang
   TERBUKTI GAGAL (`recordFailedAttempt`, dipanggil hanya di jalur
   `AuthError`), login berhasil tidak pernah menyumbang ke batas. Dikunci
   dengan `tests/unit/rate-limit.test.ts`.

## Cakupan Pengujian Otomatis

- **Vitest (31 test)**: RBAC (`can`/`assertCan` untuk semua kombinasi
  peran×izin), kalkulator zakat, algoritma hisab (urutan waktu, rentang
  wajar, determinisme), rate limiter login (hanya kegagalan yang dihitung),
  dan **service keuangan terhadap database nyata** (PostgreSQL lokal, database
  terpisah `masjid_asabri_test`) — termasuk pemisahan tugas (bendahara tidak bisa mengesahkan
  transaksinya sendiri), integritas jejak audit (koreksi tidak pernah
  menimpa data), dan pembatalan hanya oleh Super Admin.
- **Playwright (26 test)**: navigasi publik, login (termasuk gagal & rate
  limit di batas), proteksi rute tanpa sesi, isolasi RBAC lintas 3 peran
  dengan akses URL langsung, alur bisnis inti (bendahara mencatat → super
  admin mengesahkan; pendaftaran zakat & kurban publik → tindak lanjut
  admin), ekspor PDF (validasi magic bytes berkas), keamanan endpoint
  upload (tanpa sesi, peran tanpa izin, tipe file di luar whitelist,
  percobaan path traversal lewat parameter kategori), dan uji adversarial
  (XSS pada Kotak Saran, payload SQL-injection-like pada pencarian jamaah,
  percobaan eskalasi peran lewat request langsung ke rute pengguna).

## Aplikasi Android (APK)

Proyek Capacitor (`android/`) sudah dibuat dan **diverifikasi langsung**:
APK debug berhasil di-build (`./gradlew assembleDebug`, JDK 21 + Android
SDK lokal), diinstal ke Android Emulator sungguhan lewat `adb`, dan
dikonfirmasi lewat tangkapan layar bahwa aplikasi tampil dengan benar
(lambang & tema merek, jadwal sholat live dari Aladhan API, navigasi antar
halaman berfungsi). Ikon & splash screen native memakai lambang yayasan
(bukan logo generik Capacitor bawaan). Detail & cara build APK final: lihat
[docs/ANDROID.md](ANDROID.md).

Build uji coba tersebut mengarah ke URL tunnel sementara yang sudah
dimatikan setelah verifikasi — **APK untuk dibagikan ke jamaah harus
di-build ulang mengarah ke URL produksi sungguhan** setelah deploy (langkah
satu perintah, lihat docs/ANDROID.md bagian "Membuat APK untuk distribusi").

## Keputusan Produk: Peran Jamaah Bukan untuk Registrasi Massal

Awalnya peran `JAMAAH` dipikirkan sebagai akun untuk tiap jamaah masjid. Setelah
ditinjau ulang, ini **diubah secara sengaja**:

- **Tidak ada — dan tidak akan dibuat — pendaftaran akun mandiri untuk jamaah
  umum.** Akun hanya dibuat manual oleh Super Admin (`/dashboard/pengguna`),
  jadi tidak scalable untuk ratusan/ribuan jamaah dan tidak pernah dimaksudkan
  untuk itu.
- Hampir seluruh fitur (jadwal sholat, laporan keuangan, kegiatan, pengumuman,
  profil pengurus, kalkulator + **pendaftaran** zakat & kurban) sudah publik
  tanpa login — `ZakatRecord`/`QurbanRecord` bahkan tidak terhubung ke tabel
  `User` sama sekali.
- **Kotak Saran** — satu-satunya fitur yang dulu "butuh" akun untuk pelacakan
  status — sekarang memakai **kode pelacakan publik** (`SuggestionTicket.trackingCode`,
  format `XXXX-XXXX`) yang diberikan ke SETIAP pengirim (anonim maupun bukan)
  saat submit, dan bisa dipakai siapa saja untuk cek status di
  `/kotak-saran/cek-status` tanpa login. Lihat `createSuggestion()` &
  `getSuggestionByTrackingCode()` di `src/server/suggestions/service.ts`.
- Peran `JAMAAH` **tetap ada** di sistem, tapi sekarang untuk kasus khusus
  (relawan/panitia aktif yang memang perlu login) — bukan syarat memakai
  aplikasi. Copy di halaman login sudah disesuaikan
  ("relawan/panitia terdaftar", bukan "Jamaah Terdaftar").

## Yang Belum Dikerjakan / Kandidat Iterasi Berikutnya

- Ekspor laporan keuangan ke Excel (PDF sudah ada; tabel web laporan bisa di-print via browser)
- Notifikasi email/WhatsApp (`src/lib/notify.ts` belum dibuat — perlu kredensial provider dari yayasan)
- Database produksi (Supabase) sudah dibuat, skema & data awal sudah diterapkan, dan diverifikasi (33 E2E + 31 unit test hijau terhadap Supabase sungguhan) — lihat [docs/DEPLOYMENT.md](DEPLOYMENT.md). Tinggal deploy aplikasinya sendiri ke Vercel (perlu akun Vercel milik yayasan)
- Build ulang APK final mengarah ke URL produksi setelah deploy (satu perintah, lihat docs/ANDROID.md)
- Rate limiter login masih berbasis memori proses — cukup untuk Vercel skala hobby/satu instance yang tidak restart sering, tapi tidak persisten lintas cold start serverless. Untuk jaminan penuh di produksi serverless, ganti ke penyimpanan bersama (mis. Upstash Redis, ada free tier).
