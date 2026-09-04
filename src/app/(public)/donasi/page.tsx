import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { DonationForm } from "@/app/(public)/donasi/DonationForm";
import { listActiveCampaigns } from "@/server/donations/service";
import { HandHeart } from "lucide-react";

export const metadata: Metadata = { title: "Donasi" };
// Render dinamis (bukan pre-render statis) — lihat penjelasan lengkap di
// src/app/(public)/page.tsx. Progres kampanye donasi juga harus selalu
// terbaru per kunjungan, bukan cache beberapa menit.
export const dynamic = "force-dynamic";

export default async function DonasiPage() {
  const campaigns = await listActiveCampaigns();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-gold-500 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <HandHeart className="h-5 w-5 text-brand-gold-600" />
            Donasi
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Salurkan donasi untuk kebutuhan tertentu sesuai kampanye yang sedang berjalan — mis. bantuan
            bencana alam, bela Palestina, atau pembangunan masjid. Transfer ke rekening resmi yayasan
            (lihat halaman Beranda), lalu catat pengiriman Anda di sini beserta bukti transfer jika ada.
          </p>
        </CardBody>
      </Card>

      {campaigns.length > 0 && (
        <Card className="border border-border-subtle shadow-sm">
          <CardBody className="p-4 space-y-1">
            <span className="block border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
              Kampanye Aktif
            </span>
            {campaigns.map((c) => (
              <div key={c.id} className="border-b border-border-subtle/60 py-2.5 last:border-0">
                <p className="text-sm font-bold text-brand-green-900">{c.title}</p>
                {c.description && <p className="mt-0.5 text-xs text-foreground/70">{c.description}</p>}
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <DonationForm campaigns={campaigns} />
    </div>
  );
}
