import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { listInventoryItems } from "@/server/inventory/service";
import { InventoryForm } from "@/app/(dashboard)/dashboard/inventaris/InventoryForm";
import { InventoryList } from "@/app/(dashboard)/dashboard/inventaris/InventoryList";
import { requirePagePermission } from "@/lib/require-actor";

export const metadata: Metadata = { title: "Inventaris" };

export default async function InventarisPage() {
  await requirePagePermission("MANAGE_INVENTORY");
  const items = await listInventoryItems();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Inventaris & Aset</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Aset</CardTitle>
            </CardHeader>
            <CardBody>
              <InventoryList
                items={items.map((i) => ({
                  ...i,
                  maintenanceLogs: i.maintenanceLogs.map((l) => ({ ...l, performedAt: l.performedAt.toISOString() })),
                }))}
              />
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Aset</CardTitle>
          </CardHeader>
          <CardBody>
            <InventoryForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
