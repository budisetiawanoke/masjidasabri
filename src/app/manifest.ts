import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Masjid ASABRI — Yayasan Jatiasih",
    short_name: "Masjid ASABRI",
    description:
      "Jadwal sholat, laporan keuangan transparan, kegiatan, dan layanan Yayasan Masjid ASABRI Jatiasih.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7EE",
    theme_color: "#0F3D2E",
    orientation: "portrait-primary",
    lang: "id",
    icons: [
      { src: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/api/pwa-icon?size=192&maskable=1", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/api/pwa-icon?size=512&maskable=1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
