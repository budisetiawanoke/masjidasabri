/**
 * Pola Geometris Ornamen Islami (8-pointed star lattice pattern)
 * Digunakan sebagai latar belakang dekoratif halus di Hero, Card, dan Section.
 */
export function IslamicPattern({ className = "opacity-10 text-brand-gold-500" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="islamic-star-pattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* 8-Pointed Star Motif */}
          <g fill="none" stroke="currentColor" strokeWidth="1">
            {/* Outer square 1 */}
            <rect x="15" y="15" width="30" height="30" />
            {/* Rotated square 2 */}
            <rect
              x="15"
              y="15"
              width="30"
              height="30"
              transform="rotate(45 30 30)"
            />
            {/* Inner detail circles */}
            <circle cx="30" cy="30" r="8" />
            <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.4" />
            {/* Connecting lines */}
            <line x1="0" y1="30" x2="60" y2="30" strokeDasharray="2 2" />
            <line x1="30" y1="0" x2="30" y2="60" strokeDasharray="2 2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
    </svg>
  );
}
