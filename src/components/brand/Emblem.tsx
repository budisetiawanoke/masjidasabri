/**
 * Lambang Yayasan Masjid ASABRI Jatiasih — render SVG orisinal terinspirasi
 * dari lencana resmi yayasan (menara & kubah masjid di atas buku terbuka,
 * diapit untaian padi emas dan sulur daun hijau, disatukan rantai
 * terracotta di dasar). Dipakai untuk header, favicon, dan materi cetak.
 */
export function Emblem({ className, title = "Lambang Yayasan Masjid ASABRI" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <circle cx="100" cy="100" r="96" fill="var(--brand-cream-50, #fbf7ee)" stroke="var(--brand-gold-500, #d4a72c)" strokeWidth="5" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="var(--brand-green-900, #0f3d2e)" strokeWidth="1.25" opacity="0.25" />

      {/* Ranting padi — kiri */}
      <g stroke="var(--brand-gold-500, #d4a72c)" strokeWidth="2.5" fill="var(--brand-gold-500, #d4a72c)" strokeLinecap="round">
        <path d="M62 148 C48 130 44 100 54 70" fill="none" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const t = i / 5;
          const y = 148 - t * 78;
          const x = 62 - t * 10 + Math.sin(t * 3) * 4;
          return (
            <ellipse
              key={i}
              cx={x - 10}
              cy={y}
              rx="8"
              ry="4"
              transform={`rotate(-35 ${x - 10} ${y})`}
            />
          );
        })}
      </g>

      {/* Sulur daun — kanan */}
      <g stroke="var(--brand-green-700, #1d5c42)" strokeWidth="2.5" fill="var(--brand-green-700, #1d5c42)" strokeLinecap="round">
        <path d="M138 148 C152 130 156 100 146 70" fill="none" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const t = i / 5;
          const y = 148 - t * 78;
          const x = 138 + t * 10 - Math.sin(t * 3) * 4;
          return (
            <ellipse
              key={i}
              cx={x + 10}
              cy={y}
              rx="8"
              ry="5"
              transform={`rotate(35 ${x + 10} ${y})`}
            />
          );
        })}
      </g>

      {/* Rantai penghubung di dasar */}
      <g stroke="var(--brand-terracotta-500, #c1502e)" strokeWidth="3.5" fill="none">
        <ellipse cx="82" cy="151" rx="7" ry="5" />
        <ellipse cx="94" cy="151" rx="7" ry="5" />
        <ellipse cx="106" cy="151" rx="7" ry="5" />
        <ellipse cx="118" cy="151" rx="7" ry="5" />
      </g>

      {/* Buku terbuka */}
      <path
        d="M45 140 L100 126 L155 140 L155 132 L100 118 L45 132 Z"
        fill="var(--brand-green-900, #0f3d2e)"
      />

      {/* Kubah */}
      <path
        d="M70 126 C70 96 130 96 130 126 Z"
        fill="none"
        stroke="var(--brand-green-900, #0f3d2e)"
        strokeWidth="3"
      />
      <path
        d="M74 122 C84 104 116 104 126 122 M78 126 C86 108 114 108 122 126 M100 100 L100 126 M82 126 C88 112 90 108 100 106 M118 126 C112 112 110 108 100 106"
        fill="none"
        stroke="var(--brand-green-900, #0f3d2e)"
        strokeWidth="1.75"
        opacity="0.85"
      />

      {/* Menara */}
      <path
        d="M96 118 L96 62 C96 58 100 52 100 52 C100 52 104 58 104 62 L104 118 Z"
        fill="none"
        stroke="var(--brand-green-900, #0f3d2e)"
        strokeWidth="3"
      />
      <path d="M100 40 L100 52 M97 44 L103 44" stroke="var(--brand-green-900, #0f3d2e)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="37" r="2.5" fill="var(--brand-green-900, #0f3d2e)" />
    </svg>
  );
}
