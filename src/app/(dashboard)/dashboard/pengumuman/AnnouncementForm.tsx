"use client";

import { useActionState } from "react";
import { FieldGroup, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createAnnouncementAction } from "@/app/(dashboard)/dashboard/pengumuman/actions";
import { initialActionState } from "@/lib/action-state";

export function AnnouncementForm() {
  const [state, formAction, pending] = useActionState(createAnnouncementAction, initialActionState);

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
      <FieldGroup label="Judul" htmlFor="title" error={state.fieldErrors?.title}>
        <Input id="title" name="title" required />
      </FieldGroup>
      <FieldGroup label="Isi Pengumuman" htmlFor="body" error={state.fieldErrors?.body}>
        <Textarea id="body" name="body" required />
      </FieldGroup>
      <label className="flex items-center gap-2 text-sm text-foreground/70">
        <input type="checkbox" name="isPinned" className="h-4 w-4 rounded border-border-subtle" />
        Sematkan di atas
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : "Publikasikan"}
      </Button>
    </form>
  );
}
