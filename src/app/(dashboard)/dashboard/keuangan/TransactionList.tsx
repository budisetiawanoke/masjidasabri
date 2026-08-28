"use client";

import { useActionState, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { formatDate, formatRupiah } from "@/lib/format";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { approveTransactionAction, voidTransactionAction } from "@/app/(dashboard)/dashboard/keuangan/actions";
import { initialActionState } from "@/lib/action-state";

type Tx = {
  id: string;
  date: string | Date;
  amount: number;
  description: string;
  status: string;
  category: { name: string; kind: string };
  recordedBy: { name: string };
  approvedBy: { name: string } | null;
};

const STATUS_TONE: Record<string, "gold" | "green" | "terracotta"> = {
  PENDING: "gold",
  APPROVED: "green",
  VOID: "terracotta",
};

function VoidForm({ transactionId, onDone }: { transactionId: string; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(voidTransactionAction, initialActionState);

  useEffect(() => {
    if (state.ok) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={formAction} className="mt-2 space-y-2 rounded-lg border border-brand-terracotta-500/30 bg-brand-terracotta-100/40 p-3">
      <input type="hidden" name="transactionId" value={transactionId} />
      <Textarea name="reason" placeholder="Alasan pembatalan (wajib)" required className="min-h-16 bg-white text-xs" />
      {state.message && <p className="text-xs text-brand-terracotta-700">{state.message}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="danger" disabled={pending} className="px-3 py-1.5 text-xs">
          {pending ? "..." : "Konfirmasi Batalkan"}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone} className="px-3 py-1.5 text-xs">
          Batal
        </Button>
      </div>
    </form>
  );
}

function ApproveButton({ transactionId }: { transactionId: string }) {
  return (
    <form action={approveTransactionAction.bind(null, transactionId)}>
      <Button type="submit" variant="gold" className="px-3 py-1.5 text-xs">
        Sahkan
      </Button>
    </form>
  );
}

export function TransactionList({ transactions, role }: { transactions: Tx[]; role: Role }) {
  const [voidingId, setVoidingId] = useState<string | null>(null);
  const canApprove = can(role, "APPROVE_TRANSACTION");
  const canVoid = can(role, "VOID_TRANSACTION");

  return (
    <div className="space-y-3">
      {transactions.length === 0 && <p className="text-sm text-foreground/70">Belum ada transaksi.</p>}
      {transactions.map((tx) => (
        <div key={tx.id} className="rounded-xl border border-border-subtle p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[tx.status]}>{tx.status}</Badge>
                <span className="text-sm font-medium text-brand-green-900">{tx.category.name}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/80">{tx.description}</p>
              <p className="mt-1 text-xs text-foreground/70">
                {formatDate(tx.date)} · dicatat oleh {tx.recordedBy.name}
                {tx.approvedBy && ` · disahkan oleh ${tx.approvedBy.name}`}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-display text-lg font-semibold ${
                  tx.category.kind === "MASUK" ? "text-brand-green-700" : "text-brand-terracotta-700"
                }`}
              >
                {tx.category.kind === "KELUAR" ? "- " : "+ "}
                {formatRupiah(tx.amount)}
              </p>
              <div className="mt-2 flex justify-end gap-2">
                {tx.status === "PENDING" && canApprove && <ApproveButton transactionId={tx.id} />}
                {tx.status !== "VOID" && canVoid && (
                  <Button
                    type="button"
                    variant="danger"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => setVoidingId(voidingId === tx.id ? null : tx.id)}
                  >
                    Batalkan
                  </Button>
                )}
              </div>
            </div>
          </div>
          {voidingId === tx.id && <VoidForm transactionId={tx.id} onDone={() => setVoidingId(null)} />}
        </div>
      ))}
    </div>
  );
}
