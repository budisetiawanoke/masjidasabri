"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deleteBoardMemberAction, setBoardMemberActiveAction } from "@/app/(dashboard)/dashboard/pengurus/actions";
import { BoardMemberForm } from "@/app/(dashboard)/dashboard/pengurus/BoardMemberForm";

type Item = {
  id: string;
  name: string;
  position: string;
  periodLabel: string;
  photoUrl: string | null;
  order: number;
  isActive: boolean;
};

export function BoardMemberList({ items }: { items: Item[] }) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-foreground/70">Belum ada data pengurus.</p>}
      {items.map((m) => (
        <div key={m.id} className="rounded-xl border border-border-subtle p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {m.photoUrl ? (
                <Image src={m.photoUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" unoptimized />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-100 text-xs font-semibold text-brand-green-900">
                  {m.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-brand-green-900">{m.name}</p>
                  {!m.isActive && <Badge tone="terracotta">Nonaktif</Badge>}
                </div>
                <p className="text-xs text-foreground/70">
                  {m.position} · {m.periodLabel} · urutan {m.order}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingId(editingId === m.id ? null : m.id)}
                className="px-3 py-1.5 text-xs"
              >
                {editingId === m.id ? "Tutup" : "Ubah"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => startTransition(() => setBoardMemberActiveAction(m.id, !m.isActive))}
                className="px-3 py-1.5 text-xs"
              >
                {m.isActive ? "Nonaktifkan" : "Aktifkan"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => startTransition(() => deleteBoardMemberAction(m.id))}
                className="px-2 py-1.5 text-xs text-brand-terracotta-700"
              >
                Hapus
              </Button>
            </div>
          </div>
          {editingId === m.id && (
            <div className="mt-4 border-t border-border-subtle pt-4">
              <BoardMemberForm
                defaults={{
                  id: m.id,
                  name: m.name,
                  position: m.position,
                  periodLabel: m.periodLabel,
                  photoUrl: m.photoUrl,
                  order: m.order,
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
