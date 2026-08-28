"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { deleteEventAction } from "@/app/(dashboard)/dashboard/kegiatan/actions";
import { EventForm } from "@/app/(dashboard)/dashboard/kegiatan/EventForm";

type EventItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  startAt: string | Date;
  endAt: string | Date | null;
  location: string | null;
  speaker: string | null;
  posterUrl: string | null;
};

function toLocalInputValue(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventList({ events }: { events: EventItem[] }) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {events.length === 0 && <p className="text-sm text-foreground/70">Belum ada kegiatan terjadwal.</p>}
      {events.map((e) => (
        <div key={e.id} className="rounded-xl border border-border-subtle p-4">
          <div className="flex items-center justify-between gap-3">
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
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingId(editingId === e.id ? null : e.id)}
                className="px-3 py-1.5 text-xs"
              >
                {editingId === e.id ? "Tutup" : "Ubah"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => startTransition(() => deleteEventAction(e.id))}
                className="px-3 py-1.5 text-xs text-brand-terracotta-700"
              >
                Hapus
              </Button>
            </div>
          </div>
          {editingId === e.id && (
            <div className="mt-4 border-t border-border-subtle pt-4">
              <EventForm
                defaults={{
                  id: e.id,
                  title: e.title,
                  category: e.category,
                  description: e.description,
                  startAt: toLocalInputValue(e.startAt),
                  endAt: e.endAt ? toLocalInputValue(e.endAt) : "",
                  location: e.location,
                  speaker: e.speaker,
                  posterUrl: e.posterUrl,
                }}
                onSaved={() => setEditingId(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
