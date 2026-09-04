import type { CapacitorConfig } from "@capacitor/cli";

// Aplikasi Masjid ASABRI adalah aplikasi web server-rendered (autentikasi,
// server actions, database) — BUKAN situs statis yang bisa dibundel offline
// ke dalam APK. Jadi shell Android ini memuat `server.url` dari server yang
// sudah berjalan (lihat README.md bagian "Aplikasi Android"), bukan aset
// lokal di www/. Ganti CAPACITOR_SERVER_URL sesuai target build:
//   - Build uji coba lokal: URL tunnel sementara (mis. dari cloudflared)
//   - Build produksi: URL Firebase App Hosting/domain resmi yayasan (lihat
//     docs/DEPLOYMENT.md dan docs/ANDROID.md)
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "org.masjidasabri.app",
  appName: "Masjid ASABRI",
  webDir: "public", // tidak benar-benar dipakai (server.url override), tapi wajib diisi Capacitor
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith("http://"),
      }
    : undefined,
  android: {
    allowMixedContent: false,
  },
};

export default config;
