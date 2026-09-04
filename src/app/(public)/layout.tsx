import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { getFoundationProfile } from "@/server/foundation/service";

// Layout ini membaca database (profil yayasan, untuk footer) dan dipakai
// oleh SEMUA halaman publik — termasuk yang sendirinya tidak query DB
// (mis. /kurban, /zakat, /kotak-saran, /infaq-sadaqah). "dynamic" di
// layout ikut berlaku untuk semua halaman anaknya, jadi cukup dipasang
// di sini agar tidak perlu diulang manual di tiap halaman. Alasan
// lengkap render dinamis (bukan pre-render statis saat build): lihat
// src/app/(public)/page.tsx — kasus nyata yang ditemukan: build gagal
// dengan "Environment variable not found: DATABASE_URL" karena
// prerender /infaq-sadaqah tetap memanggil getFoundationProfile() lewat
// layout ini walau halamannya sendiri sudah ditandai dinamis.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getFoundationProfile();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter address={profile.address} phone={profile.phone} email={profile.email} />
    </div>
  );
}
