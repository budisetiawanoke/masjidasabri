"use client";

import { FileDown } from "lucide-react";

/**
 * Tautan unduh bukti bayar — dipakai di 4 form publik (donasi, infaq,
 * zakat, kurban) setelah submit berhasil.
 *
 * Kenapa bukan `<a href>` polos: di dalam APK Android (Capacitor WebView),
 * tautan unduhan berkas biasa TIDAK MELAKUKAN APA-APA saat diketuk —
 * WebView Android tidak punya download manager bawaan seperti browser
 * biasa (Chrome, Safari), jadi permintaan berkas dengan header
 * `Content-Disposition: attachment` (lihat src/app/api/bukti-bayar) hilang
 * begitu saja tanpa error yang terlihat. Solusinya: kalau berjalan di
 * dalam Capacitor (native), buka lewat plugin @capacitor/browser (Chrome
 * Custom Tabs di Android) — sistem Android-lah yang lalu menangani
 * unduhan/pratinjau PDF-nya dengan benar.
 *
 * `event.preventDefault()` WAJIB dipanggil SINKRON (bukan di dalam
 * `async`/`.then()`) — begitu handler ini return, browser sudah
 * memutuskan apakah navigasi default jalan atau tidak; memanggilnya
 * belakangan (setelah `await import(...)` selesai) sudah terlambat,
 * navigasi default sudah kepalang terjadi duluan. Makanya deteksi
 * platform & pemanggilan plugin dilakukan async DI DALAM, tapi
 * preventDefault-nya di luar/duluan.
 */
export function ReceiptDownloadLink({ url, className }: { url: string; className?: string }) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    void (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (Capacitor.isNativePlatform()) {
          const { Browser } = await import("@capacitor/browser");
          await Browser.open({ url });
          return;
        }
      } catch {
        // Deteksi platform/plugin gagal — lanjut ke jalur unduhan web biasa
        // di bawah, bukan dibiarkan diam tanpa aksi sama sekali.
      }
      // Di luar APK (browser web biasa): navigasi manual ke URL-nya —
      // browser menangani unduhan lewat header Content-Disposition,
      // perilakunya sama seperti <a href> bawaan yang tadi kita cegah.
      window.location.href = url;
    })();
  };

  return (
    <a href={url} onClick={handleClick} className={className}>
      <FileDown className="h-4 w-4" />
      Unduh Bukti Bayar
    </a>
  );
}
