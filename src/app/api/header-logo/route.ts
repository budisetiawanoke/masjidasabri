import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Menyajikan public/logo-masjid-asabri.png lewat route server — lihat
 * penjelasan lengkap di src/app/api/hero-image/route.ts (berkas public/
 * yang hanya direferensikan lewat string URL JSX tidak ter-bundle di
 * Firebase App Hosting; pola readFileSync ini meniru logo.png yang terbukti
 * bekerja).
 */
export async function GET() {
  const buffer = readFileSync(join(process.cwd(), "public", "logo-masjid-asabri.png"));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
