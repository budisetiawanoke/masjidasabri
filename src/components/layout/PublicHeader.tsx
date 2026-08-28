import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { LinkButton } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil & Pengurus" },
  { href: "/jadwal-sholat", label: "Jadwal Sholat" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/laporan-keuangan", label: "Laporan Keuangan" },
  { href: "/zakat-kurban", label: "Zakat & Kurban" },
  { href: "/kotak-saran", label: "Kotak Saran" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-brand-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Emblem className="h-11 w-11 shrink-0" />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-brand-green-900 sm:text-lg">
              Masjid ASABRI
            </span>
            <span className="block text-xs text-foreground/70">Yayasan Jatiasih · 2026–2030</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green-900/80 hover:bg-brand-green-100 hover:text-brand-green-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LinkButton href="/login" variant="gold" className="text-sm">
            Masuk
          </LinkButton>
        </div>

        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
