import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { listZakatRecords, listQurbanRecords } from "@/server/zakat/service";
import { ZakatAdminTable, QurbanAdminTable } from "@/app/(dashboard)/dashboard/zakat-kurban/ZakatAdminTable";
import { requirePagePermission } from "@/lib/require-actor";

export const metadata: Metadata = { title: "Zakat & Kurban" };

export default async function ZakatKurbanAdminPage() {
  await requirePagePermission("MANAGE_ZAKAT");
  const year = new Date().getFullYear();
  const [zakat, qurban] = await Promise.all([listZakatRecords(year), listQurbanRecords(year)]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Zakat & Kurban {year}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pendaftaran Zakat ({zakat.length})</CardTitle>
          </CardHeader>
          <CardBody>
            <ZakatAdminTable records={zakat.map((z) => ({ ...z, recordedAt: z.recordedAt.toISOString() }))} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendaftaran Qurban ({qurban.length})</CardTitle>
          </CardHeader>
          <CardBody>
            <QurbanAdminTable records={qurban} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
