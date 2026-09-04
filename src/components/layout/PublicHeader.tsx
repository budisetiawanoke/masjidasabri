import Link from "next/link";
import Image from "next/image";
import { Emblem } from "@/components/brand/Emblem";
import { LinkButton } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { ShieldCheck, LayoutDashboard } from "lucide-react";
import { auth } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil & Pengurus" },
  { href: "/jadwal-sholat", label: "Jadwal Sholat" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/laporan-keuangan", label: "Laporan Keuangan" },
  { href: "/zakat", label: "Zakat" },
  { href: "/kurban", label: "Kurban" },
  { href: "/infaq-sadaqah", label: "Infaq & Sadaqah" },
  { href: "/donasi", label: "Donasi" },
  { href: "/kotak-saran", label: "Kotak Saran" },
];

export async function PublicHeader() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 relative border-b border-border-subtle bg-brand-cream-50 shadow-xs">
      {/* Top Gold Ornament Border */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* Desktop Header View */}
      <div className="mx-auto hidden lg:flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <Emblem className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-brand-green-900 tracking-tight">
              Masjid ASABRI
            </span>
            <span className="block text-xs font-medium text-brand-green-700/80">Sistem Pengelolaan Jamaah</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green-900/85 transition-colors hover:bg-brand-green-100/80 hover:text-brand-green-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <LinkButton href="/dashboard" variant="gold" className="text-sm shadow-xs">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Dashboard
            </LinkButton>
          ) : (
            <LinkButton href="/login" variant="gold" className="text-sm shadow-xs">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Masuk
            </LinkButton>
          )}
        </div>
      </div>

      {/* Mobile App Header View (56px) according to "Desain Aplikasi Mobile Masjid ASABRI" */}
      <div className="flex lg:hidden items-center gap-3 px-4 py-3 h-[56px]">
        <MobileNav items={NAV} isLoggedIn={isLoggedIn} />
        <Image
          src="/img/logo-masjid-asabri.png"
          alt="Logo Masjid ASABRI"
          width={24}
          height={24}
          unoptimized
          className="w-6 h-6 object-contain shrink-0"
        />
        <span className="font-display font-bold text-brand-green-900 text-base truncate">
          Masjid ASABRI
        </span>
      </div>
    </header>
  );
}
