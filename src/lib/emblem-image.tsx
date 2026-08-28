/**
 * Markup lambang Masjid ASABRI untuk dirender lewat `next/og` ImageResponse
 * (dipakai favicon `icon.tsx` dan ikon PWA/manifest `/api/pwa-icon`). Terpisah
 * dari `components/brand/Emblem.tsx` (SVG React biasa untuk UI halaman)
 * karena ImageResponse punya mesin layout sendiri (Satori) yang tidak
 * mendukung seluruh fitur SVG React normal.
 */
export function emblemImageMarkup({
  size,
  maskableSafePadding = 0,
}: {
  size: number;
  /** Padding ekstra (px) supaya lambang tidak terpotong saat OS meng-crop ikon jadi lingkaran/squircle (ikon "maskable"). */
  maskableSafePadding?: number;
}) {
  const innerSize = size - maskableSafePadding * 2;
  const glyphSize = innerSize * 0.63;

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
        }}
      >
        <svg width={glyphSize} height={glyphSize} viewBox="0 0 100 100">
          <path d="M20 68 L50 60 L80 68 L80 62 L50 54 L20 62 Z" fill="#0F3D2E" />
          <path d="M32 60 C32 40 68 40 68 60 Z" fill="none" stroke="#0F3D2E" strokeWidth="5" />
          <rect x="46" y="18" width="8" height="42" fill="#0F3D2E" />
          <circle cx="50" cy="14" r="4" fill="#0F3D2E" />
        </svg>
      </div>
    </div>
  );
}
