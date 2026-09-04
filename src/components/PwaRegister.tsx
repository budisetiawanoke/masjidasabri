"use client";

import { useEffect } from "react";

/**
 * Mendaftarkan service worker (lihat public/sw.js, disajikan lewat
 * src/app/api/sw/route.ts — bukan URL statis /sw.js langsung, lihat
 * komentar di route itu untuk alasannya) — dipasang sekali di root layout.
 */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/api/sw", { scope: "/" }).catch(() => {
        // Kegagalan pendaftaran service worker tidak boleh mengganggu aplikasi
        // berjalan normal — aplikasi tetap berfungsi penuh tanpa PWA.
      });
    }
  }, []);

  return null;
}
