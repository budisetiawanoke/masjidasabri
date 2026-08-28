import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getMonthlyPublicReport, getBalanceSummary } from "@/server/finance/service";
import { formatRupiah, monthLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Laporan Keuangan" };
export const revalidate = 300;

function monthOptions() {
  const now = new Date();
  const options: { year: number; month: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }
  return options;
}

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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-green-900">Laporan Keuangan</h1>
      <p className="mt-2 max-w-2xl text-sm text-foreground/70">
        Seluruh transaksi di bawah ini adalah transaksi berstatus <strong>disahkan</strong> (approved) —
        dicatat oleh bendahara dan disahkan oleh pengurus. Koreksi apa pun terhadap transaksi tercatat
        pada jejak audit internal dan tidak pernah menimpa data tanpa riwayat.
      </p>

      <Card className="mt-6">
        <CardBody>
          <p className="text-sm font-medium text-foreground/70">Saldo Kas Yayasan Saat Ini</p>
          <p className="mt-1 font-display text-3xl font-semibold text-brand-green-900">
            {formatRupiah(balance.saldo)}
          </p>
        </CardBody>
      </Card>

      <div className="mt-8 flex flex-wrap gap-2">
        {options.map((o) => (
          <Link
            key={`${o.year}-${o.month}`}
            href={`/laporan-keuangan?year=${o.year}&month=${o.month}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              o.year === year && o.month === month
                ? "border-brand-green-900 bg-brand-green-900 text-white"
                : "border-border-subtle text-foreground/70 hover:bg-brand-green-100"
            }`}
          >
            {monthLabel(o.year, o.month)}
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Rincian {monthLabel(year, month)}</CardTitle>
        </CardHeader>
        <CardBody>
          {report.transactionCount === 0 ? (
            <p className="text-sm text-foreground/70">Belum ada transaksi disahkan pada periode ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-left text-foreground/70">
                    <th className="py-2 pr-4 font-medium">Kategori</th>
                    <th className="py-2 pr-4 font-medium">Jenis</th>
                    <th className="py-2 pr-4 text-right font-medium">Jumlah Transaksi</th>
                    <th className="py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.categories.map((c) => (
                    <tr key={c.name} className="border-b border-border-subtle/60">
                      <td className="py-2 pr-4">{c.name}</td>
                      <td className="py-2 pr-4">
                        <span className={c.kind === "MASUK" ? "text-brand-green-700" : "text-brand-terracotta-700"}>
                          {c.kind === "MASUK" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">{c.count}</td>
                      <td className="py-2 text-right font-medium">{formatRupiah(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border-subtle pt-4 text-sm">
            <div>
              <p className="text-foreground/70">Total Masuk</p>
              <p className="font-semibold text-brand-green-700">{formatRupiah(report.totalMasuk)}</p>
            </div>
            <div>
              <p className="text-foreground/70">Total Keluar</p>
              <p className="font-semibold text-brand-terracotta-700">{formatRupiah(report.totalKeluar)}</p>
            </div>
            <div>
              <p className="text-foreground/70">Selisih Bersih</p>
              <p className="font-semibold text-brand-green-900">{formatRupiah(report.net)}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
