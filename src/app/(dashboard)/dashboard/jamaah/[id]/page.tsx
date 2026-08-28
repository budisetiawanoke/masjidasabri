import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getMember } from "@/server/membership/service";
import { MemberForm } from "@/app/(dashboard)/dashboard/jamaah/MemberForm";
import { DeleteMemberButton } from "@/app/(dashboard)/dashboard/jamaah/[id]/DeleteMemberButton";
import { formatDate, formatRupiah } from "@/lib/format";
import { requirePagePermission } from "@/lib/require-actor";

export const metadata: Metadata = { title: "Detail Jamaah" };

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("MANAGE_MEMBERS");
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-brand-green-900">{member.fullName}</h1>
        <DeleteMemberButton id={member.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Data</CardTitle>
          </CardHeader>
          <CardBody>
            <MemberForm
              defaults={{
                id: member.id,
                fullName: member.fullName,
                gender: member.gender,
                birthDate: member.birthDate ? member.birthDate.toISOString().slice(0, 10) : null,
                address: member.address,
                domicile: member.domicile,
                phone: member.phone,
                email: member.email,
                isVolunteer: member.isVolunteer,
                notes: member.notes,
              }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi Terkait</CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-border-subtle">
            {member.transactions.length === 0 && (
              <p className="text-sm text-foreground/70">Belum ada transaksi tertaut ke jamaah ini.</p>
            )}
            {member.transactions.map((t) => (
              <div key={t.id} className="flex justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-brand-green-900">{t.category.name}</p>
                  <p className="text-xs text-foreground/70">{formatDate(t.date)}</p>
                </div>
                <p className="font-medium">{formatRupiah(t.amount)}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
