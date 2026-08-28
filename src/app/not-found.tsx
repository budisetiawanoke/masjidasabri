import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream-50 px-4 text-center">
      <Emblem className="h-16 w-16" />
      <h1 className="mt-6 font-display text-2xl font-semibold text-brand-green-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 max-w-sm text-sm text-foreground/70">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-green-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
