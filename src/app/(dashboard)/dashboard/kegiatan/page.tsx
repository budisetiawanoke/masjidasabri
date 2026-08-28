import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { listUpcomingEvents } from "@/server/events/service";
import { EventForm } from "@/app/(dashboard)/dashboard/kegiatan/EventForm";
import { EventList } from "@/app/(dashboard)/dashboard/kegiatan/EventList";
import { requirePagePermission } from "@/lib/require-actor";

export const metadata: Metadata = { title: "Kegiatan" };

export default async function KegiatanDashboardPage() {
  await requirePagePermission("MANAGE_EVENTS");
  const events = await listUpcomingEvents(50);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Kegiatan</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Kegiatan Mendatang</CardTitle>
            </CardHeader>
            <CardBody>
              <EventList
                events={events.map((e) => ({
                  ...e,
                  startAt: e.startAt.toISOString(),
                  endAt: e.endAt ? e.endAt.toISOString() : null,
                }))}
              />
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Kegiatan</CardTitle>
          </CardHeader>
          <CardBody>
            <EventForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
