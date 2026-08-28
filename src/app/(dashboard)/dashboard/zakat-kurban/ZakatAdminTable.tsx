"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { formatDate, formatRupiah } from "@/lib/format";
import { markZakatDistributedAction, updateQurbanStatusAction } from "@/app/(dashboard)/dashboard/zakat-kurban/actions";

type ZakatRow = {
  id: string;
  type: string;
  payerName: string;
  payerContact: string | null;
  familyCount: number;
  amountRice: number | null;
  amountMoney: number | null;
  status: string;
  distributedTo: string | null;
  recordedAt: string | Date;
};

export function ZakatAdminTable({ records }: { records: ZakatRow[] }) {
  const [pending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-3">
      {records.length === 0 && <p className="text-sm text-foreground/70">Belum ada pendaftaran zakat.</p>}
      {records.map((r) => (
        <div key={r.id} className="rounded-xl border border-border-subtle p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone={r.type === "FITRAH" ? "gold" : "green"}>{r.type === "FITRAH" ? "Fitrah" : "Maal"}</Badge>
                <Badge tone={r.status === "DISALURKAN" ? "green" : "terracotta"}>{r.status}</Badge>
              </div>
              <p className="mt-1 font-medium text-brand-green-900">{r.payerName}</p>
              <p className="text-xs text-foreground/70">
                {formatDate(r.recordedAt)} · {r.familyCount} jiwa
                {r.payerContact && ` · ${r.payerContact}`}
              </p>
            </div>
            <div className="text-right text-sm">
              {r.amountRice ? <p>{r.amountRice} kg beras</p> : null}
              {r.amountMoney ? <p className="font-medium text-brand-green-900">{formatRupiah(r.amountMoney)}</p> : null}
            </div>
          </div>
          {r.status !== "DISALURKAN" && (
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Disalurkan kepada..."
                value={drafts[r.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                className="text-xs"
              />
              <Button
                type="button"
                variant="gold"
                disabled={pending || !drafts[r.id]}
                onClick={() => startTransition(() => markZakatDistributedAction(r.id, drafts[r.id]))}
                className="shrink-0 px-3 py-1.5 text-xs"
              >
                Tandai Disalurkan
              </Button>
            </div>
          )}
          {r.distributedTo && <p className="mt-2 text-xs text-foreground/70">Disalurkan ke: {r.distributedTo}</p>}
        </div>
      ))}
    </div>
  );
}

type QurbanRow = {
  id: string;
  animalType: string;
  qurbanFor: string;
  sharesCount: number;
  amountPaid: number;
  status: string;
};

const QURBAN_STATUSES = ["TERDAFTAR", "LUNAS", "DISEMBELIH", "DIDISTRIBUSI"];

export function QurbanAdminTable({ records }: { records: QurbanRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {records.length === 0 && <p className="text-sm text-foreground/70">Belum ada pendaftaran qurban.</p>}
      {records.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle p-4">
          <div>
            <p className="font-medium text-brand-green-900">
              {r.qurbanFor} · {r.animalType} ({r.sharesCount} bagian)
            </p>
            <p className="text-xs text-foreground/70">{formatRupiah(r.amountPaid)}</p>
          </div>
          <select
            defaultValue={r.status}
            disabled={pending}
            onChange={(e) => startTransition(() => updateQurbanStatusAction(r.id, e.target.value))}
            className="rounded-lg border border-border-subtle px-2 py-1.5 text-xs"
          >
            {QURBAN_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
