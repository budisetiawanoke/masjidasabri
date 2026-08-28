import { ImageResponse } from "next/og";
import { emblemImageMarkup } from "@/lib/emblem-image";

// Gambar splash screen Android (dipakai sekali saat generate berkas statis
// android/app/src/main/res/drawable*/splash.png — lihat README bagian
// "Aplikasi Android"). Latar krem penuh + lambang di tengah, bukan lambang
// bulat generik Capacitor bawaan.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const width = Math.min(2000, Math.max(64, Number(url.searchParams.get("w")) || 480));
  const height = Math.min(2000, Math.max(64, Number(url.searchParams.get("h")) || 320));
  const emblemSize = Math.round(Math.min(width, height) * 0.42);

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF7EE",
        }}
      >
        {emblemImageMarkup({ size: emblemSize })}
      </div>
    ),
    { width, height }
  );
}
