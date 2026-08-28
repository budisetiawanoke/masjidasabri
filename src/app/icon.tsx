import { ImageResponse } from "next/og";
import { emblemImageMarkup } from "@/lib/emblem-image";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Ikon tab browser — versi ringkas lambang Masjid ASABRI (kubah & menara
// hijau tua di atas medali krem, cincin emas) agar tetap dikenali walau
// dirender kecil.
export default function Icon() {
  return new ImageResponse(emblemImageMarkup({ size: 64 }), { ...size });
}
