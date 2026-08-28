import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { listUsers } from "@/server/users/service";
import { UserRow } from "@/app/(dashboard)/dashboard/pengguna/UserRow";
import { CreateUserForm } from "@/app/(dashboard)/dashboard/pengguna/CreateUserForm";

export const metadata: Metadata = { title: "Pengguna" };

export default async function PenggunaPage() {
  const session = await auth();
  if (!can(session!.user.role, "MANAGE_USERS")) redirect("/dashboard");

  const users = await listUsers();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Manajemen Pengguna</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {users.map((u) => (
            <UserRow key={u.id} user={u} isSelf={u.id === session!.user.id} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Buat Akun Baru</CardTitle>
          </CardHeader>
          <CardBody>
            <CreateUserForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
