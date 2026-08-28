"use client";

import { useActionState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitSuggestionAction } from "@/app/(public)/kotak-saran/actions";
import { initialActionState } from "@/lib/action-state";

export function SuggestionForm() {
  const [state, formAction, pending] = useActionState(submitSuggestionAction, initialActionState);

  return (
    <Card>
      <CardBody>
        {state.ok && state.message && (
          <p className="mb-4 rounded-lg bg-brand-green-100 px-3 py-2 text-sm text-brand-green-900">{state.message}</p>
        )}
        {!state.ok && state.message && (
          <p className="mb-4 rounded-lg bg-brand-terracotta-100 px-3 py-2 text-sm text-brand-terracotta-700">{state.message}</p>
        )}
        <form action={formAction} className="space-y-4">
          <FieldGroup label="Kategori" htmlFor="category" error={state.fieldErrors?.category}>
            <Select id="category" name="category" defaultValue="SARAN">
              <option value="SARAN">Saran</option>
              <option value="PENGADUAN">Pengaduan</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Judul" htmlFor="subject" error={state.fieldErrors?.subject}>
            <Input id="subject" name="subject" required />
          </FieldGroup>
          <FieldGroup label="Pesan" htmlFor="message" error={state.fieldErrors?.message}>
            <Textarea id="message" name="message" required />
          </FieldGroup>
          <FieldGroup
            label="Kontak (opsional, agar kami bisa menghubungi balik)"
            htmlFor="contactInfo"
            error={state.fieldErrors?.contactInfo}
          >
            <Input id="contactInfo" name="contactInfo" placeholder="No. HP / email" />
          </FieldGroup>
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" name="isAnonymous" className="h-4 w-4 rounded border-border-subtle" />
            Kirim sebagai anonim
          </label>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
