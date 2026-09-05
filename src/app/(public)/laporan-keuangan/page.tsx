import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileSpreadsheet, TrendingUp, ArrowDownRight, ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { DownloadLink } from "@/components/public/DownloadLink";
import { BismillahCalligraphy } from "@/components/brand/BismillahCalligraphy";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { getMonthlyPublicReport, getBalanceSummary } from "@/server/finance/service";
import { formatRupiah, monthLabel } from "@/lib/format";
import { monthOptions } from "@/lib/report-periods";

export const metadata: Metadata = { title: "Laporan Keuangan" };
// Render dinamis (bukan pre-render statis) — lihat penjelasan lengkap di
// src/app/(public)/page.tsx.
export const dynamic = "force-dynamic";

export default async function LaporanKeuanganPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year) || now.getFullYear();
  const month = Number(params.month) || now.getMonth() + 1;

  const [report, balance] = await Promise.all([getMonthlyPublicReport(year, month), getBalanceSummary()]);
  const options = monthOptions();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-800 p-8 text-white shadow-lg border border-brand-gold-500/30">
        <IslamicPattern className="opacity-10 text-brand-gold-300" />
        <div className="relative space-y-3">
          <BismillahCalligraphy className="mb-2 max-w-xs" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Laporan Keuangan</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-brand-cream-50/90 flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
            <span>
              Seluruh transaksi di bawah ini adalah transaksi berstatus <strong>disahkan</strong> (approved) — dicatat oleh bendahara dan disahkan oleh pengurus. Setiap koreksi atau pembatalan tercatat permanen dalam audit trail internal.
            </span>
          </p>
        </div>
      </div>

      {/* Current Total Balance Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-2 border-brand-gold-500/40 bg-gradient-to-br from-brand-gold-50/80 via-white to-brand-gold-50/30 shadow-md">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green-900/80">Saldo Kas Yayasan Saat Ini</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-brand-green-900">
                {formatRupiah(balance.saldo)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-brand-green-900 text-brand-gold-400">
              <Wallet className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border border-brand-green-100 bg-emerald-50/40">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Total Akumulasi Masuk</p>
              <p className="mt-1 font-display text-xl font-bold text-emerald-900">
                {formatRupiah(balance.totalMasuk)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
              <ArrowDownRight className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border border-orange-100 bg-orange-50/40">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-terracotta-700">Total Akumulasi Keluar</p>
              <p className="mt-1 font-display text-xl font-bold text-brand-terracotta-700">
                {formatRupiah(balance.totalKeluar)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-100 text-brand-terracotta-700">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Month Selector Pills */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Pilih Periode Laporan:</p>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <Link
              key={`${o.year}-${o.month}`}
              href={`/laporan-keuangan?year=${o.year}&month=${o.month}`}
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

      {/* Detailed Monthly Table */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-brand-cream-50/50 flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-green-700" />
            Rincian {monthLabel(year, month)}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <DownloadLink
              href={`/api/laporan-keuangan/csv?year=${year}&month=${month}`}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-700/30 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
              Unduh Excel / CSV
            </DownloadLink>
            <DownloadLink
              href={`/api/laporan-keuangan/pdf?year=${year}&month=${month}`}
              className="flex items-center gap-1.5 rounded-xl border border-brand-green-900/30 bg-brand-green-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-green-700 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              Unduh PDF
            </DownloadLink>
          </div>
        </CardHeader>

        <CardBody className="p-0 sm:p-6">
          {report.transactionCount === 0 ? (
            <p className="p-6 text-sm text-center text-foreground/70">Belum ada transaksi disahkan pada periode {monthLabel(year, month)}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-brand-green-900/5 text-left text-xs font-bold uppercase tracking-wider text-brand-green-900">
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4 text-right">Jumlah Transaksi</th>
                    <th className="py-3 px-4 text-right">Total (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/60">
                  {report.categories.map((c) => (
                    <tr key={c.name} className="hover:bg-brand-green-50/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-brand-green-900">{c.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          c.kind === "MASUK" 
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300/40" 
                            : "bg-orange-100 text-brand-terracotta-700 border border-orange-300/40"
                        }`}>
                          {c.kind === "MASUK" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-foreground/80">{c.count}</td>
                      <td className="py-3 px-4 text-right font-bold text-brand-green-900">{formatRupiah(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="m-4 sm:m-0 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-2 border-border-subtle pt-4 text-sm bg-brand-cream-50/50 p-4 rounded-2xl">
            <div className="p-3 rounded-xl bg-white border border-border-subtle/80">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Total Masuk</p>
              <p className="font-display text-lg font-bold text-emerald-800">{formatRupiah(report.totalMasuk)}</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-border-subtle/80">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Total Keluar</p>
              <p className="font-display text-lg font-bold text-brand-terracotta-700">{formatRupiah(report.totalKeluar)}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-gold-100/60 border border-brand-gold-500/40">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green-900">Selisih Bersih</p>
              <p className="font-display text-lg font-extrabold text-brand-green-900">{formatRupiah(report.net)}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
