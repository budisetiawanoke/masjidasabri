import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { InfaqForm } from "@/app/(public)/infaq-sadaqah/InfaqForm";
import { HandCoins } from "lucide-react";

export const metadata: Metadata = { title: "Infaq & Sadaqah" };

export default function InfaqSadaqahPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-green-700 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <HandCoins className="h-5 w-5 text-brand-green-700" />
            Infaq &amp; Sadaqah
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Salurkan infaq/sadaqah untuk operasional masjid, dhuafa, atau anak yatim. Transfer ke rekening
            resmi yayasan (lihat halaman Beranda), lalu catat pengiriman Anda di sini beserta bukti transfer
            jika ada.
          </p>
        </CardBody>
      </Card>

      <InfaqForm />
    </div>
  );
}
