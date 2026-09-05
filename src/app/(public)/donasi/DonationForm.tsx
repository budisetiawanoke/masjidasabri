"use client";

import { useActionState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitDonationAction } from "@/app/(public)/donasi/actions";
import { initialActionState } from "@/lib/action-state";
import { DownloadLink } from "@/components/public/DownloadLink";
import { Send, CheckCircle2, AlertTriangle, Camera, FileDown } from "lucide-react";

type Campaign = { id: string; title: string };

export function DonationForm({ campaigns }: { campaigns: Campaign[] }) {
  const [state, formAction, pending] = useActionState(submitDonationAction, initialActionState);

  if (campaigns.length === 0) {
    return (
      <Card className="border-t-4 border-t-brand-gold-500 shadow-md">
        <CardBody className="p-6">
          <p className="text-sm text-foreground/70">
            Belum ada kampanye donasi yang aktif saat ini. Silakan cek kembali nanti.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-brand-gold-500 shadow-md">
      <CardBody className="p-6">
        {state.ok && state.message && (
          <div className="mb-5 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-brand-green-100 p-4 text-sm font-semibold text-brand-green-900 border border-brand-green-700/30">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green-700" />
              <span>{state.message}</span>
            </div>
            {state.receiptUrl && (
              <DownloadLink
                href={state.receiptUrl}
                title="Bukti Bayar Donasi"
                kind="pdf"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-gold-500/60 bg-brand-gold-50/60 p-3 text-sm font-bold text-brand-green-900 hover:bg-brand-gold-50 transition-colors"
              >
                <FileDown className="h-4 w-4 text-brand-gold-600" />
                Unduh Bukti Bayar
              </DownloadLink>
            )}
          </div>
        )}
        {!state.ok && state.message && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-terracotta-100 p-4 text-sm font-semibold text-brand-terracotta-700 border border-brand-terracotta-500/30">
            <AlertTriangle className="h-5 w-5 shrink-0 text-brand-terracotta-700" />
            <span>{state.message}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <FieldGroup label="Kampanye Donasi" htmlFor="campaignId" error={state.fieldErrors?.campaignId}>
            <Select id="campaignId" name="campaignId" className="mt-1">
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label="Nama" htmlFor="donorName" error={state.fieldErrors?.donorName}>
            <Input id="donorName" name="donorName" required className="mt-1" />
          </FieldGroup>
          <FieldGroup label="Kontak (opsional)" htmlFor="contactInfo" error={state.fieldErrors?.contactInfo}>
            <Input id="contactInfo" name="contactInfo" placeholder="No. HP / email" className="mt-1" />
          </FieldGroup>
          <FieldGroup label="Nominal (Rp, opsional)" htmlFor="amount" error={state.fieldErrors?.amount}>
            <Input id="amount" name="amount" type="number" min={0} className="mt-1" />
          </FieldGroup>
          <FieldGroup label="Bukti Transfer (opsional)" htmlFor="proofImage" error={state.fieldErrors?.proofImage}>
            <input
              id="proofImage"
              name="proofImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 block w-full text-sm text-foreground/80 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-gold-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-green-900 hover:file:bg-brand-gold-100/70"
            />
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/60">
              <Camera className="h-3.5 w-3.5" />
              Foto/screenshot bukti transfer, maks. 5MB
            </p>
          </FieldGroup>

          <Button type="submit" variant="gold" disabled={pending} className="w-full mt-2 shadow-md">
            <Send className="h-4 w-4" />
            {pending ? "Mengirim..." : "Kirim Donasi"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
