import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { InfaqForm } from "@/app/(public)/infaq-sadaqah/InfaqForm";
import { getInfaqReportByCategory } from "@/server/donations/service";
import { formatRupiah } from "@/lib/format";
import { HandCoins, BarChart3 } from "lucide-react";

export const metadata: Metadata = { title: "Infaq & Sadaqah" };

export default async function InfaqSadaqahPage() {
  const report = await getInfaqReportByCategory();

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

      <Card className="border border-border-subtle shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <BarChart3 className="h-4 w-4 text-brand-green-700" />
            Laporan Infaq &amp; Sadaqah per Peruntukan
          </span>
          {report.map((r) => (
            <div key={r.category} className="flex items-center justify-between gap-3 border-b border-border-subtle/60 py-2.5 last:border-0">
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand-green-900">{r.label}</p>
                <p className="text-xs text-foreground/60">
                  {r.donorCount} penginfak · {r.confirmedCount} dikonfirmasi
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-brand-green-700">{formatRupiah(r.total)}</p>
            </div>
          ))}
          <p className="pt-2 text-xs text-foreground/60">
            Total mencakup seluruh infaq/sadaqah yang tercatat (termasuk yang masih menunggu konfirmasi
            pengurus). Peruntukan Operasional Masjid otomatis tercatat sebagai pemasukan kas — lihat{" "}
            <Link href="/laporan-keuangan" className="font-semibold text-brand-green-700 underline underline-offset-2">
              Laporan Keuangan
            </Link>
            .
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
