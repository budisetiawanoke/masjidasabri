"use client";

import { useEffect } from "react";

/** Mendaftarkan service worker (lihat public/sw.js) — dipasang sekali di root layout. */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Kegagalan pendaftaran service worker tidak boleh mengganggu aplikasi
        // berjalan normal — aplikasi tetap berfungsi penuh tanpa PWA.
      });
    }
  }, []);

  return null;
}
