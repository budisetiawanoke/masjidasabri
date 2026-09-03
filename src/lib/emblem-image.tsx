/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Markup lambang Masjid ASABRI untuk dirender lewat `next/og` ImageResponse
 * (dipakai favicon `icon.tsx`/`apple-icon.tsx` dan ikon PWA/splash
 * `/api/pwa-icon`, `/api/splash-image`). Logo dibaca langsung dari
 * filesystem dan disematkan sebagai data URI — BUKAN URL `http://localhost`
 * (bug lama: hanya bekerja saat dev server jalan di port itu, gagal total
 * di produksi/serverless/APK karena Satori butuh gambar yang bisa diakses
 * tanpa jaringan atau lewat URL absolut yang benar-benar live).
 */
const logoDataUri = (() => {
  const buffer = readFileSync(join(process.cwd(), "public", "logo.png"));
  return `data:image/png;base64,${buffer.toString("base64")}`;
})();

export function emblemImageMarkup({
  size,
  maskableSafePadding = 0,
}: {
  size: number;
  maskableSafePadding?: number;
}) {
  const innerSize = size - maskableSafePadding * 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FBF7EE",
      }}
    >
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          background: "#FBF7EE",
          border: `${Math.max(2, innerSize * 0.045)}px solid #D4A72C`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: innerSize * 0.1,
        }}
      >
        <img
          src={logoDataUri}
          width={innerSize * 0.75}
          height={innerSize * 0.75}
          style={{ objectFit: "contain" }}
          alt="Masjid ASABRI"
        />
      </div>
    </div>
  );
}
