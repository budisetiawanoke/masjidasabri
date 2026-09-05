"use client";

import { useState, type ReactNode } from "react";
import { X, Download as DownloadIcon } from "lucide-react";

/**
 * Tombol unduh berkas (PDF/CSV) — dipakai di semua tombol unduh publik:
 * bukti bayar (donasi/infaq/zakat/kurban) dan laporan (keuangan + detail
 * per periode donasi/infaq/zakat/kurban).
 *
 * Ketuk tombol → muncul modal pratinjau di dalam aplikasi berisi
 * `previewContent` (HTML biasa, dioper oleh pemanggil — lihat
 * ReceiptPreviewCard.tsx untuk bukti bayar, atau tabel yang sudah ada di
 * halaman untuk laporan), dengan tombol "Unduh" dan "Tutup".
 *
 * RIWAYAT (jangan ulangi — sudah 4 percobaan sebelum versi ini):
 *   1. `<a href>` polos → diam saja di APK.
 *   2. Plugin @capacitor/browser → membuat aplikasi hang.
 *   3. `window.open(url, "_system")` → diam saja lagi (WebView tanpa
 *      dukungan multi-window tidak benar-benar menavigasi).
 *   4. Modal dengan `<iframe src={pdfUrl}>` untuk pratinjau → modal
 *      terbuka tapi ISINYA KOSONG di WebView Android (dites di Samsung
 *      S24 Ultra) — WebView Android TIDAK PUNYA renderer PDF bawaan
 *      untuk konten ter-embed seperti iframe/embed, beda dari Chrome
 *      desktop yang punya plugin PDF sendiri.
 *
 * Solusi final: pratinjau dirender sebagai HTML BIASA (bukan menyisipkan
 * berkas PDF apa pun) — bekerja identik di semua platform tanpa
 * bergantung pada dukungan renderer PDF apa pun. Tombol "Unduh" di dalam
 * modal tetap `<a href>` biasa ke URL berkas sungguhan — begitu diketuk,
 * WebView menyerahkan penanganannya ke DownloadListener native (lihat
 * android/app/src/main/java/org/masjidasabri/app/MainActivity.java) yang
 * melempar ke aplikasi eksternal (Chrome/Google PDF Viewer) untuk
 * benar-benar menyimpan berkasnya.
 */
export function DownloadLink({
  href,
  className,
  children,
  title,
  previewContent,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /** Judul yang tampil di header modal, mis. "Bukti Bayar Infaq & Sadaqah". */
  title: string;
  /** Isi pratinjau (HTML biasa) — lihat komentar di atas soal kenapa bukan PDF. */
  previewContent: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle p-4">
              <h3 className="truncate text-sm font-bold text-brand-green-900">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="rounded-full p-1.5 text-foreground/60 hover:bg-brand-cream-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto">{previewContent}</div>

            <div className="flex items-center justify-end gap-2 border-t border-border-subtle p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground/70 hover:bg-brand-cream-50 transition-colors"
              >
                Tutup
              </button>
              <a
                href={href}
                className="flex items-center gap-1.5 rounded-xl bg-brand-green-900 px-4 py-2 text-sm font-bold text-white hover:bg-brand-green-700 transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Unduh
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
