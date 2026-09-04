import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { loadDetailReport } from "@/server/pdf/detail-report-data";
import { getFoundationProfile } from "@/server/foundation/service";
import { DetailReportDocument } from "@/server/pdf/DetailReportDocument";

// @react-pdf/renderer memakai API Node.js (Buffer, dsb.) — tidak jalan di
// Edge runtime, sama seperti /api/laporan-keuangan/pdf.
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

  const buffer = await renderToBuffer(
    DetailReportDocument({
      data: { ...report, foundationName: profile.name, generatedAt: new Date() },
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${report.filenameSlug}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
