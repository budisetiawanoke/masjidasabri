import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Menyajikan public/masjid-asabri.apk lewat route server — pola sama
 * seperti /api/header-logo, /api/hero-image, dst. (lihat penjelasan di
 * src/app/api/hero-image/route.ts): berkas public/ yang HANYA dirujuk
 * lewat string URL JSX/href tidak ikut ter-bundle oleh Next.js output file
 * tracing di Firebase App Hosting — readFileSync dengan path literal ini
 * memaksa berkasnya ikut terbawa saat deploy.
 *
 * Berkas APK-nya sendiri: hasil `./gradlew assembleRelease` di android/,
 * ditandatangani dengan kunci rilis (android/app/masjidasabri-release.keystore,
 * TIDAK di-commit — lihat android/keystore.properties & android/.gitignore).
 * Perbarui berkas ini secara manual (timpa public/masjid-asabri.apk) setiap
 * kali ada rilis APK baru; lihat docs/DEPLOYMENT.md untuk langkah lengkapnya.
 */
export async function GET() {
  const buffer = readFileSync(join(process.cwd(), "public", "masjid-asabri.apk"));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.android.package-archive",
      "content-disposition": 'attachment; filename="MasjidASABRI.apk"',
      "cache-control": "public, max-age=3600",
    },
  });
}
