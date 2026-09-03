import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listUpcomingEvents, listPastEvents } from "@/server/events/service";
import { formatDateTime } from "@/lib/format";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export const metadata: Metadata = { title: "Kegiatan" };
export const revalidate = 120;

const CATEGORY_LABEL: Record<string, string> = {
  KAJIAN: "Kajian",
  TPA: "TPA",
  PHBI: "PHBI",
  RAPAT: "Rapat",
  LAINNYA: "Lainnya",
};

export default async function KegiatanPage() {
  const [upcoming, past] = await Promise.all([listUpcomingEvents(30), listPastEvents(10)]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-green-700 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <Calendar className="h-5 w-5 text-brand-green-700" />
            Kegiatan Mendatang
          </span>

          {upcoming.length === 0 && (
            <p className="py-3 text-base text-foreground/70">Belum ada kegiatan terjadwal.</p>
          )}
          {upcoming.map((e) => (
            <div key={e.id} className="border-b border-border-subtle/60 py-2.5 last:border-0">
              {e.posterUrl && (
                <Image
                  src={e.posterUrl}
                  alt={e.title}
                  width={640}
                  height={360}
                  unoptimized
                  className="mb-2 h-40 w-full rounded-lg border border-border-subtle object-cover"
                />
              )}
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="green" className="text-xs font-bold">{CATEGORY_LABEL[e.category]}</Badge>
                    <h3 className="text-base font-bold text-brand-green-900">{e.title}</h3>
                  </div>
                  {e.description && <p className="text-sm leading-relaxed text-foreground/70">{e.description}</p>}
                  {e.speaker && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-green-800">
                      <User className="h-3.5 w-3.5 text-brand-gold-600" />
                      Pemateri / Imam: {e.speaker}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-xs font-semibold text-foreground/70 sm:text-right">
                  <p className="flex items-center gap-1 sm:justify-end">
                    <Clock className="h-3.5 w-3.5 text-brand-green-700" />
                    {formatDateTime(e.startAt)}
                  </p>
                  {e.location && (
                    <p className="flex items-center gap-1 sm:justify-end">
                      <MapPin className="h-3.5 w-3.5 text-brand-terracotta-500" />
                      {e.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {past.length > 0 && (
        <Card className="border border-border-subtle shadow-sm">
          <CardBody className="p-4 space-y-1">
            <span className="block border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
              Kegiatan Sebelumnya
            </span>
            {past.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-border-subtle/60 py-2 text-sm last:border-0">
                <span className="font-medium text-brand-green-900">{e.title}</span>
                <span className="text-foreground/60">{formatDateTime(e.startAt)}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
