"use client";

import { useTransition, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { markInfaqConfirmedAction, markDonationConfirmedAction, reopenCampaignAction } from "@/app/(dashboard)/dashboard/infaq-donasi/actions";
import { CampaignForm } from "@/app/(dashboard)/dashboard/infaq-donasi/CampaignForm";
import { CloseCampaignForm } from "@/app/(dashboard)/dashboard/infaq-donasi/CloseCampaignForm";

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

type CampaignRow = {
  id: string;
  title: string;
  description: string | null;
  bankName: string | null;
  bankAccountNo: string | null;
  bankAccountName: string | null;
  isActive: boolean;
  closingNote: string | null;
};

export function CampaignManager({ campaigns }: { campaigns: CampaignRow[] }) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {campaigns.length === 0 && <p className="text-sm text-foreground/70">Belum ada kampanye donasi.</p>}
        {campaigns.map((c) => (
          <div key={c.id} className="rounded-xl border border-border-subtle p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-brand-green-900">{c.title}</p>
                  <Badge tone={c.isActive ? "green" : "terracotta"}>{c.isActive ? "Aktif" : "Ditutup"}</Badge>
                </div>
                {c.description && <p className="mt-0.5 text-xs text-foreground/70">{c.description}</p>}
                <p className="mt-1 text-xs text-foreground/60">
                  Rekening:{" "}
                  {c.bankName || c.bankAccountNo
                    ? `${c.bankName ?? "-"} · ${c.bankAccountNo ?? "-"} a.n. ${c.bankAccountName ?? "-"}`
                    : "memakai rekening yayasan umum"}
                </p>
                {!c.isActive && c.closingNote && (
                  <p className="mt-1.5 rounded-lg bg-brand-terracotta-100/60 px-2.5 py-1.5 text-xs text-brand-terracotta-700">
                    <span className="font-semibold">Keterangan penutupan: </span>
                    {c.closingNote}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setClosingId(null);
                    setEditingId(editingId === c.id ? null : c.id);
                  }}
                  className="px-3 py-1.5 text-xs"
                >
                  {editingId === c.id ? "Tutup Form" : "Ubah"}
                </Button>
                {c.isActive ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(null);
                      setClosingId(closingId === c.id ? null : c.id);
                    }}
                    className="px-3 py-1.5 text-xs text-brand-terracotta-700"
                  >
                    {closingId === c.id ? "Batal" : "Tutup Kampanye"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={pending}
                    onClick={() => startTransition(() => reopenCampaignAction(c.id))}
                    className="px-3 py-1.5 text-xs"
                  >
                    Buka Kembali
                  </Button>
                )}
              </div>
            </div>

            {editingId === c.id && (
              <div className="mt-3 border-t border-border-subtle pt-3">
                <CampaignForm defaults={c} onSaved={() => setEditingId(null)} />
              </div>
            )}
            {closingId === c.id && (
              <div className="mt-3 border-t border-border-subtle pt-3">
                <p className="mb-2 text-xs text-foreground/70">
                  Jelaskan singkat kepada jamaah kenapa/bagaimana kampanye ini berakhir (mis. dana sudah
                  disalurkan ke mana) — keterangan ini akan tetap tampil di laporan publik kampanye.
                </p>
                <CloseCampaignForm campaignId={c.id} onDone={() => setClosingId(null)} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border-subtle pt-4">
        {creating ? (
          <div className="space-y-3">
            <CampaignForm onSaved={() => setCreating(false)} />
            <Button type="button" variant="ghost" onClick={() => setCreating(false)} className="w-full text-xs">
              Batal
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setCreating(true)} className="w-full">
            Tambah Kampanye Baru
          </Button>
        )}
      </div>
    </div>
  );
}
