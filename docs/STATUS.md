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
| Struktur Pengurus | Tampil di halaman publik `/profil` |
| Kegiatan | CRUD penuh (tambah/ubah/hapus) kajian/TPA/PHBI/rapat, tampil publik & di jadwal sholat (khatib/kajian) |
| Pengumuman | CRUD, sematkan di atas, tampil publik |
| Jadwal Sholat | Live dari Aladhan API + fallback hisab lokal (algoritma posisi matahari sendiri) bila API tak terjangkau |
| Inventaris | CRUD penuh aset + kondisi + lokasi, plus riwayat pemeliharaan (catat perbaikan & biaya per aset) |
| Zakat & Kurban | Kalkulator publik (maal & fitrah), pendaftaran mandiri publik, admin menandai status/distribusi |
| Kotak Saran | Kirim publik (bisa anonim), admin menanggapi, isolasi data (jamaah hanya lihat tiketnya sendiri) |
| Pengaturan Yayasan | Super Admin mengubah profil publik, koordinat (untuk jadwal sholat), info rekening |
| Manajemen Pengguna | Super Admin membuat akun, ubah peran/status aktif, reset kata sandi — dengan proteksi anti-lockout diri sendiri |

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

## Cakupan Pengujian Otomatis

- **Vitest (27 test)**: RBAC (`can`/`assertCan` untuk semua kombinasi
  peran×izin), kalkulator zakat, algoritma hisab (urutan waktu, rentang
  wajar, determinisme), dan **service keuangan terhadap database nyata**
  (SQLite terpisah `test.db`) — termasuk pemisahan tugas (bendahara tidak
  bisa mengesahkan transaksinya sendiri), integritas jejak audit (koreksi
  tidak pernah menimpa data), dan pembatalan hanya oleh Super Admin.
- **Playwright (16 test)**: navigasi publik, login (termasuk gagal & rate
  limit di batas), proteksi rute tanpa sesi, isolasi RBAC lintas 3 peran
  dengan akses URL langsung, dan alur bisnis inti (bendahara mencatat →
  super admin mengesahkan, terverifikasi tampil sebagai APPROVED).

## Yang Belum Dikerjakan / Kandidat Iterasi Berikutnya

- Ekspor laporan keuangan ke PDF/Excel (saat ini: tampilan tabel web + bisa di-print via browser)
- Notifikasi email/WhatsApp (`src/lib/notify.ts` belum dibuat — perlu kredensial provider dari yayasan)
- Upload gambar (poster kegiatan, foto pengurus, QRIS) — field `posterUrl`/`photoUrl`/`qrisImageUrl` sudah ada di skema tapi belum ada UI unggah file (perlu keputusan storage: lokal vs S3-compatible)
- Migrasi ke PostgreSQL untuk deployment produksi multi-instance (skema sudah kompatibel, tinggal ganti `provider` + `DATABASE_URL`)
- Rate limiter login perlu diganti ke penyimpanan bersama jika di-deploy multi-instance/serverless
