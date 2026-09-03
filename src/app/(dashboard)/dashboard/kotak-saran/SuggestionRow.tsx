"use client";

import { useActionState, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Field";
import { formatDateTime } from "@/lib/format";
import { respondToSuggestionAction } from "@/app/(dashboard)/dashboard/kotak-saran/actions";
import { initialActionState } from "@/lib/action-state";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  category: string;
  isAnonymous: boolean;
  contactInfo: string | null;
  status: string;
  response: string | null;
  createdAt: string | Date;
  author: { name: string } | null;
  trackingCode: string | null;
};

const STATUS_TONE: Record<string, "gold" | "green" | "terracotta"> = {
  BARU: "terracotta",
  DITINDAKLANJUTI: "gold",
  SELESAI: "green",
};

export function SuggestionRow({ ticket }: { ticket: Ticket }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(respondToSuggestionAction, initialActionState);

  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={ticket.category === "PENGADUAN" ? "terracotta" : "green"}>{ticket.category}</Badge>
            <Badge tone={STATUS_TONE[ticket.status]}>{ticket.status}</Badge>
          </div>
          <p className="mt-1 font-medium text-brand-green-900">{ticket.subject}</p>
          <p className="mt-1 text-sm text-foreground/70">{ticket.message}</p>
          <p className="mt-1 text-xs text-foreground/70">
            {formatDateTime(ticket.createdAt)} ·{" "}
            {ticket.isAnonymous ? "Anonim" : ticket.author?.name || "Tamu"}
            {ticket.contactInfo && ` · ${ticket.contactInfo}`}
            {ticket.trackingCode && (
              <>
                {" · kode "}
                <span className="font-mono font-semibold text-brand-green-900">{ticket.trackingCode}</span>
              </>
            )}
          </p>
        </div>
        {ticket.status !== "SELESAI" && (
          <Button type="button" variant="outline" onClick={() => setOpen((v) => !v)} className="px-3 py-1.5 text-xs">
            {open ? "Tutup" : "Tanggapi"}
          </Button>
        )}
      </div>

      {ticket.response && (
        <div className="mt-3 rounded-lg bg-brand-green-100 p-3 text-sm text-brand-green-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green-700">Tanggapan Pengurus</p>
          <p className="mt-1">{ticket.response}</p>
        </div>
      )}

      {open && (
        <form action={formAction} className="mt-3 space-y-2">
          <input type="hidden" name="ticketId" value={ticket.id} />
          {state.message && (
            <p className={`text-xs ${state.ok ? "text-brand-green-900" : "text-brand-terracotta-700"}`}>{state.message}</p>
          )}
          <Textarea name="response" placeholder="Tulis tanggapan..." required className="text-sm" />
          <div className="flex items-center gap-2">
            <Select name="status" defaultValue="DITINDAKLANJUTI" className="w-48 text-xs">
              <option value="DITINDAKLANJUTI">Ditindaklanjuti</option>
              <option value="SELESAI">Selesai</option>
            </Select>
            <Button type="submit" disabled={pending} className="px-3 py-1.5 text-xs">
              {pending ? "..." : "Kirim Tanggapan"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
