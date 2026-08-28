# Riset — Aplikasi Manajemen Masjid Sejenis

Sumber: [emasjid.id](https://www.emasjid.id/aplikasi-manajemen-masjid), [taqmir.com](https://taqmir.com/fitur), [masjidbox.com](https://masjidbox.com/), [connectmazjid.com](https://connectmazjid.com/masjid-management-software/), [masjidaa.com](https://masjidaa.com/masjid-management-system/), [mymasjid.asia](https://mymasjid.asia/), plus pengetahuan domain umum sistem DKM/Yayasan masjid di Indonesia.

## 1. Matriks Fitur Utama

| # | Modul | Fitur inti yang ditemukan di produk sejenis | Prioritas MVP |
|---|-------|----------------------------------------------|---------------|
| 1 | **Keuangan** | Kas masuk/keluar per kategori (infaq, sedekah, zakat, wakaf, donasi pembangunan), saldo real-time, jurnal, buku besar, laporan arus kas ala ISAK 35, laporan publik untuk transparansi jamaah, export PDF/Excel, approval 2-langkah (dicatat bendahara → disahkan ketua/admin) | Wajib |
| 2 | **Jamaah/Donatur** | Database jamaah, segmentasi domisili/usia, riwayat donasi per orang, kartu anggota digital | Wajib |
| 3 | **Struktur Pengurus** | Profil yayasan, periode kepengurusan (mis. 2026–2030), jabatan & foto pengurus | Wajib |
| 4 | **Jadwal Sholat** | Jadwal sholat harian per lokasi, jadwal imsakiyah Ramadhan, jadwal khatib/imam Jumat | Wajib |
| 5 | **Kegiatan & Pengumuman** | Kalender kegiatan (kajian, TPA, PHBI), pengumuman/broadcast, galeri foto kegiatan | Wajib |
| 6 | **Inventaris & Aset** | Daftar aset masjid, kondisi, penanggung jawab, riwayat pemeliharaan | Penting |
| 7 | **Zakat & Kurban** | Kalkulator zakat maal/fitrah, pencatatan pekurban Idul Adha, distribusi mustahik | Penting |
| 8 | **Website Publik** | Landing page profil masjid, laporan keuangan publik, kontak & lokasi, ajakan donasi | Wajib |
| 9 | **Otorisasi & Peran** | Multi-role: Super Admin, Admin/Pengurus, Bendahara, Jamaah (Wajib) — isolasi data antar peran | Wajib |
| 10 | **Kotak Saran/Pengaduan** | Form saran/pengaduan jamaah ke pengurus | Bagus untuk ada |
| 11 | **Audit Trail** | Log setiap perubahan data keuangan untuk akuntabilitas | Wajib (menjawab kelemahan umum: banyak apps sejenis tidak transparan dalam audit trail) |
| 12 | **Notifikasi** | Pengumuman terbaru, saldo kas, jatuh tempo kegiatan | Penting |

## 2. Kelemahan Umum pada Produk Sejenis (celah yang harus diperbaiki)

- **Transparansi semu**: banyak app hanya menampilkan total saldo tanpa rincian kategori atau riwayat — jamaah tidak bisa memverifikasi. → Kami sediakan laporan publik granular per kategori & periode, dapat diunduh.
- **Tidak ada audit trail**: perubahan data keuangan tidak tercatat siapa/kapan. → Setiap transaksi keuangan immutable + log perubahan (soft-edit dengan riwayat, bukan overwrite).
- **RBAC lemah**: banyak app hanya membedakan "admin" vs "user" tanpa peran bendahara terpisah. → 4 peran eksplisit dengan izin granular per modul.
- **Gateway pembayaran editorial palsu**: beberapa demo mengklaim integrasi QRIS/pembayaran otomatis padahal sebenarnya manual. → Kami bangun modul pencatatan donasi (manual entry oleh bendahara/donatur konfirmasi transfer) yang jujur — bukan payment gateway sungguhan (butuh kredensial merchant yang tidak kami miliki), dengan QR statis berisi info rekening/kontak, bukan klaim proses pembayaran otomatis.
- **Ketergantungan API eksternal untuk jadwal sholat** tanpa fallback → Kami sediakan perhitungan lokal (algoritma hisab) sebagai fallback jika API publik (Aladhan) tidak dapat diakses.
- **Tidak accessible**: kontras rendah, tidak ada label ARIA. → Kami terapkan standar aksesibilitas (kontras AA, navigasi keyboard, ARIA).

## 3. Arsitektur (ringkas — detail di ARCHITECTURE.md)

- Next.js 15 (App Router, TypeScript) — satu codebase untuk website publik + dashboard admin.
- PostgreSQL via Prisma ORM di semua lingkungan (dev, test, produksi) — lihat docs/DEPLOYMENT.md untuk opsi hosting gratis.
- Auth.js (NextAuth) credentials + session JWT, RBAC middleware per rute.
- Tailwind CSS v4 dengan token warna & tipografi merek "Masjid ASABRI" diambil dari logo yang diunggah pengguna (hijau tua, emas/mustard, terracotta, krem).
- Testing: Vitest (unit), Playwright (E2E).

## 4. Rencana Pengembangan

Lihat [PLAN.md](./PLAN.md) untuk pembagian modul, kontrak teknis, dan urutan pengerjaan.
