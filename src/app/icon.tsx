import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Ikon tab browser — versi ringkas lambang Masjid ASABRI (kubah & menara
// hijau tua di atas medali krem, cincin emas) agar tetap dikenali walau
// dirender kecil.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#FBF7EE",
          border: "4px solid #D4A72C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 100 100">
          <path d="M20 68 L50 60 L80 68 L80 62 L50 54 L20 62 Z" fill="#0F3D2E" />
          <path
            d="M32 60 C32 40 68 40 68 60 Z"
            fill="none"
            stroke="#0F3D2E"
            strokeWidth="5"
          />
          <rect x="46" y="18" width="8" height="42" fill="#0F3D2E" />
          <circle cx="50" cy="14" r="4" fill="#0F3D2E" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
