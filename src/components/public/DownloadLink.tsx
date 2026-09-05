"use client";

import { useState, type ReactNode } from "react";
import { X, Download as DownloadIcon } from "lucide-react";

/**
 * Tombol unduh berkas (PDF/CSV) — dipakai di semua tombol unduh publik:
 * bukti bayar (donasi/infaq/zakat/kurban) dan laporan (keuangan + detail
 * per periode donasi/infaq/zakat/kurban).
 *
 * Ketuk tombol → muncul modal pratinjau di dalam aplikasi (bukan langsung
 * lompat ke aplikasi lain) berisi isi PDF (lewat <iframe>, WebView Android
 * modern bisa merender PDF langsung) atau pesan singkat untuk CSV, dengan
 * tombol "Unduh" dan "Tutup" — sesuai permintaan pengguna, supaya
 * pengalamannya tetap terasa di dalam aplikasi, bukan berpindah aplikasi
 * secara tiba-tiba.
 *
 * Tombol "Unduh" di dalam modal tetap `<a href>` biasa ke URL berkasnya —
 * begitu diketuk, WebView Android menyerahkan penanganannya ke
 * DownloadListener native (lihat
 * android/app/src/main/java/org/masjidasabri/app/MainActivity.java) yang
 * melempar ke aplikasi eksternal (Chrome/Google PDF Viewer) untuk
 * benar-benar menyimpan berkasnya — WebView sendiri tidak punya
 * kemampuan menyimpan berkas ke penyimpanan perangkat, jadi langkah itu
 * TETAP dibutuhkan meski sudah ada modal pratinjau ini.
 */
export function DownloadLink({
  href,
  className,
  children,
  title,
  kind,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /** Judul yang tampil di header modal, mis. "Bukti Bayar Infaq & Sadaqah". */
  title: string;
  /** "pdf" dirender lewat <iframe> (WebView modern bisa langsung menampilkan PDF); "csv" cuma pesan singkat (tidak ada pratinjau tabel di sini). */
  kind: "pdf" | "csv";
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
            className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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

            <div className="flex-1 overflow-auto bg-gray-100">
              {kind === "pdf" ? (
                <iframe src={href} title={title} className="h-full w-full border-0" />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-foreground/70">
                  Pratinjau tidak tersedia untuk berkas Excel/CSV — ketuk &quot;Unduh&quot; di bawah untuk membukanya.
                </div>
              )}
            </div>

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
