import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { listMembers } from "@/server/membership/service";
import { MemberForm } from "@/app/(dashboard)/dashboard/jamaah/MemberForm";
import { requirePagePermission } from "@/lib/require-actor";

export const metadata: Metadata = { title: "Jamaah" };

export default async function JamaahPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePagePermission("MANAGE_MEMBERS");
  const { q } = await searchParams;
  const members = await listMembers(q);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-green-900">Data Jamaah</h1>
        <p className="mt-1 text-sm text-foreground/70">{members.length} jamaah terdaftar.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <form method="get" className="max-w-sm">
            <Input name="q" placeholder="Cari nama, domisili, atau no. HP..." defaultValue={q} />
          </form>

          <Card>
            <CardBody className="divide-y divide-border-subtle p-0">
              {members.length === 0 && <p className="p-5 text-sm text-foreground/70">Tidak ada data.</p>}
              {members.map((m) => (
                <Link
                  key={m.id}
                  href={`/dashboard/jamaah/${m.id}`}
                  className="flex items-center justify-between p-4 hover:bg-brand-green-100/50"
                >
                  <div>
                    <p className="font-medium text-brand-green-900">{m.fullName}</p>
                    <p className="text-xs text-foreground/70">
                      {m.domicile || "Domisili belum diisi"}
                      {m.phone && ` · ${m.phone}`}
                    </p>
                  </div>
                  {m.isVolunteer && <Badge tone="gold">Relawan</Badge>}
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tambah Jamaah</CardTitle>
          </CardHeader>
          <CardBody>
            <MemberForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
