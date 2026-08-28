"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteMemberAction } from "@/app/(dashboard)/dashboard/jamaah/actions";

export function DeleteMemberButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!confirming) {
    return (
      <Button type="button" variant="danger" onClick={() => setConfirming(true)}>
        Hapus Jamaah
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-brand-terracotta-700">Yakin hapus data ini?</span>
      <Button
        type="button"
        variant="danger"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await deleteMemberAction(id);
            router.push("/dashboard/jamaah");
          })
        }
      >
        {pending ? "Menghapus..." : "Ya, Hapus"}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setConfirming(false)}>
        Batal
      </Button>
    </div>
  );
}
