import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadDetailReport } from "@/server/pdf/detail-report-data";
import { DetailReportView } from "@/components/public/DetailReportView";
import { monthOptions } from "@/lib/report-periods";
import { monthLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Laporan Zakat" };
export const dynamic = "force-dynamic";

export default async function ZakatLaporanDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { type } = await params;
  const sp = await searchParams;
  const now = new Date();
  const year = Number(sp.year) || now.getFullYear();
  const month = Number(sp.month) || now.getMonth() + 1;

  const report = await loadDetailReport("zakat", type, year, month);
  if (!report) notFound();

  const options = monthOptions();

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Pilih Periode Laporan:</p>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <Link
              key={`${o.year}-${o.month}`}
              href={`/zakat/laporan/${type}?year=${o.year}&month=${o.month}`}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                o.year === year && o.month === month
                  ? "border-brand-green-900 bg-brand-green-900 text-white shadow-sm"
                  : "border-border-subtle bg-surface text-foreground/80 hover:bg-brand-green-100/70 hover:border-brand-green-900/40"
              }`}
            >
              {monthLabel(o.year, o.month)}
            </Link>
          ))}
        </div>
      </div>

      <DetailReportView
        report={report}
        backHref="/zakat"
        backLabel="Kembali ke Zakat"
        downloadKind="zakat"
        downloadId={type}
        query={`year=${year}&month=${month}`}
      />
    </>
  );
}
