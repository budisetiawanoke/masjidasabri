# Changelog

Semua perubahan penting pada aplikasi Masjid ASABRI dicatat di sini. Format
mengikuti [Keep a Changelog](https://keepachangelog.com/), dan nomor versi
mengikuti [Semantic Versioning](https://semver.org/) — sesuai versi yang
ditampilkan di footer setiap halaman publik (`package.json` → `version`).

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
