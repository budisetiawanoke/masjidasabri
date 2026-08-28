import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listAnnouncements } from "@/server/events/service";
import { AnnouncementForm } from "@/app/(dashboard)/dashboard/pengumuman/AnnouncementForm";
import { AnnouncementDeleteButton } from "@/app/(dashboard)/dashboard/pengumuman/AnnouncementDeleteButton";
import { requirePagePermission } from "@/lib/require-actor";

export const metadata: Metadata = { title: "Pengumuman" };

export default async function PengumumanPage() {
  await requirePagePermission("MANAGE_ANNOUNCEMENTS");
  const announcements = await listAnnouncements(50);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Pengumuman</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {announcements.length === 0 && <p className="text-sm text-foreground/70">Belum ada pengumuman.</p>}
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardBody className="flex items-start justify-between gap-4">
                <div>
                  {a.isPinned && <Badge tone="gold" className="mb-2">Disematkan</Badge>}
                  <p className="font-medium text-brand-green-900">{a.title}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-foreground/70">{a.body}</p>
                  <p className="mt-2 text-xs text-foreground/70">oleh {a.author.name}</p>
                </div>
                <AnnouncementDeleteButton id={a.id} />
              </CardBody>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Buat Pengumuman</CardTitle>
          </CardHeader>
          <CardBody>
            <AnnouncementForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
