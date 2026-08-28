import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardBody } from "@/components/ui/Card";
import { getFoundationProfile } from "@/server/foundation/service";
import { listBoardMembers } from "@/server/membership/service";

export const metadata: Metadata = { title: "Profil & Pengurus" };
export const revalidate = 300;

export default async function ProfilPage() {
  const [profile, board] = await Promise.all([getFoundationProfile(), listBoardMembers()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-green-900">Profil Yayasan</h1>
      <p className="mt-4 max-w-3xl whitespace-pre-line text-foreground/80">{profile.aboutText}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody>
            <dt className="text-xs font-medium uppercase tracking-wide text-foreground/70">Alamat</dt>
            <dd className="mt-1 text-sm text-foreground">{profile.address}, {profile.city}</dd>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <dt className="text-xs font-medium uppercase tracking-wide text-foreground/70">Kontak</dt>
            <dd className="mt-1 text-sm text-foreground">
              {profile.phone && <div>Telp: {profile.phone}</div>}
              {profile.email && <div>Email: {profile.email}</div>}
            </dd>
          </CardBody>
        </Card>
      </dl>

      <h2 className="mt-12 font-display text-2xl font-semibold text-brand-green-900">
        Struktur Pengurus {profile.periodLabel}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {board.map((member) => (
          <Card key={member.id}>
            <CardBody className="text-center">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="mx-auto h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-100 font-display text-xl font-semibold text-brand-green-900">
                  {member.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </div>
              )}
              <p className="mt-3 font-semibold text-brand-green-900">{member.name}</p>
              <p className="text-sm text-foreground/70">{member.position}</p>
            </CardBody>
          </Card>
        ))}
        {board.length === 0 && (
          <p className="text-sm text-foreground/70">Data pengurus belum tersedia.</p>
        )}
      </div>
    </div>
  );
}
