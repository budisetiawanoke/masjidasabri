import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { RegisterQurbanForm } from "@/app/(public)/zakat-kurban/RegisterForms";
import { getQurbanReportByType } from "@/server/zakat/service";
import { formatRupiah } from "@/lib/format";
import { HeartHandshake, BarChart3, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Kurban" };

export default async function KurbanPage() {
  const report = await getQurbanReportByType();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-gold-500 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <HeartHandshake className="h-5 w-5 text-brand-gold-600" />
            Kurban
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Daftarkan ibadah qurban Anda secara mandiri. Panitia amil yayasan siap melayani dan
            mengonfirmasi penyerahan Anda.
          </p>
        </CardBody>
      </Card>

      <RegisterQurbanForm />

      <Card className="border border-border-subtle shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <BarChart3 className="h-4 w-4 text-brand-gold-600" />
            Laporan Kurban per Jenis · Tahun {report.year}
          </span>
          {report.rows.map((r) => (
            <Link
              key={r.animalType}
              href={`/kurban/laporan/${r.animalType}?year=${report.year}`}
              className="flex items-center justify-between gap-3 border-b border-border-subtle/60 py-2.5 last:border-0 -mx-1 px-1 rounded-lg hover:bg-brand-gold-50/60 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand-green-900">{r.label}</p>
                <p className="text-xs text-foreground/60">
                  {r.registrantCount} pendaftar · {r.totalShares} bagian
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <p className="text-sm font-bold text-brand-gold-700">{formatRupiah(r.totalAmount)}</p>
                <ChevronRight className="h-4 w-4 text-foreground/40" />
              </div>
            </Link>
          ))}
          <p className="pt-2 text-xs text-foreground/60">
            Total mencakup seluruh pendaftaran qurban tahun {report.year} (termasuk yang belum disembelih).
            Ketuk salah satu jenis hewan untuk lihat rincian &amp; unduh laporannya.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
