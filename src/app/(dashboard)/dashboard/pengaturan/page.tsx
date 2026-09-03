import type { Metadata } from "next";
import { requirePagePermission } from "@/lib/require-actor";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getFoundationProfile } from "@/server/foundation/service";
import { ProfileForm } from "@/app/(dashboard)/dashboard/pengaturan/ProfileForm";

export const metadata: Metadata = { title: "Pengaturan Yayasan" };

export default async function PengaturanPage() {
  await requirePagePermission("MANAGE_FOUNDATION_PROFILE");

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
