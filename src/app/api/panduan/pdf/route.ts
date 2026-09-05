import { renderToBuffer } from "@react-pdf/renderer";
import { getFoundationProfile } from "@/server/foundation/service";
import { GuideDocument } from "@/server/pdf/GuideDocument";
import { USER_GUIDE } from "@/lib/faq-content";

// @react-pdf/renderer memakai API Node.js (Buffer, dsb.) — tidak jalan di
// Edge runtime, jadi dipaksa Node.js runtime secara eksplisit (pola sama
// seperti src/app/api/laporan-keuangan/pdf/route.ts).
export const runtime = "nodejs";

export async function GET() {
  const profile = await getFoundationProfile();

  const buffer = await renderToBuffer(
    GuideDocument({ doc: USER_GUIDE, foundationName: profile.name, generatedAt: new Date() })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="buku-panduan-penggunaan-masjid-asabri.pdf"',
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
