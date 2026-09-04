import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardBody } from "@/components/ui/Card";
import { BismillahCalligraphy } from "@/components/brand/BismillahCalligraphy";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { getFoundationProfile } from "@/server/foundation/service";
import { listBoardMembers } from "@/server/membership/service";
import { MapPin, Phone, Mail, Users, Award } from "lucide-react";

export const metadata: Metadata = { title: "Profil & Pengurus" };
// Render dinamis (bukan pre-render statis) — lihat penjelasan lengkap di
// src/app/(public)/page.tsx.
export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const [profile, board] = await Promise.all([getFoundationProfile(), listBoardMembers()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-800 p-8 text-white shadow-lg border border-brand-gold-500/30">
        <IslamicPattern className="opacity-10 text-brand-gold-300" />
        <div className="relative space-y-3">
          <BismillahCalligraphy className="mb-2 max-w-xs" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Profil Masjid ASABRI</h1>
          <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-brand-cream-50/90">
            {profile.aboutText}
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <dl className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-brand-green-700 shadow-sm">
          <CardBody className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-brand-green-100 text-brand-green-900 shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-foreground/70">Alamat Masjid ASABRI</dt>
              <dd className="mt-1 text-sm font-semibold text-brand-green-900">{profile.address}, {profile.city}</dd>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-brand-gold-500 shadow-sm">
          <CardBody className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-brand-gold-100 text-brand-gold-600 shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-foreground/70">Kontak Resmi</dt>
              <dd className="mt-1 text-sm font-semibold text-brand-green-900 space-y-1">
                {profile.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-brand-green-700" /> Telp: {profile.phone}</div>}
                {profile.email && <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-brand-green-700" /> Email: {profile.email}</div>}
              </dd>
            </div>
          </CardBody>
        </Card>
      </dl>

      {/* Board Members Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3 border-b border-border-subtle pb-3">
          <div className="p-2 rounded-xl bg-brand-green-900 text-brand-gold-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-green-900">
              Struktur Pengurus {profile.periodLabel}
            </h2>
            <p className="text-xs text-foreground/70">
              Jajaran pengurus amanah Masjid ASABRI periode {profile.periodLabel}
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((member) => (
            <Card key={member.id} className="text-center group hover:border-brand-gold-500 transition-all duration-300 hover:shadow-md">
              <CardBody className="p-6 flex flex-col items-center">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-20 rounded-full object-cover border-2 border-brand-gold-500 shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-900 to-brand-green-800 border-2 border-brand-gold-500 font-display text-2xl font-bold text-brand-gold-400 shadow-md group-hover:scale-105 transition-transform duration-300">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </div>
                )}
                <p className="mt-4 font-bold text-brand-green-900 text-base">{member.name}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-green-800 bg-brand-green-100 px-3 py-1 rounded-full border border-brand-green-700/20">
                  <Award className="h-3 w-3 text-brand-gold-600" />
                  {member.position}
                </span>
              </CardBody>
            </Card>
          ))}
          {board.length === 0 && (
            <p className="text-sm text-foreground/70 py-6">Data pengurus belum tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
}
