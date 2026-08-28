import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getFoundationProfile } from "@/server/foundation/service";
import { ProfileForm } from "@/app/(dashboard)/dashboard/pengaturan/ProfileForm";

export const metadata: Metadata = { title: "Pengaturan Yayasan" };

export default async function PengaturanPage() {
  const session = await auth();
  if (!can(session!.user.role, "MANAGE_FOUNDATION_PROFILE")) redirect("/dashboard");

  const profile = await getFoundationProfile();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-900">Pengaturan Yayasan</h1>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Profil Publik</CardTitle>
        </CardHeader>
        <CardBody>
          <ProfileForm profile={profile} />
        </CardBody>
      </Card>
    </div>
  );
}
