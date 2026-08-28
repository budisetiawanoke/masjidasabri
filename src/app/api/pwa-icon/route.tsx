import { ImageResponse } from "next/og";
import { emblemImageMarkup } from "@/lib/emblem-image";

// Ikon PWA ukuran dinamis (dipakai manifest.ts) — mendukung mode "maskable"
// (Android meng-crop ikon jadi lingkaran/squircle sesuai tema perangkat,
// jadi lambang perlu diberi padding aman supaya tidak terpotong).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const size = Math.min(1024, Math.max(32, Number(url.searchParams.get("size")) || 512));
  const maskable = url.searchParams.get("maskable") === "1";

  return new ImageResponse(
    emblemImageMarkup({ size, maskableSafePadding: maskable ? size * 0.12 : 0 }),
    { width: size, height: size }
  );
}
