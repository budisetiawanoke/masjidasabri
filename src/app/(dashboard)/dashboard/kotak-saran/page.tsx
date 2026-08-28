import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { auth } from "@/lib/auth";
import { listSuggestions } from "@/server/suggestions/service";
import { SuggestionRow } from "@/app/(dashboard)/dashboard/kotak-saran/SuggestionRow";

export const metadata: Metadata = { title: "Kotak Saran" };

export default async function KotakSaranAdminPage() {
  const session = await auth();
  const tickets = await listSuggestions({ id: session!.user.id, role: session!.user.role });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Kotak Saran & Pengaduan</h1>
      <Card>
        <CardBody className="space-y-3">
          {tickets.length === 0 && <p className="text-sm text-foreground/70">Belum ada masukan.</p>}
          {tickets.map((t) => (
            <SuggestionRow key={t.id} ticket={{ ...t, createdAt: t.createdAt.toISOString() }} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
