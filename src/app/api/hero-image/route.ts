import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Menyajikan public/masjid-foto-hero.jpg lewat route server, BUKAN lewat URL
 * statis langsung (`/masjid-foto-hero.jpg`). Ditemukan: di Firebase App
 * Hosting, berkas di `public/` yang HANYA direferensikan sebagai string URL
 * di JSX (`<Image src="...">`) tidak ikut ter-bundle ke server produksi dan
 * selalu 404 — kemungkinan besar karena adapter Next.js App Hosting hanya
 * menyertakan berkas yang terdeteksi lewat pelacakan kode (output file
 * tracing), yang cuma menangkap pemanggilan `readFileSync`/`fs` sungguhan,
 * bukan string URL di JSX. Pola `readFileSync` + path literal di bawah ini
 * meniru persis src/lib/emblem-image.tsx (logo.png) — satu-satunya berkas
 * public/ yang terbukti tersaji normal di App Hosting — supaya berkas ini
 * ikut terdeteksi & ter-bundle dengan cara yang sama.
 */
export async function GET() {
  const buffer = readFileSync(join(process.cwd(), "public", "masjid-foto-hero.jpg"));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
