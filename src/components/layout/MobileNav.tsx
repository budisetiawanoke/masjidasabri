"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Clock,
  TrendingUp,
  Calendar,
  Coins,
  HeartHandshake,
  HandCoins,
  HandHeart,
  Pin,
  UsersRound,
  MessageSquareWarning,
  Circle,
  Lock,
  LogOut,
  LayoutDashboard,
  X,
} from "lucide-react";

// Ikon per tautan, dicocokkan lewat href (bukan label) — supaya tetap benar
// walau label berubah. Item baru yang tidak terdaftar di sini masih tampil
// (fallback ke ikon generik) alih-alih hilang diam-diam dari drawer, seperti
// yang sebelumnya terjadi saat drawer ini hardcode subset link secara
// terpisah dari daftar NAV asli (Profil & Pengurus dan Kotak Saran hilang
// dari menu mobile karena tidak ikut di-hardcode).
const ICON_BY_HREF: Record<string, React.ElementType> = {
  "/": Home,
  "/profil": UsersRound,
  "/jadwal-sholat": Clock,
  "/kegiatan": Calendar,
  "/pengumuman": Pin,
  "/laporan-keuangan": TrendingUp,
  "/zakat": Coins,
  "/kurban": HeartHandshake,
  "/infaq-sadaqah": HandCoins,
  "/donasi": HandHeart,
  "/kotak-saran": MessageSquareWarning,
};

export function MobileNav({
  items = [],
  isLoggedIn = false,
}: {
  items?: { href: string; label: string }[];
  isLoggedIn?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/*
        Sederhanakan tombol sepenuhnya:
        - Hindari preventDefault/stopPropagation dan touchEvent kompleks yang sering bentrok di WebView.
        - Gunakan onClick standar yang dijamin 100% jalan di semua peramban sejak dulu.
      */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-green-900/20 bg-surface text-brand-green-900 active:bg-brand-green-100 cursor-pointer"
      >
        {open ? (
          <X className="h-6 w-6 text-brand-terracotta-700" />
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="7" x2="20" y2="7"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="17" x2="20" y2="17"></line>
          </svg>
        )}
      </button>

      {/*
        Drawer Menu:
        - Dirender langsung inline (tanpa React Portal yang rentan gagal hidrasi/rendering di WebView).
        - Menggunakan `fixed inset-0` dengan z-index tinggi untuk menutup layar secara penuh.
      */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
        >
          {/* Backdrop gelap */}
          <div
            className="fixed inset-0 bg-black/60 cursor-pointer"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Kontainer Drawer Kiri */}
          <aside
            className="relative z-[10000] flex w-[260px] max-w-[80vw] h-full flex-col bg-[#122019] text-white p-5 shadow-2xl space-y-4 overflow-y-auto"
            style={{ zIndex: 10000 }}
          >
            {/* Header Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/assets/logo-masjid-asabri.png"
                  alt="Logo Masjid ASABRI"
                  width={28}
                  height={28}
                  unoptimized
                  className="w-7 h-7 object-contain"
                />
                <div className="leading-tight">
                  <strong className="font-display font-semibold text-sm text-white block">
                    Masjid ASABRI
                  </strong>
                  <span className="text-[10px] text-white/60 block">
                    Sistem Pengelolaan Jamaah
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col gap-1.5 text-sm font-semibold" aria-label="Navigasi mobile">
              {items.map((item) => {
                const Icon = ICON_BY_HREF[item.href] ?? Circle;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-white/90 hover:bg-white/10 hover:text-white transition-colors active:bg-white/20"
                  >
                    <Icon className="h-4.5 w-4.5 text-brand-gold-400 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="h-px bg-white/10 my-2" />

              {!isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-brand-gold-300 hover:bg-white/10 transition-colors active:bg-white/20 font-bold"
                >
                  <Lock className="h-4.5 w-4.5 text-brand-gold-400 shrink-0" />
                  <span>Masuk Pengurus</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-brand-gold-300 hover:bg-white/10 transition-colors active:bg-white/20 font-bold"
                  >
                    <LayoutDashboard className="h-4.5 w-4.5 text-brand-gold-400 shrink-0" />
                    <span>Dashboard Pengurus</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-brand-terracotta-500 hover:bg-white/10 transition-colors active:bg-white/20 font-bold"
                  >
                    <LogOut className="h-4.5 w-4.5 shrink-0" />
                    <span>Keluar</span>
                  </Link>
                </>
              )}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
