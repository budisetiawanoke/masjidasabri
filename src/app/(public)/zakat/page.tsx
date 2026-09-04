import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { ZakatCalculator } from "@/app/(public)/zakat-kurban/ZakatCalculator";
import { RegisterZakatForm } from "@/app/(public)/zakat-kurban/RegisterForms";
import { getZakatReportByType } from "@/server/zakat/service";
import { formatRupiah } from "@/lib/format";
import { Coins, BarChart3 } from "lucide-react";

export const metadata: Metadata = { title: "Zakat" };

export default async function ZakatPage() {
  const report = await getZakatReportByType();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-green-700 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <Coins className="h-5 w-5 text-brand-green-700" />
            Zakat
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Hitung kewajiban zakat Maal & Fitrah, lalu daftarkan pembayaran zakat Anda secara mandiri.
            Panitia amil yayasan siap melayani dan mengonfirmasi penyerahan Anda.
          </p>
        </CardBody>
      </Card>

      <ZakatCalculator />
      <RegisterZakatForm />

      <Card className="border border-border-subtle shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <BarChart3 className="h-4 w-4 text-brand-green-700" />
            Laporan Zakat per Jenis
          </span>
          {report.map((r) => (
            <div key={r.type} className="flex items-center justify-between gap-3 border-b border-border-subtle/60 py-2.5 last:border-0">
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand-green-900">{r.label}</p>
                <p className="text-xs text-foreground/60">
                  {r.payerCount} muzakki · {r.totalFamilyCount} jiwa · {r.distributedCount} sudah disalurkan
                </p>
              </div>
              <div className="shrink-0 text-right">
                {r.totalMoney > 0 && <p className="text-sm font-bold text-brand-green-700">{formatRupiah(r.totalMoney)}</p>}
                {r.totalRice > 0 && <p className="text-xs font-semibold text-brand-green-700">{r.totalRice} kg beras</p>}
                {r.totalMoney === 0 && r.totalRice === 0 && <p className="text-xs text-foreground/50">Belum ada</p>}
              </div>
            </div>
          ))}
          <p className="pt-2 text-xs text-foreground/60">
            Total mencakup seluruh pendaftaran zakat yang tercatat (termasuk yang belum disalurkan).
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
