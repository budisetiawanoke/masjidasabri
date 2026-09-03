"use client";

import { useActionState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitInfaqAction } from "@/app/(public)/infaq-sadaqah/actions";
import { initialActionState } from "@/lib/action-state";
import { Send, CheckCircle2, AlertTriangle, Camera } from "lucide-react";

export function InfaqForm() {
  const [state, formAction, pending] = useActionState(submitInfaqAction, initialActionState);

  return (
    <Card className="border-t-4 border-t-brand-green-700 shadow-md">
      <CardBody className="p-6">
        {state.ok && state.message && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-green-100 p-4 text-sm font-semibold text-brand-green-900 border border-brand-green-700/30">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green-700" />
            <span>{state.message}</span>
          </div>
        )}
        {!state.ok && state.message && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-terracotta-100 p-4 text-sm font-semibold text-brand-terracotta-700 border border-brand-terracotta-500/30">
            <AlertTriangle className="h-5 w-5 shrink-0 text-brand-terracotta-700" />
            <span>{state.message}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <FieldGroup label="Peruntukan" htmlFor="category" error={state.fieldErrors?.category}>
            <Select id="category" name="category" defaultValue="OPERASIONAL" className="mt-1">
              <option value="OPERASIONAL">Operasional Masjid</option>
              <option value="DHUAFA">Dhuafa</option>
              <option value="ANAK_YATIM">Anak Yatim</option>
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
              className="mt-1 block w-full text-sm text-foreground/80 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-green-900 hover:file:bg-brand-green-100/70"
            />
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/60">
              <Camera className="h-3.5 w-3.5" />
              Foto/screenshot bukti transfer, maks. 5MB
            </p>
          </FieldGroup>

          <Button type="submit" variant="primary" disabled={pending} className="w-full mt-2 shadow-md">
            <Send className="h-4 w-4" />
            {pending ? "Mengirim..." : "Kirim Infaq/Sadaqah"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
