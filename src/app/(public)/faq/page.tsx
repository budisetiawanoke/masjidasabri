import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { FaqTabs } from "@/components/public/FaqTabs";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { GuideSections } from "@/components/public/GuideSections";
import { DownloadLink } from "@/components/public/DownloadLink";
import { FAQ_ITEMS, USER_GUIDE, PLAYBOOK } from "@/lib/faq-content";
import { HelpCircle, Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";

export const metadata: Metadata = { title: "FAQ & Panduan" };
// Render dinamis (bukan pre-render statis) — lihat penjelasan lengkap di
// src/app/(public)/page.tsx. Halaman ini sendiri membaca sesi (untuk
// menentukan boleh-tidaknya melihat tab Playbook Pengurus di bawah), jadi
// dinamis apa pun kondisinya.
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  // Playbook Pengurus khusus staf (Super Admin/Admin/Bendahara) — tab dan
  // isinya sengaja TIDAK dirender sama sekali untuk pengunjung lain (bukan
  // cuma disembunyikan lewat CSS), supaya kontennya juga tidak ikut
  // terkirim ke browser mereka. Lihat VIEW_PLAYBOOK di src/lib/rbac.ts dan
  // pengecekan ulang yang sama di src/app/api/playbook/pdf/route.ts.
  const session = await auth();
  const canViewPlaybook = can(session?.user?.role, "VIEW_PLAYBOOK");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-gold-500 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <HelpCircle className="h-5 w-5 text-brand-gold-600" />
            FAQ & Panduan
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Kumpulan pertanyaan yang sering ditanyakan dan Buku Panduan Penggunaan untuk jamaah — bisa dibaca
            langsung di sini atau diunduh dalam bentuk PDF.
            {canViewPlaybook && " Sebagai staf yang login, Anda juga bisa melihat Playbook Pengurus di sini."}
          </p>
        </CardBody>
      </Card>

      <Card className="border border-border-subtle shadow-sm">
        <CardBody className="p-4 sm:p-6">
          <FaqTabs
            faq={<FaqAccordion key="faq" items={FAQ_ITEMS} />}
            panduan={
              <div key="panduan" className="space-y-4">
                <DownloadLink
                  href="/api/panduan/pdf"
                  title="Buku Panduan Penggunaan"
                  previewContent={<GuideSections doc={USER_GUIDE} compact />}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Unduh Buku Panduan (PDF)
                </DownloadLink>
                <GuideSections doc={USER_GUIDE} />
              </div>
            }
            playbook={
              canViewPlaybook ? (
                <div key="playbook" className="space-y-4">
                  <DownloadLink
                    href="/api/playbook/pdf"
                    title="Playbook Pengurus"
                    previewContent={<GuideSections doc={PLAYBOOK} compact />}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Unduh Playbook (PDF)
                  </DownloadLink>
                  <GuideSections doc={PLAYBOOK} />
                </div>
              ) : undefined
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
