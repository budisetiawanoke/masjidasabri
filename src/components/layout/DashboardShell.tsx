"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Users,
  UsersRound,
  CalendarDays,
  Megaphone,
  Boxes,
  HandCoins,
  HandHeart,
  MessageSquareWarning,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Emblem } from "@/components/brand/Emblem";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { signOutAction } from "@/app/(dashboard)/actions";

type NavItem = { href: string; label: string; icon: React.ElementType; roles: Role[] };

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA", "JAMAAH"] },
  // Untuk Jamaah, arahkan ke halaman publik pengiriman saran (bukan
  // /dashboard/kotak-saran — itu halaman kelola tiket khusus Pengurus/Super
  // Admin yang menampilkan SEMUA tiket, bukan tempat Jamaah mengirim saran).
  // Tanpa ini Jamaah tidak punya cara menemukan Kotak Saran dari dalam
  // dashboard sama sekali, selain tautan kecil di kartu "Saran/Pengaduan
  // Saya" di halaman Ringkasan.
  { href: "/kotak-saran", label: "Kotak Saran", icon: MessageSquareWarning, roles: ["JAMAAH"] },
  { href: "/dashboard/keuangan", label: "Keuangan", icon: Wallet, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"] },
  { href: "/dashboard/jamaah", label: "Jamaah", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/pengurus", label: "Struktur Pengurus", icon: UsersRound, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/kegiatan", label: "Kegiatan", icon: CalendarDays, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/pengumuman", label: "Pengumuman", icon: Megaphone, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/inventaris", label: "Inventaris", icon: Boxes, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/zakat-kurban", label: "Zakat & Kurban", icon: HandCoins, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"] },
  { href: "/dashboard/infaq-donasi", label: "Infaq & Donasi", icon: HandHeart, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"] },
  { href: "/dashboard/kotak-saran", label: "Kotak Saran", icon: MessageSquareWarning, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/pengguna", label: "Pengguna", icon: UserCog, roles: ["SUPER_ADMIN"] },
  { href: "/dashboard/pengaturan", label: "Pengaturan Yayasan", icon: Settings, roles: ["SUPER_ADMIN"] },
];

export function DashboardShell({
  role,
  userName,
  children,
}: {
  role: Role;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Navigasi dashboard">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              active
                ? "bg-brand-gold-500 text-brand-green-950 shadow-md shadow-brand-gold-500/20 font-bold"
                : "text-brand-cream-50/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-brand-green-950" : "text-brand-gold-400"}`} aria-hidden />
              <span>{item.label}</span>
            </div>
            {active && <ChevronRight className="h-4 w-4 text-brand-green-950" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="relative hidden w-64 shrink-0 flex-col bg-gradient-to-b from-brand-green-950 to-brand-green-900 border-r border-brand-gold-500/30 lg:flex shadow-xl">
        <IslamicPattern className="opacity-5 text-brand-gold-300" />
        
        <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4 bg-brand-green-950/80">
          <Emblem className="h-9 w-9 shrink-0 drop-shadow-md" />
          <div>
            <span className="font-display text-base font-bold text-white block leading-none">Masjid ASABRI</span>
            <span className="text-[10px] text-brand-gold-300 uppercase tracking-wider font-semibold">Dashboard Internal</span>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col">{nav}</div>

        <div className="relative border-t border-white/10 p-4 bg-brand-green-950/90 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-gold-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-brand-cream-50/70 block">Peran Aktif:</span>
              <span className="font-bold text-brand-gold-300">{ROLE_LABEL[role]}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="relative flex w-64 flex-col bg-brand-green-950 text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <Emblem className="h-9 w-9" />
                <span className="font-display text-sm font-bold text-white">Masjid ASABRI</span>
              </div>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setMobileOpen(false)}
                className="text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between border-b border-border-subtle bg-surface px-4 py-3 sm:px-6 shadow-xs">
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-border-subtle p-2 text-brand-green-900 lg:hidden hover:bg-brand-green-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="hidden text-sm font-medium text-foreground/80 lg:block">
            Selamat datang kembali, <span className="font-bold text-brand-green-900">{userName}</span>
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl border border-brand-terracotta-500/30 px-3.5 py-1.5 text-xs font-bold text-brand-terracotta-700 hover:bg-brand-terracotta-100 transition-colors shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Keluar
            </button>
          </form>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
