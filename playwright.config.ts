import { defineConfig, devices } from "@playwright/test";

// Penjaga: E2E menulis data SUNGGUHAN (kampanye uji, transaksi uji, dst.) ke
// server dev yang dijalankan Playwright, dan server dev itu memakai
// DATABASE_URL dari .env — yang menurut keputusan sadar di
// docs/DEPLOYMENT.md ("Dev lokal = Supabase") adalah database YANG SAMA
// dengan produksi. Tanpa penjaga ini, setiap `npm run test:e2e` pernah
// meninggalkan kampanye "Kampanye Uji E2E ..." yang tampil ke jamaah
// sungguhan di /donasi (kejadian nyata, dibersihkan manual — lihat riwayat
// git). Jadi: wajib arahkan tes ke database pengujian terpisah lewat
// TEST_DATABASE_URL, atau nyatakan sengaja lewat E2E_ALLOW_SHARED_DB=1.
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const testDirectUrl = process.env.TEST_DIRECT_URL ?? testDatabaseUrl;
const allowSharedDb = process.env.E2E_ALLOW_SHARED_DB === "1";

if (!testDatabaseUrl && !allowSharedDb) {
  throw new Error(
    [
      "",
      "E2E test diblokir: belum ada database khusus pengujian yang diset.",
      "",
      "Playwright akan menjalankan `npm run dev`, dan server itu menulis data uji",
      "(kampanye, transaksi, tiket saran, dst.) langsung ke DATABASE_URL di .env —",
      "yang SAMA dengan database yang dilihat jamaah sungguhan di situs live.",
      "Ini pernah membuat kampanye uji nyasar tampil di halaman /donasi publik.",
      "",
      "Pilih salah satu sebelum menjalankan tes lagi:",
      "  1. (Disarankan) Buat database Postgres/Supabase terpisah khusus",
      "     pengujian, lalu jalankan:",
      "       TEST_DATABASE_URL=... TEST_DIRECT_URL=... npm run test:e2e",
      "  2. Kalau memang sengaja mau menguji ke database yang sama (tidak",
      "     disarankan, dan wajib dibersihkan manual setelahnya), jalankan:",
      "       E2E_ALLOW_SHARED_DB=1 npm run test:e2e",
      "",
    ].join("\n")
  );
}

if (allowSharedDb && !testDatabaseUrl) {
  console.warn(
    "\n⚠️  E2E_ALLOW_SHARED_DB=1 — tes ini akan menulis data uji ke database " +
      "produksi (DATABASE_URL di .env). Bersihkan manual setelah selesai.\n"
  );
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // alur berbagi satu database dev — jalankan berurutan agar tidak saling mengganggu
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
    // Kalau TEST_DATABASE_URL diset, paksa server dev yang dijalankan
    // Playwright memakainya (menimpa .env) — TAPI cuma berlaku kalau
    // Playwright benar-benar menyalakan server baru. Kalau `npm run dev`
    // sudah berjalan duluan di terminal lain, `reuseExistingServer: true`
    // di atas membuat Playwright memakai server itu apa adanya (dengan
    // DATABASE_URL yang sudah dipakainya) — matikan dulu server lama
    // kalau mau memastikan tes benar-benar memakai database pengujian.
    env: testDatabaseUrl
      ? { DATABASE_URL: testDatabaseUrl, DIRECT_URL: testDirectUrl! }
      : undefined,
  },
});
