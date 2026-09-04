import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadDetailReport } from "@/server/pdf/detail-report-data";
import { DetailReportView } from "@/components/public/DetailReportView";
import { yearOptions } from "@/lib/report-periods";

export const metadata: Metadata = { title: "Laporan Kurban" };
export const dynamic = "force-dynamic";

export default async function KurbanLaporanDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { type } = await params;
  const sp = await searchParams;
  const year = Number(sp.year) || new Date().getFullYear();

  // Kurban tidak per-bulan seperti donasi/infaq/zakat (musimnya sekali
  // setahun, sekitar Idul Adha) — loadDetailReport() untuk "kurban"
  // mengabaikan parameter bulan, cukup kirim bulan berjalan sebagai
  // pengisi (tidak dipakai).
  const report = await loadDetailReport("kurban", type, year, new Date().getMonth() + 1);
  if (!report) notFound();

  const options = yearOptions();

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Pilih Tahun Laporan:</p>
        <div className="flex flex-wrap gap-2">
          {options.map((y) => (
            <Link
              key={y}
              href={`/kurban/laporan/${type}?year=${y}`}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                y === year
                  ? "border-brand-green-900 bg-brand-green-900 text-white shadow-sm"
                  : "border-border-subtle bg-surface text-foreground/80 hover:bg-brand-green-100/70 hover:border-brand-green-900/40"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <DetailReportView
        report={report}
        backHref="/kurban"
        backLabel="Kembali ke Kurban"
        downloadKind="kurban"
        downloadId={type}
        query={`year=${year}`}
      />
    </>
  );
}
