"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Users,
  CalendarDays,
  Megaphone,
  Boxes,
  HandCoins,
  MessageSquareWarning,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Emblem } from "@/components/brand/Emblem";
import { ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { signOutAction } from "@/app/(dashboard)/actions";

type NavItem = { href: string; label: string; icon: React.ElementType; roles: Role[] };

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA", "JAMAAH"] },
  { href: "/dashboard/keuangan", label: "Keuangan", icon: Wallet, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"] },
  { href: "/dashboard/jamaah", label: "Jamaah", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/kegiatan", label: "Kegiatan", icon: CalendarDays, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/pengumuman", label: "Pengumuman", icon: Megaphone, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/inventaris", label: "Inventaris", icon: Boxes, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/zakat-kurban", label: "Zakat & Kurban", icon: HandCoins, roles: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"] },
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
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Navigasi dashboard">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-gold-500 text-brand-green-900"
                : "text-brand-cream-50/85 hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-green-900 lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <Emblem className="h-9 w-9" />
          <span className="font-display text-sm font-semibold text-white">Masjid ASABRI</span>
        </div>
        {nav}
        <div className="border-t border-white/10 p-3 text-xs text-brand-cream-50/60">
          Masuk sebagai <span className="font-semibold text-brand-cream-50">{ROLE_LABEL[role]}</span>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="relative flex w-64 flex-col bg-brand-green-900">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <Emblem className="h-9 w-9" />
                <span className="font-display text-sm font-semibold text-white">Masjid ASABRI</span>
              </div>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setMobileOpen(false)}
                className="text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-subtle bg-surface px-4 py-3 sm:px-6">
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-border-subtle p-2 text-brand-green-900 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="hidden text-sm font-medium text-foreground/70 lg:block">
            Selamat datang, <span className="text-brand-green-900">{userName}</span>
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-terracotta-700 hover:bg-brand-terracotta-100"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Keluar
            </button>
          </form>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
