"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteAnnouncementAction } from "@/app/(dashboard)/dashboard/pengumuman/actions";

export function AnnouncementDeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      onClick={() => startTransition(() => deleteAnnouncementAction(id))}
      className="shrink-0 text-brand-terracotta-700"
    >
      Hapus
    </Button>
  );
}
