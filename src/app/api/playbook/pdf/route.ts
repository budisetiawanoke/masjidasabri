import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getFoundationProfile } from "@/server/foundation/service";
import { GuideDocument } from "@/server/pdf/GuideDocument";
import { PLAYBOOK } from "@/lib/faq-content";

// @react-pdf/renderer memakai API Node.js (Buffer, dsb.) — tidak jalan di
// Edge runtime, jadi dipaksa Node.js runtime secara eksplisit (pola sama
// seperti src/app/api/laporan-keuangan/pdf/route.ts).
export const runtime = "nodejs";

export async function GET() {
  // Playbook Pengurus khusus staf (lihat VIEW_PLAYBOOK di src/lib/rbac.ts)
  // — endpoint ini diakses langsung lewat URL, jadi harus dicek ulang di
  // server, bukan cuma menyembunyikan tab/tombolnya di halaman /faq (pola
  // sama seperti src/app/api/upload/route.ts).
  const session = await auth();
  if (!can(session?.user?.role, "VIEW_PLAYBOOK")) {
    return new Response("Tidak diizinkan.", { status: 403 });
  }

  const profile = await getFoundationProfile();

  const buffer = await renderToBuffer(
    GuideDocument({ doc: PLAYBOOK, foundationName: profile.name, generatedAt: new Date() })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="playbook-pengurus-masjid-asabri.pdf"',
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
