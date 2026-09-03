import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces, Amiri } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Naskh Arab untuk kaligrafi Bismillah (lihat components/brand/BismillahCalligraphy.tsx)
// — tanpa ini, teks Arab jatuh ke font sistem generik yang tidak punya bentuk
// kaligrafi Naskh yang layak.
const arabic = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Masjid ASABRI",
    template: "%s · Masjid ASABRI",
  },
  description:
    "Situs resmi & sistem pengelolaan Masjid ASABRI — jadwal sholat, laporan keuangan transparan, kegiatan, dan informasi pengurus.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Masjid ASABRI",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F3D2E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${display.variable} ${arabic.variable} h-full antialiased`}
      // Capacitor (di dalam APK Android) otomatis menyuntikkan variabel CSS
      // --safe-area-inset-* ke elemen <html> lewat plugin SystemBars bawaan
      // (lihat node_modules/@capacitor/core/system-bars.md) — akal-akalan
      // untuk bug env(safe-area-inset-*) di WebView Android lama. Ini terjadi
      // di client SEBELUM React hydrate, jadi selalu beda dari HTML hasil SSR
      // yang tidak (dan tidak bisa) tahu nilai itu. Ini bukan bug — nilainya
      // memang harus dipakai apa adanya dari native, bukan dicocokkan ke SSR.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
