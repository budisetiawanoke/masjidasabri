import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import { saveOptionalProofImage } from "@/lib/upload";
import { createTransaction } from "@/server/finance/service";
import type { Role } from "@prisma/client";
import type { InfaqRecordInput, DonationRecordInput, DonationCampaignInput } from "@/server/donations/schema";

type Actor = { id: string; role: Role };

// Dipakai sebagai `recordedById` transaksi kas yang dibuat OTOMATIS oleh
// sistem (bukan diketik bendahara) — lihat linkInfaqToKasIncome() di bawah,
// dan komentar lengkap di seed.ts (bagian "Akun sistem").
const SYSTEM_ACTOR_EMAIL = "sistem@masjidasabri.internal";
const INFAQ_OPERASIONAL_KAS_CATEGORY = "Infaq & Sadaqah Online";

/**
 * Infaq/sadaqah publik berperuntukan "Operasional Masjid" (dengan nominal
 * terisi) otomatis dicatat sebagai pemasukan kas berstatus PENDING — bendahara
 * tetap harus mengesahkannya seperti transaksi manual lain (nominal belum
 * diverifikasi, cuma diketik sendiri oleh jamaah). Kegagalan langkah ini
 * SENGAJA tidak melempar error — pencatatan infaq sendiri (dan bukti bayar
 * untuk jamaah) tidak boleh gagal gara-gara auto-link kas gagal; bendahara
 * masih bisa catat manual dari daftar infaq kalau ini pernah terjadi.
 */
async function linkInfaqToKasIncome(infaqRecordId: string, input: InfaqRecordInput, proofImageUrl: string | null) {
  if (input.category !== "OPERASIONAL" || !input.amount || input.amount <= 0) return;

  try {
    const [systemUser, category] = await Promise.all([
      prisma.user.findUnique({ where: { email: SYSTEM_ACTOR_EMAIL }, select: { id: true, role: true } }),
      prisma.transactionCategory.findUnique({ where: { name: INFAQ_OPERASIONAL_KAS_CATEGORY } }),
    ]);
    if (!systemUser || !category) return;

    const transaction = await createTransaction(
      { id: systemUser.id, role: systemUser.role },
      {
        date: new Date(),
        categoryId: category.id,
        amount: input.amount,
        description: `Infaq/sadaqah online dari ${input.donorName} — peruntukan Operasional Masjid (otomatis, menunggu konfirmasi bendahara)`,
        attachmentUrl: proofImageUrl ?? undefined,
      }
    );
    await prisma.infaqRecord.update({ where: { id: infaqRecordId }, data: { transactionId: transaction.id } });
  } catch {
    // Diam sengaja — lihat penjelasan di komentar fungsi ini.
  }
}

// ---------- Infaq/Sadaqah (kategori tetap) ----------

export async function registerInfaqPublic(input: InfaqRecordInput, proofFile?: File | null) {
  const proofImageUrl = await saveOptionalProofImage(proofFile);
  const record = await prisma.infaqRecord.create({
    data: {
      category: input.category,
      donorName: input.donorName,
      contactInfo: input.contactInfo ?? null,
      amount: input.amount ?? null,
      proofImageUrl,
    },
  });

  await linkInfaqToKasIncome(record.id, input, proofImageUrl);

  return record;
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
    // include campaign — dipakai submitDonationAction() untuk membangun
    // pratinjau bukti bayar (ReceiptPreview) tanpa query tambahan.
    include: { campaign: { select: { title: true } } },
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

// ---------- Laporan publik (dapat dilihat jamaah tanpa login) ----------

// Diekspor (bukan cuma dipakai internal file ini) — juga dipakai
// src/app/(public)/infaq-sadaqah/actions.ts untuk membangun pratinjau
// bukti bayar (ReceiptPreview) tanpa menduplikasi pemetaan label ini.
export const INFAQ_CATEGORY_LABEL: Record<string, string> = {
  OPERASIONAL: "Operasional Masjid",
  DHUAFA: "Dhuafa",
  ANAK_YATIM: "Anak Yatim",
};

/**
 * Total & jumlah donatur per kampanye — dihitung dari SELURUH catatan
 * (bukan hanya yang sudah dikonfirmasi bendahara), karena nominalnya memang
 * diisi sendiri oleh jamaah saat mendaftar, bukan angka resmi kas yang
 * diaudit seperti laporan keuangan bulanan. `confirmedCount` ditampilkan
 * terpisah supaya jamaah tetap tahu mana yang sudah diverifikasi pengurus.
 */
export async function getDonationReportByCampaign() {
  const campaigns = await prisma.donationCampaign.findMany({
    include: { donations: { select: { amount: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
  return campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    isActive: c.isActive,
    donorCount: c.donations.length,
    confirmedCount: c.donations.filter((d) => d.status === "DIKONFIRMASI").length,
    total: c.donations.reduce((sum, d) => sum + (d.amount ?? 0), 0),
  }));
}

/** Total & jumlah donatur per peruntukan infaq/sadaqah — lihat catatan di getDonationReportByCampaign(). */
export async function getInfaqReportByCategory() {
  const records = await prisma.infaqRecord.findMany({ select: { category: true, amount: true, status: true } });
  const byCategory = new Map<string, { donorCount: number; confirmedCount: number; total: number }>();
  for (const r of records) {
    const entry = byCategory.get(r.category) ?? { donorCount: 0, confirmedCount: 0, total: 0 };
    entry.donorCount += 1;
    if (r.status === "DIKONFIRMASI") entry.confirmedCount += 1;
    entry.total += r.amount ?? 0;
    byCategory.set(r.category, entry);
  }
  // Selalu tampilkan ketiga peruntukan walau belum ada catatan sama sekali,
  // supaya jamaah tahu ketiganya memang tersedia.
  return Object.entries(INFAQ_CATEGORY_LABEL).map(([category, label]) => ({
    category,
    label,
    ...(byCategory.get(category) ?? { donorCount: 0, confirmedCount: 0, total: 0 }),
  }));
}

/**
 * Rincian donasi satu kampanye pada satu bulan — dipakai halaman detail
 * laporan (/donasi/laporan/[campaignId]) dan unduhan CSV/PDF-nya. Beda dari
 * getDonationReportByCampaign() (ringkasan seluruh waktu, semua kampanye) —
 * ini baris per baris satu kampanye satu periode, sesuai pola
 * getMonthlyPublicReport() di src/server/finance/service.ts.
 */
export async function getDonationCampaignDetail(campaignId: string, year: number, month: number) {
  const campaign = await prisma.donationCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return null;

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);
  const records = await prisma.donationRecord.findMany({
    where: { campaignId, recordedAt: { gte: from, lt: to } },
    orderBy: { recordedAt: "desc" },
  });

  return {
    campaign,
    records,
    total: records.reduce((sum, r) => sum + (r.amount ?? 0), 0),
    count: records.length,
  };
}

/** Rincian infaq/sadaqah satu peruntukan pada satu bulan — lihat catatan di getDonationCampaignDetail(). */
export async function getInfaqCategoryDetail(category: string, year: number, month: number) {
  const label = INFAQ_CATEGORY_LABEL[category];
  if (!label) return null;

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);
  const records = await prisma.infaqRecord.findMany({
    where: { category, recordedAt: { gte: from, lt: to } },
    orderBy: { recordedAt: "desc" },
  });

  return {
    category,
    label,
    records,
    total: records.reduce((sum, r) => sum + (r.amount ?? 0), 0),
    count: records.length,
  };
}
