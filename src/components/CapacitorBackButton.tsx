"use client";

import { useEffect } from "react";

/**
 * Tombol back fisik/gestur Android bawaan langsung MENUTUP aplikasi (default
 * Capacitor) alih-alih mundur ke halaman sebelumnya di dalam WebView — beda
 * dari ekspektasi pengguna Android pada umumnya. Komponen ini pasang listener
 * `backButton` (plugin @capacitor/app) untuk memundurkan riwayat navigasi
 * WebView dulu kalau ada, dan baru keluar aplikasi kalau sudah di halaman
 * paling awal (tidak ada lagi riwayat untuk dimundurkan).
 *
 * Tidak berpengaruh apa pun di luar Capacitor (mis. dibuka lewat browser
 * biasa) — import @capacitor/app di-skip kalau bukan native platform.
 */
export function CapacitorBackButton() {
  useEffect(() => {
    let removeListener: (() => void) | undefined;
    let cancelled = false;

    import("@capacitor/core").then(async ({ Capacitor }) => {
      if (cancelled || !Capacitor.isNativePlatform()) return;

      const { App } = await import("@capacitor/app");
      const handle = await App.addListener("backButton", () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
      if (cancelled) {
        handle.remove();
      } else {
        removeListener = () => handle.remove();
      }
    });

    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, []);

  return null;
}
