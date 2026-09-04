"use client";

import { useActionState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { FieldGroup, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { registerZakatAction, registerQurbanAction } from "@/app/(public)/zakat-kurban/actions";
import { initialActionState } from "@/lib/action-state";
import { ReceiptDownloadLink } from "@/components/public/ReceiptDownloadLink";
import { Send, CheckCircle2, AlertTriangle, Heart, Camera } from "lucide-react";

const PROOF_INPUT_CLASS =
  "mt-1 block w-full text-sm text-foreground/80 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-green-900 hover:file:bg-brand-green-100/70";

export function RegisterZakatForm() {
  const [state, formAction, pending] = useActionState(registerZakatAction, initialActionState);

  return (
    <Card className="border-t-4 border-t-brand-green-700 shadow-md">
      <CardHeader className="bg-brand-green-900/5">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-brand-green-700" />
          Daftar Bayar Zakat
        </CardTitle>
      </CardHeader>
      <CardBody>
        {state.ok && state.message && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 rounded-xl bg-brand-green-100 p-3 text-sm font-semibold text-brand-green-900 border border-brand-green-700/30">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-700" />
              <span>{state.message}</span>
            </div>
            {state.receiptUrl && (
              <ReceiptDownloadLink
                url={state.receiptUrl}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-green-700/40 bg-brand-green-50/60 p-2.5 text-sm font-bold text-brand-green-900 hover:bg-brand-green-50 transition-colors"
              />
            )}
          </div>
        )}
        {!state.ok && state.message && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-terracotta-100 p-3 text-sm font-semibold text-brand-terracotta-700 border border-brand-terracotta-500/30">
            <AlertTriangle className="h-4 w-4 shrink-0 text-brand-terracotta-700" />
            <span>{state.message}</span>
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <FieldGroup label="Jenis Zakat" htmlFor="type" error={state.fieldErrors?.type}>
            <Select id="type" name="type" defaultValue="FITRAH" className="mt-1">
              <option value="FITRAH">Zakat Fitrah</option>
              <option value="MAAL">Zakat Maal</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Nama Muzakki" htmlFor="payerName" error={state.fieldErrors?.payerName}>
            <Input id="payerName" name="payerName" required className="mt-1" />
          </FieldGroup>
          <FieldGroup label="No. HP / Kontak" htmlFor="payerContact" error={state.fieldErrors?.payerContact}>
            <Input id="payerContact" name="payerContact" className="mt-1" />
          </FieldGroup>
          <FieldGroup label="Jumlah Jiwa" htmlFor="familyCount" error={state.fieldErrors?.familyCount}>
            <Input id="familyCount" name="familyCount" type="number" min={1} defaultValue={1} className="mt-1" />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Beras (kg, opsional)" htmlFor="amountRice" error={state.fieldErrors?.amountRice}>
              <Input id="amountRice" name="amountRice" type="number" min={0} step="0.1" className="mt-1" />
            </FieldGroup>
            <FieldGroup label="Uang (Rp, opsional)" htmlFor="amountMoney" error={state.fieldErrors?.amountMoney}>
              <Input id="amountMoney" name="amountMoney" type="number" min={0} className="mt-1" />
            </FieldGroup>
          </div>
          <FieldGroup label="Bukti Transfer (opsional)" htmlFor="proofImage-zakat" error={state.fieldErrors?.proofImage}>
            <input
              id="proofImage-zakat"
              name="proofImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={PROOF_INPUT_CLASS}
            />
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/60">
              <Camera className="h-3.5 w-3.5" />
              Foto/screenshot bukti transfer, maks. 5MB
            </p>
          </FieldGroup>
          <Button type="submit" variant="primary" disabled={pending} className="w-full mt-2 shadow-md">
            <Send className="h-4 w-4" />
            {pending ? "Menyimpan..." : "Daftar"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export function RegisterQurbanForm() {
  const [state, formAction, pending] = useActionState(registerQurbanAction, initialActionState);

  return (
    <Card className="border-t-4 border-t-brand-gold-500 shadow-md">
      <CardHeader className="bg-brand-gold-100/40">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-brand-gold-600" />
          Daftar Qurban
        </CardTitle>
      </CardHeader>
      <CardBody>
        {state.ok && state.message && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 rounded-xl bg-brand-green-100 p-3 text-sm font-semibold text-brand-green-900 border border-brand-green-700/30">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-700" />
              <span>{state.message}</span>
            </div>
            {state.receiptUrl && (
              <ReceiptDownloadLink
                url={state.receiptUrl}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-green-700/40 bg-brand-green-50/60 p-2.5 text-sm font-bold text-brand-green-900 hover:bg-brand-green-50 transition-colors"
              />
            )}
          </div>
        )}
        {!state.ok && state.message && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-terracotta-100 p-3 text-sm font-semibold text-brand-terracotta-700 border border-brand-terracotta-500/30">
            <AlertTriangle className="h-4 w-4 shrink-0 text-brand-terracotta-700" />
            <span>{state.message}</span>
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <FieldGroup label="Jenis Hewan" htmlFor="animalType" error={state.fieldErrors?.animalType}>
            <Select id="animalType" name="animalType" defaultValue="KAMBING" className="mt-1">
              <option value="KAMBING">Kambing</option>
              <option value="DOMBA">Domba</option>
              <option value="SAPI">Sapi (patungan)</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Atas Nama" htmlFor="qurbanFor" error={state.fieldErrors?.qurbanFor}>
            <Input id="qurbanFor" name="qurbanFor" required className="mt-1" />
          </FieldGroup>
          <FieldGroup label="No. HP" htmlFor="contactPhone" error={state.fieldErrors?.contactPhone}>
            <Input id="contactPhone" name="contactPhone" className="mt-1" />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Jumlah Bagian" htmlFor="sharesCount" error={state.fieldErrors?.sharesCount}>
              <Input id="sharesCount" name="sharesCount" type="number" min={1} defaultValue={1} className="mt-1" />
            </FieldGroup>
            <FieldGroup label="Tahun" htmlFor="year" error={state.fieldErrors?.year}>
              <Input id="year" name="year" type="number" defaultValue={new Date().getFullYear()} className="mt-1" />
            </FieldGroup>
          </div>
          <FieldGroup label="Nominal Dibayar (Rp)" htmlFor="amountPaid" error={state.fieldErrors?.amountPaid}>
            <Input id="amountPaid" name="amountPaid" type="number" min={0} required className="mt-1" />
          </FieldGroup>
          <FieldGroup label="Bukti Transfer (opsional)" htmlFor="proofImage-qurban" error={state.fieldErrors?.proofImage}>
            <input
              id="proofImage-qurban"
              name="proofImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={PROOF_INPUT_CLASS}
            />
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/60">
              <Camera className="h-3.5 w-3.5" />
              Foto/screenshot bukti transfer, maks. 5MB
            </p>
          </FieldGroup>
          <Button type="submit" variant="gold" className="w-full mt-2 shadow-md" disabled={pending}>
            <Send className="h-4 w-4" />
            {pending ? "Menyimpan..." : "Daftar Qurban"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
