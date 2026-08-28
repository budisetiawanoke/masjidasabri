"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { updateFoundationProfileAction } from "@/app/(dashboard)/dashboard/pengaturan/actions";
import { initialActionState } from "@/lib/action-state";

type Profile = {
  name: string;
  shortName: string;
  periodLabel: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  bankName: string | null;
  bankAccountNo: string | null;
  bankAccountName: string | null;
  qrisImageUrl: string | null;
  aboutText: string;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateFoundationProfileAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok ? "bg-brand-green-100 text-brand-green-900" : "bg-brand-terracotta-100 text-brand-terracotta-700"
          }`}
        >
          {state.message}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Nama Resmi Yayasan" htmlFor="name" error={state.fieldErrors?.name}>
          <Input id="name" name="name" defaultValue={profile.name} required />
        </FieldGroup>
        <FieldGroup label="Nama Singkat" htmlFor="shortName" error={state.fieldErrors?.shortName}>
          <Input id="shortName" name="shortName" defaultValue={profile.shortName} required />
        </FieldGroup>
      </div>
      <FieldGroup label="Periode Kepengurusan" htmlFor="periodLabel" error={state.fieldErrors?.periodLabel}>
        <Input id="periodLabel" name="periodLabel" defaultValue={profile.periodLabel} required />
      </FieldGroup>
      <FieldGroup label="Alamat" htmlFor="address" error={state.fieldErrors?.address}>
        <Textarea id="address" name="address" defaultValue={profile.address} required />
      </FieldGroup>
      <div className="grid grid-cols-3 gap-3">
        <FieldGroup label="Kota" htmlFor="city" error={state.fieldErrors?.city}>
          <Input id="city" name="city" defaultValue={profile.city} required />
        </FieldGroup>
        <FieldGroup label="Lintang" htmlFor="latitude" error={state.fieldErrors?.latitude} hint="Untuk jadwal sholat">
          <Input id="latitude" name="latitude" type="number" step="any" defaultValue={profile.latitude} required />
        </FieldGroup>
        <FieldGroup label="Bujur" htmlFor="longitude" error={state.fieldErrors?.longitude}>
          <Input id="longitude" name="longitude" type="number" step="any" defaultValue={profile.longitude} required />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Telepon" htmlFor="phone" error={state.fieldErrors?.phone}>
          <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
        </FieldGroup>
        <FieldGroup label="Email" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" defaultValue={profile.email ?? ""} />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <FieldGroup label="Nama Bank" htmlFor="bankName" error={state.fieldErrors?.bankName}>
          <Input id="bankName" name="bankName" defaultValue={profile.bankName ?? ""} />
        </FieldGroup>
        <FieldGroup label="No. Rekening" htmlFor="bankAccountNo" error={state.fieldErrors?.bankAccountNo}>
          <Input id="bankAccountNo" name="bankAccountNo" defaultValue={profile.bankAccountNo ?? ""} />
        </FieldGroup>
        <FieldGroup label="Atas Nama" htmlFor="bankAccountName" error={state.fieldErrors?.bankAccountName}>
          <Input id="bankAccountName" name="bankAccountName" defaultValue={profile.bankAccountName ?? ""} />
        </FieldGroup>
      </div>
      <FileUpload
        name="qrisImageUrl"
        label="Gambar QRIS (opsional)"
        category="foundation"
        defaultValue={profile.qrisImageUrl}
        hint="Diunggah manual dari QRIS resmi yayasan — bukan proses pembayaran otomatis, hanya gambar untuk dipindai jamaah."
      />
      <FieldGroup label="Tentang Yayasan" htmlFor="aboutText" error={state.fieldErrors?.aboutText}>
        <Textarea id="aboutText" name="aboutText" defaultValue={profile.aboutText} className="min-h-40" required />
      </FieldGroup>
      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan Profil"}
      </Button>
    </form>
  );
}
