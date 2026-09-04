import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Menyajikan public/sw.js (service worker PWA) lewat route server — lihat
 * penjelasan lengkap di src/app/api/hero-image/route.ts (berkas public/
 * yang hanya direferensikan lewat string URL, bukan readFileSync eksplisit,
 * tidak ter-bundle di Firebase App Hosting dan selalu 404).
 *
 * Header `Service-Worker-Allowed: /` WAJIB ada — service worker yang
 * didaftarkan dari path selain root (di sini /api/sw, bukan /sw.js) secara
 * default hanya boleh mengontrol scope path itu sendiri (/api/*). Header ini
 * memberi izin eksplisit ke browser supaya scope-nya tetap bisa "/" (seluruh
 * situs), sama seperti kalau file-nya betulan di /sw.js. Lihat pendaftaran
 * di src/components/PwaRegister.tsx (opsi `scope: "/"` di
 * `register()` harus disertakan juga, header saja tidak cukup).
 */
export async function GET() {
  const buffer = readFileSync(join(process.cwd(), "public", "sw.js"));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-cache",
      "service-worker-allowed": "/",
    },
  });
}
