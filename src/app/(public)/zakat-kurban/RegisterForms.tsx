"use client";

import { useActionState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { FieldGroup, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { registerZakatAction, registerQurbanAction } from "@/app/(public)/zakat-kurban/actions";
import { initialActionState } from "@/lib/action-state";

export function RegisterZakatForm() {
  const [state, formAction, pending] = useActionState(registerZakatAction, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Bayar Zakat</CardTitle>
      </CardHeader>
      <CardBody>
        {state.ok && state.message && (
          <p className="mb-4 rounded-lg bg-brand-green-100 px-3 py-2 text-sm text-brand-green-900">{state.message}</p>
        )}
        {!state.ok && state.message && (
          <p className="mb-4 rounded-lg bg-brand-terracotta-100 px-3 py-2 text-sm text-brand-terracotta-700">{state.message}</p>
        )}
        <form action={formAction} className="space-y-4">
          <FieldGroup label="Jenis Zakat" htmlFor="type" error={state.fieldErrors?.type}>
            <Select id="type" name="type" defaultValue="FITRAH">
              <option value="FITRAH">Zakat Fitrah</option>
              <option value="MAAL">Zakat Maal</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Nama Muzakki" htmlFor="payerName" error={state.fieldErrors?.payerName}>
            <Input id="payerName" name="payerName" required />
          </FieldGroup>
          <FieldGroup label="No. HP / Kontak" htmlFor="payerContact" error={state.fieldErrors?.payerContact}>
            <Input id="payerContact" name="payerContact" />
          </FieldGroup>
          <FieldGroup label="Jumlah Jiwa" htmlFor="familyCount" error={state.fieldErrors?.familyCount}>
            <Input id="familyCount" name="familyCount" type="number" min={1} defaultValue={1} />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Beras (kg, opsional)" htmlFor="amountRice" error={state.fieldErrors?.amountRice}>
              <Input id="amountRice" name="amountRice" type="number" min={0} step="0.1" />
            </FieldGroup>
            <FieldGroup label="Uang (Rp, opsional)" htmlFor="amountMoney" error={state.fieldErrors?.amountMoney}>
              <Input id="amountMoney" name="amountMoney" type="number" min={0} />
            </FieldGroup>
          </div>
          <Button type="submit" variant="primary" disabled={pending} className="w-full">
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
    <Card>
      <CardHeader>
        <CardTitle>Daftar Qurban</CardTitle>
      </CardHeader>
      <CardBody>
        {state.ok && state.message && (
          <p className="mb-4 rounded-lg bg-brand-green-100 px-3 py-2 text-sm text-brand-green-900">{state.message}</p>
        )}
        {!state.ok && state.message && (
          <p className="mb-4 rounded-lg bg-brand-terracotta-100 px-3 py-2 text-sm text-brand-terracotta-700">{state.message}</p>
        )}
        <form action={formAction} className="space-y-4">
          <FieldGroup label="Jenis Hewan" htmlFor="animalType" error={state.fieldErrors?.animalType}>
            <Select id="animalType" name="animalType" defaultValue="KAMBING">
              <option value="KAMBING">Kambing</option>
              <option value="DOMBA">Domba</option>
              <option value="SAPI">Sapi (patungan)</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Atas Nama" htmlFor="qurbanFor" error={state.fieldErrors?.qurbanFor}>
            <Input id="qurbanFor" name="qurbanFor" required />
          </FieldGroup>
          <FieldGroup label="No. HP" htmlFor="contactPhone" error={state.fieldErrors?.contactPhone}>
            <Input id="contactPhone" name="contactPhone" />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Jumlah Bagian" htmlFor="sharesCount" error={state.fieldErrors?.sharesCount}>
              <Input id="sharesCount" name="sharesCount" type="number" min={1} defaultValue={1} />
            </FieldGroup>
            <FieldGroup label="Tahun" htmlFor="year" error={state.fieldErrors?.year}>
              <Input id="year" name="year" type="number" defaultValue={new Date().getFullYear()} />
            </FieldGroup>
          </div>
          <FieldGroup label="Nominal Dibayar (Rp)" htmlFor="amountPaid" error={state.fieldErrors?.amountPaid}>
            <Input id="amountPaid" name="amountPaid" type="number" min={0} required />
          </FieldGroup>
          <Button type="submit" variant="primary" disabled={pending} className="w-full">
            {pending ? "Menyimpan..." : "Daftar Qurban"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
