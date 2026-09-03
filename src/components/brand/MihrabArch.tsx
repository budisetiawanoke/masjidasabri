/**
 * MihrabArch — Ornamen Bentuk Lengkung Mihrab Masjid
 * Digunakan untuk bingkai gambar, header modul, atau latar kartu.
 */
export function MihrabArch({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-t-[3rem] rounded-b-2xl border border-brand-gold-500/30 ${className}`}>
      {/* Decorative Golden Arch Top Accent */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-500 via-brand-gold-300 to-brand-gold-500 z-10" />
      {children}
    </div>
  );
}
