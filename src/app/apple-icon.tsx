import { ImageResponse } from "next/og";
import { emblemImageMarkup } from "@/lib/emblem-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Ikon saat halaman disimpan ke Home Screen dari Safari iOS.
export default function AppleIcon() {
  return new ImageResponse(emblemImageMarkup({ size: 180 }), { ...size });
}
