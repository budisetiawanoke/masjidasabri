import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { getFoundationProfile } from "@/server/foundation/service";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getFoundationProfile();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter address={profile.address} phone={profile.phone} email={profile.email} />
    </div>
  );
}
