import type { ReactNode } from "react";

/**
 * Tautan unduh berkas (PDF/CSV) — dipakai di semua tombol unduh publik:
 * bukti bayar (donasi/infaq/zakat/kurban) dan laporan detail per periode.
 *
 * RIWAYAT BUG (jangan ulangi — sudah dicoba 3 pendekatan sebelum ini):
 *   1. `<a href>` polos tanpa perbaikan apa pun di sisi native → diam
 *      saja, tidak terjadi apa-apa saat diketuk di APK.
 *   2. Plugin @capacitor/browser (`Browser.open()`) → JUSTRU MEMBUAT
 *      SELURUH APLIKASI HANG/MACET saat diketuk.
 *   3. `window.open(url, "_system")` tanpa dukungan multi-window di
 *      WebView → kembali diam saja (window.open kemungkinan tidak
 *      melakukan navigasi apa pun tanpa WebChromeClient.onCreateWindow
 *      / setSupportMultipleWindows di sisi native).
 *
 * Perbaikan yang benar ternyata di level NATIVE, bukan JavaScript:
 * WebView Android butuh `DownloadListener` eksplisit untuk tahu harus
 * berbuat apa saat menemukan respons unduhan (Content-Disposition:
 * attachment) — tanpa itu, PERILAKU BAWAAN WebView memang diam saja,
 * apa pun cara JS memicu navigasinya. Lihat
 * android/app/src/main/java/org/masjidasabri/app/MainActivity.java —
 * DownloadListener di sana melempar permintaan unduhan ke aplikasi
 * eksternal (Chrome, dll.) lewat Intent.ACTION_VIEW.
 *
 * Karena perbaikannya di native, komponen ini sekarang CUKUP jadi
 * `<a href>` biasa — navigasi WebView standar itu sendiri yang memicu
 * DownloadListener. Tetap dijadikan komponen (bukan `<a>` langsung di
 * tiap tempat pakai) supaya kalau suatu saat perlu penyesuaian lagi,
 * cukup ubah satu tempat.
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
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
