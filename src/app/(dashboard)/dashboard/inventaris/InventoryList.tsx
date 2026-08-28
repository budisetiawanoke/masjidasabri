"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deleteInventoryItemAction } from "@/app/(dashboard)/dashboard/inventaris/actions";

type Item = {
  id: string;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  location: string | null;
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-left text-foreground/70">
            <th className="py-2 pr-4 font-medium">Nama</th>
            <th className="py-2 pr-4 font-medium">Kategori</th>
            <th className="py-2 pr-4 font-medium">Kondisi</th>
            <th className="py-2 pr-4 text-right font-medium">Jumlah</th>
            <th className="py-2 pr-4 font-medium">Lokasi</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-b border-border-subtle/60">
              <td className="py-2 pr-4 font-medium text-brand-green-900">{i.name}</td>
              <td className="py-2 pr-4">{i.category}</td>
              <td className="py-2 pr-4">
                <Badge tone={CONDITION_TONE[i.condition]}>{CONDITION_LABEL[i.condition]}</Badge>
              </td>
              <td className="py-2 pr-4 text-right">{i.quantity}</td>
              <td className="py-2 pr-4">{i.location || "-"}</td>
              <td className="py-2 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => startTransition(() => deleteInventoryItemAction(i.id))}
                  className="px-2 py-1 text-xs text-brand-terracotta-700"
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-foreground/70">
                Belum ada data aset.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
