import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { listAllBoardMembers } from "@/server/membership/service";
import { requirePagePermission } from "@/lib/require-actor";
import { BoardMemberForm } from "@/app/(dashboard)/dashboard/pengurus/BoardMemberForm";
import { BoardMemberList } from "@/app/(dashboard)/dashboard/pengurus/BoardMemberList";

export const metadata: Metadata = { title: "Struktur Pengurus" };

export default async function PengurusPage() {
  await requirePagePermission("MANAGE_BOARD");
  const members = await listAllBoardMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-green-900">Struktur Pengurus</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Daftar ini tampil publik di halaman <code>/profil</code> — hanya pengurus berstatus aktif yang ditampilkan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengurus ({members.length})</CardTitle>
            </CardHeader>
            <CardBody>
              <BoardMemberList items={members} />
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Pengurus</CardTitle>
          </CardHeader>
          <CardBody>
            <BoardMemberForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
