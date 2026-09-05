"use client";

import { useActionState, useEffect } from "react";
import { Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { closeCampaignAction } from "@/app/(dashboard)/dashboard/infaq-donasi/actions";
import { initialActionState } from "@/lib/action-state";

/**
 * Form penutupan kampanye — keterangan (closingNote) WAJIB diisi (lihat
 * closeCampaignSchema di src/server/donations/schema.ts) supaya jamaah
 * selalu tahu kenapa/bagaimana kampanyenya berakhir, bukan cuma hilang
 * begitu saja dari daftar aktif.
 */
export function CloseCampaignForm({ campaignId, onDone }: { campaignId: string; onDone?: () => void }) {
  const [state, formAction, pending] = useActionState(closeCampaignAction, initialActionState);

  useEffect(() => {
    if (state.ok) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={campaignId} />
      {state.message && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            state.ok ? "bg-brand-green-100 text-brand-green-900" : "bg-brand-terracotta-100 text-brand-terracotta-700"
          }`}
        >
          {state.message}
        </p>
      )}
      <Textarea
        name="closingNote"
        placeholder="mis. Dana telah disalurkan sepenuhnya ke korban bencana pada 10 September 2026."
        required
        className="text-sm"
      />
      {state.fieldErrors?.closingNote && (
        <p className="text-xs text-brand-terracotta-700">{state.fieldErrors.closingNote}</p>
      )}
      <Button type="submit" variant="gold" disabled={pending} className="w-full py-1.5 text-xs">
        {pending ? "Menutup..." : "Konfirmasi Penutupan Kampanye"}
      </Button>
    </form>
  );
}
