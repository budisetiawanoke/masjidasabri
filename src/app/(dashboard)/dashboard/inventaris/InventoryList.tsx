"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deleteInventoryItemAction } from "@/app/(dashboard)/dashboard/inventaris/actions";
import { InventoryForm } from "@/app/(dashboard)/dashboard/inventaris/InventoryForm";
import { MaintenanceLogPanel } from "@/app/(dashboard)/dashboard/inventaris/MaintenanceLogPanel";

type Item = {
  id: string;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  location: string | null;
  notes: string | null;
  maintenanceLogs: { id: string; description: string; cost: number | null; performedAt: string | Date }[];
};

const CONDITION_TONE: Record<string, "green" | "gold" | "terracotta"> = {
  BAIK: "green",
  PERLU_PERBAIKAN: "gold",
  RUSAK: "terracotta",
};

const CONDITION_LABEL: Record<string, string> = {
  BAIK: "Baik",
  PERLU_PERBAIKAN: "Perlu Perbaikan",
  RUSAK: "Rusak",
};

export function InventoryList({ items }: { items: Item[] }) {
  const [pending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<null | { id: string; mode: "edit" | "maintenance" }>(null);

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-foreground/70">Belum ada data aset.</p>}
      {items.map((item) => {
        const isOpen = openId?.id === item.id;
        return (
          <div key={item.id} className="rounded-xl border border-border-subtle p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-brand-green-900">{item.name}</p>
                  <Badge tone={CONDITION_TONE[item.condition]}>{CONDITION_LABEL[item.condition]}</Badge>
                </div>
                <p className="mt-1 text-xs text-foreground/70">
                  {item.category} · {item.quantity} unit{item.location && ` · ${item.location}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenId(isOpen && openId?.mode === "edit" ? null : { id: item.id, mode: "edit" })}
                  className="px-3 py-1.5 text-xs"
                >
                  {isOpen && openId?.mode === "edit" ? "Tutup" : "Ubah"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setOpenId(isOpen && openId?.mode === "maintenance" ? null : { id: item.id, mode: "maintenance" })
                  }
                  className="px-3 py-1.5 text-xs"
                >
                  {isOpen && openId?.mode === "maintenance" ? "Tutup" : "Pemeliharaan"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => startTransition(() => deleteInventoryItemAction(item.id))}
                  className="px-2 py-1.5 text-xs text-brand-terracotta-700"
                >
                  Hapus
                </Button>
              </div>
            </div>

            {isOpen && openId?.mode === "edit" && (
              <div className="mt-4 border-t border-border-subtle pt-4">
                <InventoryForm
                  defaults={{
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    condition: item.condition,
                    quantity: item.quantity,
                    location: item.location,
                    notes: item.notes,
                  }}
                  onSaved={() => setOpenId(null)}
                />
              </div>
            )}

            {isOpen && openId?.mode === "maintenance" && (
              <MaintenanceLogPanel itemId={item.id} logs={item.maintenanceLogs} />
            )}
          </div>
        );
      })}
    </div>
  );
}
