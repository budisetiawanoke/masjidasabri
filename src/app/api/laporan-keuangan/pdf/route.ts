import { renderToBuffer } from "@react-pdf/renderer";
import { getMonthlyPublicReport, getBalanceSummary } from "@/server/finance/service";
import { getFoundationProfile } from "@/server/foundation/service";
import { FinancialReportDocument } from "@/server/pdf/FinancialReportDocument";

// @react-pdf/renderer memakai API Node.js (Buffer, dsb.) — tidak jalan di
// Edge runtime, jadi dipaksa Node.js runtime secara eksplisit.
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

  const buffer = await renderToBuffer(
    FinancialReportDocument({
      report,
      saldo: balance.saldo,
      foundationName: profile.name,
      generatedAt: new Date(),
    })
  );

  const filename = `laporan-keuangan-${profile.shortName.toLowerCase().replace(/\s+/g, "-")}-${year}-${String(
    month
  ).padStart(2, "0")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
