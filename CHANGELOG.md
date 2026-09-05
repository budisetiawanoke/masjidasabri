# Changelog

Semua perubahan penting pada aplikasi Masjid ASABRI dicatat di sini. Format
mengikuti [Keep a Changelog](https://keepachangelog.com/), dan nomor versi
mengikuti [Semantic Versioning](https://semver.org/) — sesuai versi yang
ditampilkan di footer setiap halaman publik (`package.json` → `version`).

## [0.3.2] — 2026-09-05

### Dihapus
- Kartu "Pasang di Layar Utama HP" di halaman Beranda (tombol unduh APK
  + tautan panduan iPhone) — atas permintaan, seluruh promosi/instruksi
  cara memasang aplikasi Android maupun iPhone ditarik dari UI situs
  (baik Beranda maupun FAQ). Termasuk 3 FAQ terkait ("Apakah ada versi
  aplikasi Android?", "Bagaimana cara memasang aplikasi Android...",
  "Apakah ada versi untuk iPhone?") dan 2 bagian Buku Panduan Penggunaan
  ("Memasang Aplikasi Android", "Memasang di iPhone").
- Selebaran perkenalan (artifact) dikembalikan ke versi "buka lewat
  browser" tanpa instruksi APK/iPhone.

### Dipertahankan (tidak dihapus)
- Endpoint `/api/download-apk` dan berkas `public/masjid-asabri.apk`
  tetap ada dan berfungsi (tidak ditautkan dari UI mana pun) — bisa
  tetap dibagikan manual oleh pengurus lewat tautan langsung kalau
  diperlukan, sama seperti alur sebelum fitur unduhan resmi ini ada.

## [0.3.1] — 2026-09-05

### Ditambahkan
- Panduan resmi cara memasang situs ini di **layar utama iPhone** lewat
  fitur bawaan Safari ("Tambah ke Layar Utama") — situs ini sebenarnya
  sudah mendukung ini sejak awal (manifest PWA + ikon Apple Touch sudah
  ada), tapi belum pernah didokumentasikan ke jamaah. Ditambahkan
  sebagai FAQ baru dan bagian baru di Buku Panduan Penggunaan.

### Diubah
- Kartu di halaman Beranda diubah namanya dari "Pasang Aplikasi
  Android" menjadi "Pasang di Layar Utama HP" (lebih mencakup dua
  platform), tombol unduh diberi label lebih jelas "Unduh untuk
  Android", dan ditambahkan tautan "cara memasangnya di halaman FAQ"
  untuk pengguna iPhone.

## [0.3.0] — 2026-09-05

### Ditambahkan
- **Unduhan resmi aplikasi Android** langsung dari situs: kartu "Pasang
  Aplikasi Android" di halaman Beranda, mengunduh berkas APK yang sudah
  ditandatangani lewat `/api/download-apk`. Sebelumnya APK hanya
  dibagikan manual oleh pengurus.
- APK rilis pertama kini ditandatangani dengan kunci rilis resmi
  (`android/app/masjidasabri-release.keystore`, tidak di-commit ke git
  — lihat `docs/DEPLOYMENT.md` untuk cara merilis versi berikutnya).
  `versionCode`/`versionName` aplikasi Android kini disamakan dengan
  versi web di `package.json`.
- FAQ dan Buku Panduan Penggunaan diperbarui dengan pertanyaan &
  langkah-langkah cara mengunduh dan memasang APK (termasuk soal
  peringatan "sumber tidak dikenal" yang normal muncul saat pertama
  pasang).

### Diperbaiki
- FAQ dan Buku Panduan Penggunaan sempat menyebut jenis hewan kurban
  lama (Sapi/Kambing/Domba) — sudah diperbarui mengikuti perubahan di
  v0.2.2 (Sapi (per ekor), Sapi (Patungan), Kambing/Domba).

## [0.2.2] — 2026-09-05

### Diubah
- Jenis hewan kurban diubah dari tiga pilihan lama (Sapi (patungan),
  Kambing, Domba) menjadi tiga pilihan baru: **Sapi (per ekor)**,
  **Sapi (Patungan)**, dan **Kambing/Domba** (Kambing & Domba digabung
  jadi satu pilihan). Berlaku di formulir pendaftaran kurban publik,
  laporan publik per jenis, dan bukti bayar. Data pendaftaran kurban
  yang sudah ada dimigrasikan otomatis ke kode baru (KAMBING/DOMBA ->
  KAMBING_DOMBA, SAPI -> SAPI_PATUNGAN) tanpa kehilangan riwayat.

## [0.2.1] — 2026-09-05

### Diubah
- **Playbook Pengurus** di halaman `/faq` sekarang khusus staf (Super Admin,
  Admin/Pengurus, Bendahara) yang sudah login — tab dan isinya sama sekali
  tidak dirender untuk pengunjung publik maupun akun Jamaah (bukan cuma
  disembunyikan lewat tampilan), dan endpoint unduhan PDF-nya
  (`/api/playbook/pdf`) menolak permintaan tanpa sesi staf yang sah
  (403). Ditambahkan izin baru `VIEW_PLAYBOOK` di `src/lib/rbac.ts`.
- FAQ dan Buku Panduan Penggunaan tetap terbuka untuk semua pengunjung
  tanpa perlu akun, seperti sebelumnya.

## [0.2.0] — 2026-09-05

### Ditambahkan
- Menu **FAQ** baru (`/faq`) berisi tiga bagian dalam bentuk tab:
  - **Pertanyaan Umum** — kumpulan FAQ terkait donasi, infaq/sadaqah, zakat,
    kurban, laporan keuangan, bukti bayar, dan Kotak Saran.
  - **Buku Panduan Penggunaan** — panduan langkah-demi-langkah untuk jamaah
    memakai setiap fitur situs, bisa dibaca langsung di halaman atau diunduh
    sebagai PDF.
  - **Playbook Pengurus & Jamaah** — panduan operasional alur kerja pengurus
    (verifikasi donasi/infaq/zakat/kurban, kelola kampanye, pencatatan &
    pengesahan transaksi, dsb.), juga bisa dibaca di halaman atau diunduh PDF.
  - Unduhan PDF memakai modal pratinjau dalam aplikasi yang sudah ada
    (`DownloadLink`), supaya tetap berfungsi normal di aplikasi Android.
- `CHANGELOG.md` ini sendiri — dari versi ini dan seterusnya, setiap
  perubahan dicatat di sini dan versi `package.json` diperbarui mengikuti.

## [0.1.0] — s.d. 2026-09-05

Baseline sebelum log perubahan ini mulai dipakai secara rutin. Mencakup,
di antaranya: situs publik (Beranda, Profil & Pengurus, Jadwal Sholat,
Kegiatan, Pengumuman, Laporan Keuangan, Zakat, Kurban, Infaq & Sadaqah,
Donasi per kampanye, Kotak Saran); Dashboard pengurus dengan tiga peran
(Super Admin, Admin/Pengurus, Bendahara) mencakup pencatatan & pengesahan
transaksi keuangan, manajemen kampanye donasi (termasuk rekening tujuan
khusus dan penutupan kampanye dengan keterangan), manajemen jamaah,
pengguna, kegiatan, inventaris, dan pengumuman; laporan publik per
periode (bulanan) untuk donasi/infaq/zakat/kurban dengan unduhan CSV/PDF
dan bukti bayar digital otomatis; deployment ke Firebase App Hosting;
serta pembungkus aplikasi Android (Capacitor) dengan dukungan unduh
berkas dan tombol kembali native.
