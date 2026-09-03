import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import { saveOptionalProofImage } from "@/lib/upload";
import type { Role } from "@prisma/client";
import type { InfaqRecordInput, DonationRecordInput, DonationCampaignInput } from "@/server/donations/schema";

type Actor = { id: string; role: Role };

// ---------- Infaq/Sadaqah (kategori tetap) ----------

export async function registerInfaqPublic(input: InfaqRecordInput, proofFile?: File | null) {
  const proofImageUrl = await saveOptionalProofImage(proofFile);
  return prisma.infaqRecord.create({
    data: {
      category: input.category,
      donorName: input.donorName,
      contactInfo: input.contactInfo ?? null,
      amount: input.amount ?? null,
      proofImageUrl,
    },
  });
}

export async function listInfaqRecords(actor: Actor) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  return prisma.infaqRecord.findMany({ orderBy: { recordedAt: "desc" } });
}

export async function markInfaqConfirmed(actor: Actor, id: string) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  const record = await prisma.infaqRecord.update({ where: { id }, data: { status: "DIKONFIRMASI" } });
  await writeAuditLog({ actorId: actor.id, action: "INFAQ_CONFIRM", entityType: "InfaqRecord", entityId: id });
  return record;
}

// ---------- Donasi (per kampanye) ----------

export async function listActiveCampaigns() {
  return prisma.donationCampaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listCampaigns(actor: Actor) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  return prisma.donationCampaign.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCampaign(actor: Actor, input: DonationCampaignInput) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  const campaign = await prisma.donationCampaign.create({
    data: { title: input.title, description: input.description ?? null },
  });
  await writeAuditLog({ actorId: actor.id, action: "DONATION_CAMPAIGN_CREATE", entityType: "DonationCampaign", entityId: campaign.id });
  return campaign;
}

export async function setCampaignActive(actor: Actor, id: string, isActive: boolean) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  const campaign = await prisma.donationCampaign.update({ where: { id }, data: { isActive } });
  await writeAuditLog({
    actorId: actor.id,
    action: "DONATION_CAMPAIGN_TOGGLE",
    entityType: "DonationCampaign",
    entityId: id,
    meta: { isActive },
  });
  return campaign;
}

export async function registerDonationPublic(input: DonationRecordInput, proofFile?: File | null) {
  const campaign = await prisma.donationCampaign.findUnique({ where: { id: input.campaignId } });
  if (!campaign || !campaign.isActive) {
    throw new Error("Kampanye donasi tidak ditemukan atau sudah tidak aktif.");
  }

  const proofImageUrl = await saveOptionalProofImage(proofFile);
  return prisma.donationRecord.create({
    data: {
      campaignId: input.campaignId,
      donorName: input.donorName,
      contactInfo: input.contactInfo ?? null,
      amount: input.amount ?? null,
      proofImageUrl,
    },
  });
}

export async function listDonationRecords(actor: Actor) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  return prisma.donationRecord.findMany({
    orderBy: { recordedAt: "desc" },
    include: { campaign: { select: { id: true, title: true } } },
  });
}

export async function markDonationConfirmed(actor: Actor, id: string) {
  assertCan(actor.role, "MANAGE_DONATIONS");
  const record = await prisma.donationRecord.update({ where: { id }, data: { status: "DIKONFIRMASI" } });
  await writeAuditLog({ actorId: actor.id, action: "DONATION_CONFIRM", entityType: "DonationRecord", entityId: id });
  return record;
}
