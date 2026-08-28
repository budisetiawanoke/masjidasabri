import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listUpcomingEvents, listPastEvents, listAnnouncements } from "@/server/events/service";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Kegiatan & Pengumuman" };
export const revalidate = 120;

const CATEGORY_LABEL: Record<string, string> = {
  KAJIAN: "Kajian",
  TPA: "TPA",
  PHBI: "PHBI",
  RAPAT: "Rapat",
  LAINNYA: "Lainnya",
};

export default async function KegiatanPage() {
  const [upcoming, past, announcements] = await Promise.all([
    listUpcomingEvents(30),
    listPastEvents(10),
    listAnnouncements(10),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-green-900">Kegiatan & Pengumuman</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-brand-green-900">Kegiatan Mendatang</h2>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 && <p className="text-sm text-foreground/70">Belum ada kegiatan terjadwal.</p>}
            {upcoming.map((e) => (
              <Card key={e.id}>
                <CardBody className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone="green">{CATEGORY_LABEL[e.category]}</Badge>
                      <p className="font-semibold text-brand-green-900">{e.title}</p>
                    </div>
                    <p className="mt-1 text-sm text-foreground/70">{e.description}</p>
                    {e.speaker && <p className="mt-1 text-xs text-foreground/70">Pemateri: {e.speaker}</p>}
                  </div>
                  <div className="shrink-0 text-sm text-foreground/70 sm:text-right">
                    <p>{formatDateTime(e.startAt)}</p>
                    {e.location && <p>{e.location}</p>}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {past.length > 0 && (
            <>
              <h2 className="mt-10 text-lg font-semibold text-brand-green-900">Kegiatan Sebelumnya</h2>
              <div className="mt-4 space-y-2">
                {past.map((e) => (
                  <div key={e.id} className="flex justify-between text-sm text-foreground/70">
                    <span>{e.title}</span>
                    <span>{formatDateTime(e.startAt)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-brand-green-900">Pengumuman</h2>
          <div className="mt-4 space-y-3">
            {announcements.length === 0 && <p className="text-sm text-foreground/70">Belum ada pengumuman.</p>}
            {announcements.map((a) => (
              <Card key={a.id}>
                <CardBody>
                  {a.isPinned && <Badge tone="gold" className="mb-2">Disematkan</Badge>}
                  <p className="font-semibold text-brand-green-900">{a.title}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-foreground/70">{a.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
