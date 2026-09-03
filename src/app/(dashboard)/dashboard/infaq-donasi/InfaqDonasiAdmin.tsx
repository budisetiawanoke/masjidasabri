"use client";

import { useTransition, useActionState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FieldGroup, Input, Textarea } from "@/components/ui/Field";
import { formatDateTime, formatRupiah } from "@/lib/format";
import {
  markInfaqConfirmedAction,
  markDonationConfirmedAction,
  toggleCampaignAction,
  createCampaignAction,
} from "@/app/(dashboard)/dashboard/infaq-donasi/actions";
import { initialActionState } from "@/lib/action-state";

const CATEGORY_LABEL: Record<string, string> = {
  OPERASIONAL: "Operasional Masjid",
  DHUAFA: "Dhuafa",
  ANAK_YATIM: "Anak Yatim",
};

type InfaqRow = {
  id: string;
  category: string;
  donorName: string;
  contactInfo: string | null;
  amount: number | null;
  proofImageUrl: string | null;
  status: string;
  recordedAt: string | Date;
};

export function InfaqAdminTable({ records }: { records: InfaqRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {records.length === 0 && <p className="text-sm text-foreground/70">Belum ada infaq/sadaqah masuk.</p>}
      {records.map((r) => (
        <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border-subtle p-4">
          <div className="flex items-start gap-3">
            {r.proofImageUrl && (
              <Image
                src={r.proofImageUrl}
                alt="Bukti transfer"
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 shrink-0 rounded-lg border border-border-subtle object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="green">{CATEGORY_LABEL[r.category] ?? r.category}</Badge>
                <Badge tone={r.status === "DIKONFIRMASI" ? "green" : "terracotta"}>{r.status}</Badge>
              </div>
              <p className="mt-1 font-medium text-brand-green-900">{r.donorName}</p>
              <p className="text-xs text-foreground/70">
                {formatDateTime(r.recordedAt)}
                {r.contactInfo && ` · ${r.contactInfo}`}
                {r.amount ? ` · ${formatRupiah(r.amount)}` : ""}
              </p>
            </div>
          </div>
          {r.status !== "DIKONFIRMASI" && (
            <Button
              type="button"
              variant="gold"
              disabled={pending}
              onClick={() => startTransition(() => markInfaqConfirmedAction(r.id))}
              className="shrink-0 px-3 py-1.5 text-xs"
            >
              Konfirmasi
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

type DonationRow = {
  id: string;
  donorName: string;
  contactInfo: string | null;
  amount: number | null;
  proofImageUrl: string | null;
  status: string;
  recordedAt: string | Date;
  campaign: { id: string; title: string };
};

export function DonationAdminTable({ records }: { records: DonationRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {records.length === 0 && <p className="text-sm text-foreground/70">Belum ada donasi masuk.</p>}
      {records.map((r) => (
        <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border-subtle p-4">
          <div className="flex items-start gap-3">
            {r.proofImageUrl && (
              <Image
                src={r.proofImageUrl}
                alt="Bukti transfer"
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 shrink-0 rounded-lg border border-border-subtle object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="gold">{r.campaign.title}</Badge>
                <Badge tone={r.status === "DIKONFIRMASI" ? "green" : "terracotta"}>{r.status}</Badge>
              </div>
              <p className="mt-1 font-medium text-brand-green-900">{r.donorName}</p>
              <p className="text-xs text-foreground/70">
                {formatDateTime(r.recordedAt)}
                {r.contactInfo && ` · ${r.contactInfo}`}
                {r.amount ? ` · ${formatRupiah(r.amount)}` : ""}
              </p>
            </div>
          </div>
          {r.status !== "DIKONFIRMASI" && (
            <Button
              type="button"
              variant="gold"
              disabled={pending}
              onClick={() => startTransition(() => markDonationConfirmedAction(r.id))}
              className="shrink-0 px-3 py-1.5 text-xs"
            >
              Konfirmasi
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

type CampaignRow = { id: string; title: string; description: string | null; isActive: boolean };

export function CampaignManager({ campaigns }: { campaigns: CampaignRow[] }) {
  const [pending, startTransition] = useTransition();
  const [state, formAction, formPending] = useActionState(createCampaignAction, initialActionState);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {campaigns.length === 0 && <p className="text-sm text-foreground/70">Belum ada kampanye donasi.</p>}
        {campaigns.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle p-3">
            <div>
              <p className="text-sm font-medium text-brand-green-900">{c.title}</p>
              {c.description && <p className="text-xs text-foreground/70">{c.description}</p>}
            </div>
            <Button
              type="button"
              variant={c.isActive ? "outline" : "gold"}
              disabled={pending}
              onClick={() => startTransition(() => toggleCampaignAction(c.id, !c.isActive))}
              className="shrink-0 px-3 py-1.5 text-xs"
            >
              {c.isActive ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </div>
        ))}
      </div>

      <form action={formAction} className="space-y-3 border-t border-border-subtle pt-4">
        {state.message && (
          <p className={`rounded-lg px-3 py-2 text-sm ${state.ok ? "bg-brand-green-100 text-brand-green-900" : "bg-brand-terracotta-100 text-brand-terracotta-700"}`}>
            {state.message}
          </p>
        )}
        <FieldGroup label="Judul Kampanye Baru" htmlFor="title" error={state.fieldErrors?.title}>
          <Input id="title" name="title" placeholder="mis. Bantuan Korban Bencana Alam" required />
        </FieldGroup>
        <FieldGroup label="Deskripsi (opsional)" htmlFor="description" error={state.fieldErrors?.description}>
          <Textarea id="description" name="description" />
        </FieldGroup>
        <Button type="submit" disabled={formPending} className="w-full">
          {formPending ? "Menyimpan..." : "Tambah Kampanye"}
        </Button>
      </form>
    </div>
  );
}
