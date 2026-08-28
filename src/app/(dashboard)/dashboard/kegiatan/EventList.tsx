"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { deleteEventAction } from "@/app/(dashboard)/dashboard/kegiatan/actions";

type EventItem = {
  id: string;
  title: string;
  category: string;
  startAt: string | Date;
  location: string | null;
  speaker: string | null;
};

export function EventList({ events }: { events: EventItem[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {events.length === 0 && <p className="text-sm text-foreground/70">Belum ada kegiatan terjadwal.</p>}
      {events.map((e) => (
        <div key={e.id} className="flex items-center justify-between rounded-xl border border-border-subtle p-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="green">{e.category}</Badge>
              <p className="font-medium text-brand-green-900">{e.title}</p>
            </div>
            <p className="mt-1 text-xs text-foreground/70">
              {formatDateTime(e.startAt)}
              {e.location && ` · ${e.location}`}
              {e.speaker && ` · ${e.speaker}`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => startTransition(() => deleteEventAction(e.id))}
            className="text-brand-terracotta-700"
          >
            Hapus
          </Button>
        </div>
      ))}
    </div>
  );
}
