import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { requirePagePermission } from "@/lib/require-actor";
import { listInfaqRecords, listDonationRecords, listCampaigns } from "@/server/donations/service";
import { InfaqAdminTable, DonationAdminTable, CampaignManager } from "@/app/(dashboard)/dashboard/infaq-donasi/InfaqDonasiAdmin";

export const metadata: Metadata = { title: "Infaq & Donasi" };

export default async function InfaqDonasiAdminPage() {
  const actor = await requirePagePermission("MANAGE_DONATIONS");
  const [infaq, donations, campaigns] = await Promise.all([
    listInfaqRecords(actor),
    listDonationRecords(actor),
    listCampaigns(actor),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Infaq & Donasi</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Infaq &amp; Sadaqah ({infaq.length})</CardTitle>
          </CardHeader>
          <CardBody>
            <InfaqAdminTable records={infaq.map((r) => ({ ...r, recordedAt: r.recordedAt.toISOString() }))} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donasi ({donations.length})</CardTitle>
          </CardHeader>
          <CardBody>
            <DonationAdminTable records={donations.map((r) => ({ ...r, recordedAt: r.recordedAt.toISOString() }))} />
          </CardBody>
        </Card>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Kelola Kampanye Donasi</CardTitle>
        </CardHeader>
        <CardBody>
          <CampaignManager campaigns={campaigns} />
        </CardBody>
      </Card>
    </div>
  );
}
