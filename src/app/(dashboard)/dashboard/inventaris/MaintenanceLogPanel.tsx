"use client";

import { useActionState } from "react";
import { FieldGroup, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatDate, formatRupiah } from "@/lib/format";
import { addMaintenanceLogAction } from "@/app/(dashboard)/dashboard/inventaris/actions";
import { initialActionState } from "@/lib/action-state";

type Log = { id: string; description: string; cost: number | null; performedAt: string | Date };

export function MaintenanceLogPanel({ itemId, logs }: { itemId: string; logs: Log[] }) {
  const [state, formAction, pending] = useActionState(addMaintenanceLogAction, initialActionState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mt-4 border-t border-border-subtle pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Riwayat Pemeliharaan</p>
      <ul className="mt-2 space-y-1 text-sm">
        {logs.length === 0 && <li className="text-foreground/70">Belum ada riwayat pemeliharaan.</li>}
        {logs.map((log) => (
          <li key={log.id} className="flex justify-between">
            <span>
              {formatDate(log.performedAt)} — {log.description}
            </span>
            {log.cost != null && <span className="text-foreground/70">{formatRupiah(log.cost)}</span>}
          </li>
        ))}
      </ul>

      <form action={formAction} className="mt-3 space-y-2">
        <input type="hidden" name="itemId" value={itemId} />
        {state.message && (
          <p className={`text-xs ${state.ok ? "text-brand-green-900" : "text-brand-terracotta-700"}`}>{state.message}</p>
        )}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <FieldGroup label="Deskripsi" htmlFor={`desc-${itemId}`}>
            <Input id={`desc-${itemId}`} name="description" placeholder="Perbaikan sound system, ..." required className="text-xs" />
          </FieldGroup>
          <FieldGroup label="Biaya (Rp)" htmlFor={`cost-${itemId}`}>
            <Input id={`cost-${itemId}`} name="cost" type="number" min={0} className="w-28 text-xs" />
          </FieldGroup>
          <FieldGroup label="Tanggal" htmlFor={`date-${itemId}`}>
            <Input id={`date-${itemId}`} name="performedAt" type="date" defaultValue={today} className="w-36 text-xs" required />
          </FieldGroup>
        </div>
        <Button type="submit" variant="outline" disabled={pending} className="px-3 py-1.5 text-xs">
          {pending ? "..." : "Catat Pemeliharaan"}
        </Button>
      </form>
    </div>
  );
}
