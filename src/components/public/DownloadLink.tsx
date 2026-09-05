"use client";

import type { ReactNode, MouseEvent } from "react";

/**
 * Tautan unduh berkas (PDF/CSV) — dipakai di semua tombol unduh publik:
 * bukti bayar (donasi/infaq/zakat/kurban) dan laporan detail per periode.
 *
 * RIWAYAT BUG (jangan ulangi): `<a href>` polos ke URL unduhan (header
 * Content-Disposition: attachment) TIDAK BOLEH dinavigasi langsung di
 * dalam WebView Android (Capacitor) — pernah dicoba dua pendekatan dan
 * DUA-DUANYA bermasalah:
 *   1. `<a href>` polos → diam saja, tidak terjadi apa-apa saat diketuk.
 *   2. Plugin @capacitor/browser (`Browser.open()`) → JUSTRU MEMBUAT
 *      SELURUH APLIKASI HANG/MACET saat diketuk (kemungkinan panggilan
 *      async ke native yang tidak pernah selesai/gagal diam-diam).
 *
 * Solusi yang aman: `window.open(url, "_system")`. Capacitor SECARA
 * BAWAAN (tanpa plugin tambahan apa pun) mencegat pemanggilan window.open
 * dengan target "_system" dan mendelegasikannya ke browser sistem
 * (Chrome, dst.) lewat Android Intent — SEPENUHNYA di luar WebView
 * aplikasi, tanpa ada panggilan async ke native yang bisa macet/hang.
 * Di browser web biasa, window.open tetap bekerja normal (membuka tab
 * baru yang langsung memicu unduhan lewat Content-Disposition).
 */
export function DownloadLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(href, "_system");
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
