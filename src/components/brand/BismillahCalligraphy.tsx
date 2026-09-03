/**
 * Kaligrafi Bismillah — render SVG orisinal untuk header dan aksen bernuansa Islami
 */
export function BismillahCalligraphy({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className || ""}`}>
      <svg
        viewBox="0 0 500 90"
        className="w-full max-w-md h-auto fill-current text-brand-gold-500 opacity-90 drop-shadow-sm"
        aria-label="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
        role="img"
      >
        <title>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</title>
        {/* Calligraphic Arabic typography path / text for Bismillah */}
        <text
          x="250"
          y="55"
          textAnchor="middle"
          className="font-serif text-3xl font-bold tracking-widest fill-current"
          style={{ fontFamily: "var(--font-arabic), 'Traditional Arabic', 'Scheherazade New', 'Times New Roman', serif" }}
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </text>
      </svg>
    </div>
  );
}
