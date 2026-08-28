# Arsitektur — Masjid ASABRI

## Identitas Merek

Diambil dari logo "Pengurus Yayasan Masjid ASABRI Jatiasih 2026–2030" yang diunggah pengguna:

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--brand-green-900` | `#0F3D2E` | Teks utama, header, ikon menara/kubah |
| `--brand-green-700` | `#1D5C42` | Aksen sekunder, tombol hover |
| `--brand-gold-500` | `#D4A72C` | Aksen utama (ranting padi), border, badge periode |
| `--brand-gold-300` | `#E8C765` | Highlight, hover ringan |
| `--brand-terracotta-500` | `#C1502E` | Aksen rantai — dipakai hemat untuk elemen "penghubung" (link, status aktif) |
| `--brand-cream-50` | `#FBF7EE` | Latar halaman |
| `--brand-ink-900` | `#14231B` | Teks body gelap |

Nama produk: **Masjid ASABRI** (nama file/kode: `masjid-asabri`). Tipografi: display serif-tegas untuk judul (mirip ukiran logo), sans-serif netral untuk body (Plus Jakarta Sans / Inter via next/font, self-hosted — tanpa dependensi CDN eksternal saat runtime produksi).

## Struktur Teknis

```
apps/web            → Next.js 15 App Router, TypeScript, satu codebase (situs publik + dashboard admin)
  src/app/(public)   → landing, profil, jadwal sholat, laporan keuangan publik, kegiatan, kontak
  src/app/(dashboard)→ area admin (butuh sesi + role)
  src/app/api        → route handlers (REST-ish) dipakai oleh server actions & fetch client
  src/server         → logic domain: services per modul (finance, membership, events, inventory, zakat)
  src/lib            → auth, prisma client, rbac, validation (zod), utils
  prisma/schema.prisma
  tests/             → vitest unit + playwright e2e
```

## Model Data Inti (ringkas — skema penuh di `prisma/schema.prisma`)

- `User` (role: SUPER_ADMIN | ADMIN | BENDAHARA | JAMAAH), `Session`
- `FoundationProfile` — profil yayasan, periode kepengurusan, alamat
- `BoardMember` — struktur pengurus per periode
- `Member` (Jamaah/donatur) — data domisili, kontak
- `TransactionCategory` (Infaq, Sedekah, Zakat, Wakaf, Pembangunan, Operasional, ...)
- `Transaction` — kas masuk/keluar, immutable + `TransactionRevision` (audit trail, bukan overwrite)
- `FundBalance` (materialized per kategori, dihitung dari transaksi — bukan sumber kebenaran, hanya cache)
- `Event` — kegiatan/kajian, `Announcement` — pengumuman
- `InventoryItem` — aset masjid + `MaintenanceLog`
- `ZakatRecord`, `QurbanRecord`
- `SuggestionTicket` — kotak saran/pengaduan
- `AuditLog` — generic log lintas modul (actor, action, entity, before/after, timestamp)

## Otorisasi (RBAC)

| Rute/Aksi | SUPER_ADMIN | ADMIN | BENDAHARA | JAMAAH |
|---|---|---|---|---|
| Kelola user & role | ✅ | ❌ | ❌ | ❌ |
| Catat transaksi keuangan | ✅ | ❌ | ✅ | ❌ |
| Sahkan/kunci laporan bulanan | ✅ | ✅ | ❌ | ❌ |
| Kelola kegiatan/pengumuman | ✅ | ✅ | ❌ | ❌ |
| Kelola inventaris | ✅ | ✅ | ❌ | ❌ |
| Lihat laporan keuangan publik | ✅ | ✅ | ✅ | ✅ (read-only, teragregasi) |
| Kirim saran/pengaduan | ✅ | ✅ | ✅ | ✅ |
| Lihat data pribadi jamaah lain | ❌ | ❌ | ❌ | ❌ (isolasi data — hanya lihat data sendiri) |

Middleware Next.js memeriksa sesi + role di level route group `(dashboard)`; server actions memvalidasi ulang role di server (tidak percaya klien).

## Prayer Times (Jadwal Sholat)

- Sumber utama: Aladhan API (publik, tanpa API key) berdasarkan koordinat masjid.
- Fallback: perhitungan lokal (algoritma hisab standar Kemenag-like — sudut matahari) bila fetch gagal, agar fitur tidak rusak total tanpa internet.

## Keputusan yang Sengaja Dihindari (butuh kredensial/aksi eksternal)

- **Tidak** mengimplementasikan payment gateway sungguhan (Midtrans/QRIS resmi) — butuh kredensial merchant milik yayasan yang tidak tersedia. Modul donasi mencatat transfer manual + menampilkan info rekening/QRIS statis yang bisa diunggah admin (gambar), bukan proses pembayaran otomatis palsu.
- **Tidak** mengirim email/SMS sungguhan tanpa kredensial SMTP/provider — notifikasi in-app dulu, dengan titik integrasi jelas (`src/lib/notify.ts`) untuk dicolokkan kredensial nanti.
