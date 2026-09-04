import "server-only";
import { loadDetailReport } from "@/server/pdf/detail-report-data";
import { getFoundationProfile } from "@/server/foundation/service";
import { buildCsv } from "@/lib/csv";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  const url = new URL(request.url);
  const now = new Date();
  const year = Number(url.searchParams.get("year")) || now.getFullYear();
  const month = Number(url.searchParams.get("month")) || now.getMonth() + 1;

  const [report, profile] = await Promise.all([loadDetailReport(kind, id, year, month), getFoundationProfile()]);
  if (!report) {
    return new Response("Laporan tidak ditemukan.", { status: 404 });
  }

  const rows: (string | number)[][] = [
    [`${report.title.toUpperCase()} - ${profile.name.toUpperCase()}`],
    [`Periode: ${report.periodLabel}`],
    [`Tanggal Unduh: ${new Date().toLocaleDateString("id-ID")}`],
    [],
    ...report.summary.map((s) => [s.label, s.value]),
    [],
    report.columns.map((c) => c.header),
    ...report.rows.map((row) => report.columns.map((c) => row[c.key] ?? "")),
  ];

  return new Response(buildCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${report.filenameSlug}.csv"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
