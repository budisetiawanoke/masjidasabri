"use client";

import { useActionState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { submitSuggestionAction } from "@/app/(public)/kotak-saran/actions";
import { initialActionState } from "@/lib/action-state";
import { Send, CheckCircle2, AlertTriangle, ShieldCheck, KeyRound } from "lucide-react";

export function SuggestionForm() {
  const [state, formAction, pending] = useActionState(submitSuggestionAction, initialActionState);

  return (
    <Card className="border-t-4 border-t-brand-green-700 shadow-md">
      <CardBody className="p-6">
        {state.ok && state.message && (
          <div className="mb-5 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-brand-green-100 p-4 text-sm font-semibold text-brand-green-900 border border-brand-green-700/30">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green-700" />
              <span>{state.message}</span>
            </div>
            {state.trackingCode && (
              <div className="rounded-xl border-2 border-dashed border-brand-gold-500/60 bg-brand-gold-50/60 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-green-900/80 flex items-center justify-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  Kode Pelacakan Anda
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold tracking-widest text-brand-green-900">
                  {state.trackingCode}
                </p>
                <p className="mt-2 text-xs text-foreground/70">
                  Simpan kode ini — tidak perlu akun untuk memakainya. Cek status & tanggapan pengurus
                  kapan saja di{" "}
                  <Link href="/kotak-saran/cek-status" className="font-semibold text-brand-green-700 underline underline-offset-2">
                    halaman cek status
                  </Link>
                  .
                </p>
              </div>
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
          <FieldGroup label="Kategori" htmlFor="category" error={state.fieldErrors?.category}>
            <Select id="category" name="category" defaultValue="SARAN" className="mt-1">
              <option value="SARAN">Saran</option>
              <option value="PENGADUAN">Pengaduan</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Judul" htmlFor="subject" error={state.fieldErrors?.subject}>
            <Input id="subject" name="subject" required className="mt-1" />
          </FieldGroup>
          <FieldGroup label="Pesan" htmlFor="message" error={state.fieldErrors?.message}>
            <Textarea id="message" name="message" required className="mt-1 min-h-[120px]" />
          </FieldGroup>
          <FieldGroup
            label="Kontak (opsional, agar kami bisa menghubungi balik)"
            htmlFor="contactInfo"
            error={state.fieldErrors?.contactInfo}
          >
            <Input id="contactInfo" name="contactInfo" placeholder="No. HP / email" className="mt-1" />
          </FieldGroup>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-cream-50/70 border border-border-subtle">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              className="h-4 w-4 rounded border-border-subtle text-brand-green-900 focus:ring-brand-gold-500 cursor-pointer"
            />
            <label htmlFor="isAnonymous" className="text-sm font-semibold text-brand-green-900 cursor-pointer flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-green-700" />
              Kirim sebagai anonim
            </label>
          </div>

          <Button type="submit" disabled={pending} className="w-full mt-2 shadow-md">
            <Send className="h-4 w-4" />
            {pending ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
