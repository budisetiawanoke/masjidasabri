import Image from "next/image";

/**
 * Lambang Resmi Masjid ASABRI — Menggunakan aset gambar resmi dengan latar transparan
 * yang dipertajam dari foto asli logo Masjid ASABRI.
 */
export function Emblem({ className = "h-12 w-12", title = "Lambang Masjid ASABRI" }: { className?: string; title?: string }) {
  return (
    <Image
      src="/logo.png"
      alt={title}
      title={title}
      width={1600}
      height={1328}
      unoptimized
      className={`object-contain drop-shadow-md ${className}`}
    />
  );
}
