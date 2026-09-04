import Link from "next/link";
import { Download, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import type { LoadedDetailReport } from "@/server/pdf/detail-report-data";

/**
 * Tampilan generik halaman detail laporan (per kampanye donasi/peruntukan
 * infaq/jenis zakat/jenis kurban) — satu komponen dipakai oleh keempat
 * halaman /donasi/laporan/[id], /infaq-sadaqah/laporan/[id],
 * /zakat/laporan/[id], /kurban/laporan/[id]. Data (`report`) sudah
 * diformat lewat loadDetailReport() (src/server/pdf/detail-report-data.ts)
 * — SUMBER YANG SAMA dengan yang dipakai route unduhan CSV/PDF, supaya
 * tabel yang tampil di layar selalu cocok dengan isi berkas yang diunduh.
 */
export function DetailReportView({
  report,
  backHref,
  backLabel,
  downloadKind,
  downloadId,
  query,
}: {
  report: LoadedDetailReport;
  backHref: string;
  backLabel: string;
  downloadKind: string;
  downloadId: string;
  query: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green-700 hover:underline underline-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-brand-cream-50/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{report.title}</CardTitle>
            <p className="mt-0.5 text-xs text-foreground/60">Periode: {report.periodLabel}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/api/laporan-detail/${downloadKind}/${downloadId}/csv?${query}`}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-700/30 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
              Unduh Excel / CSV
            </a>
            <a
              href={`/api/laporan-detail/${downloadKind}/${downloadId}/pdf?${query}`}
              className="flex items-center gap-1.5 rounded-xl border border-brand-green-900/30 bg-brand-green-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-green-700 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              Unduh PDF
            </a>
          </div>
        </CardHeader>

        <CardBody className="p-0 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-0 sm:mb-4">
            {report.summary.map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-brand-cream-50/70 border border-border-subtle">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/60">{s.label}</p>
                <p className="font-display text-lg font-bold text-brand-green-900">{s.value}</p>
              </div>
            ))}
          </div>

          {report.rows.length === 0 ? (
            <p className="p-6 text-sm text-center text-foreground/70">{report.emptyMessage}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border-subtle bg-brand-green-900/5 text-left text-xs font-bold uppercase tracking-wider text-brand-green-900">
                    {report.columns.map((c) => (
                      <th key={c.key} className={`py-3 px-4 ${c.align === "right" ? "text-right" : ""}`}>
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/60">
                  {report.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-brand-green-50/30 transition-colors">
                      {report.columns.map((c) => (
                        <td key={c.key} className={`py-3 px-4 ${c.align === "right" ? "text-right font-semibold text-brand-green-900" : ""}`}>
                          {row[c.key] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="p-4 text-xs leading-relaxed text-foreground/60 border-t border-border-subtle mt-4">
            {report.disclaimer}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
