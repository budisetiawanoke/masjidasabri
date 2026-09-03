import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js dev server (next dev) menolak permintaan cross-origin ke aset
  // /_next/* (JS chunk, HMR websocket, font) demi keamanan — hanya localhost
  // yang diizinkan bawaan. Wajib diizinkan di sini agar build APK/tunnel yang
  // menunjuk ke server dev (lihat docs/ANDROID.md) bisa memuat komponen client
  // (mis. MobileNav) dengan benar. TANPA ini, komponen client gagal hydrate
  // secara diam-diam saat diakses lewat tunnel — bug nyata yang ditemukan:
  // tombol menu burger tampak ada tapi tidak merespons ketukan sama sekali,
  // karena JS-nya diblokir sehingga onClick tidak pernah terpasang. Hanya
  // berlaku untuk `next dev` — tidak relevan di produksi (`next start`).
  allowedDevOrigins: ["*.trycloudflare.com"],

  // /zakat-kurban dipisah jadi /zakat dan /kurban (menu terpisah) — redirect
  // permanen supaya tautan/bookmark lama tetap terarah, bukan 404.
  async redirects() {
    return [{ source: "/zakat-kurban", destination: "/zakat", permanent: true }];
  },
};

export default nextConfig;
