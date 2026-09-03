import { getMonthlyPublicReport, getBalanceSummary } from "@/server/finance/service";
import { getFoundationProfile } from "@/server/foundation/service";
import { monthLabel } from "@/lib/format";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const now = new Date();
  const year = Number(url.searchParams.get("year")) || now.getFullYear();
  const month = Number(url.searchParams.get("month")) || now.getMonth() + 1;

  const [report, balance, profile] = await Promise.all([
    getMonthlyPublicReport(year, month),
    getBalanceSummary(),
    getFoundationProfile(),
  ]);

  // Generate UTF-8 CSV with BOM for Excel compatibility
  const rows: string[][] = [
    [`LAPORAN KEUANGAN - ${profile.name.toUpperCase()}`],
    [`Periode: ${monthLabel(year, month)}`],
    [`Tanggal Unduh: ${new Date().toLocaleDateString("id-ID")}`],
    [`Saldo Kas Total Yayasan: Rp ${balance.saldo.toLocaleString("id-ID")}`],
    [],
    ["Kategori", "Jenis Transaksi", "Jumlah Transaksi", "Total (Rp)"],
  ];

  for (const c of report.categories) {
    rows.push([
      `"${c.name.replace(/"/g, '""')}"`,
      c.kind === "MASUK" ? "Pemasukan" : "Pengeluaran",
      String(c.count),
      String(c.total),
    ]);
  }

  rows.push([]);
  rows.push(["TOTAL PEMASUKAN", "", "", String(report.totalMasuk)]);
  rows.push(["TOTAL PENGELUARAN", "", "", String(report.totalKeluar)]);
  rows.push(["SELISIH BERSIH", "", "", String(report.net)]);

  const csvContent = "\uFEFF" + rows.map((r) => r.join(",")).join("\r\n");
  const filename = `laporan-keuangan-${year}-${String(month).padStart(2, "0")}.csv`;

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
