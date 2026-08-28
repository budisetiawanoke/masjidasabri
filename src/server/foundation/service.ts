import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";

type Actor = { id: string; role: Role };

export async function getFoundationProfile() {
  const existing = await prisma.foundationProfile.findFirst();
  if (existing) return existing;
  // Profil default — dibuat sekali agar halaman publik selalu punya data.
  return prisma.foundationProfile.create({
    data: {
      address: "Jl. Asabri, Jatiasih, Kota Bekasi, Jawa Barat",
    },
  });
}

export async function updateFoundationProfile(
  actor: Actor,
  input: Partial<{
    name: string;
    shortName: string;
    periodLabel: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    phone: string | null;
    email: string | null;
    bankName: string | null;
    bankAccountNo: string | null;
    bankAccountName: string | null;
    qrisImageUrl: string | null;
    aboutText: string;
  }>
) {
  assertCan(actor.role, "MANAGE_FOUNDATION_PROFILE");
  const profile = await getFoundationProfile();
  const updated = await prisma.foundationProfile.update({
    where: { id: profile.id },
    data: input,
  });
  await writeAuditLog({ actorId: actor.id, action: "FOUNDATION_PROFILE_UPDATE", entityType: "FoundationProfile", entityId: updated.id });
  return updated;
}
