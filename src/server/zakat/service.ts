import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import { saveOptionalProofImage } from "@/lib/upload";
import type { Role } from "@prisma/client";
import type { ZakatRecordInput, QurbanRecordInput } from "@/server/zakat/schema";

type Actor = { id: string; role: Role };

export async function listZakatRecords(year?: number) {
  return prisma.zakatRecord.findMany({
    where: year
      ? { recordedAt: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } }
      : undefined,
    orderBy: { recordedAt: "desc" },
  });
}

/**
 * Pendaftaran mandiri oleh jamaah lewat halaman publik — tanpa perlu login.
 * Bukti transfer (opsional) diproses lewat saveOptionalProofImage, sama
 * seperti infaq/donasi (lihat src/server/donations/service.ts) — tanpa
 * mensyaratkan sesi staf.
 */
export async function registerZakatPublic(input: ZakatRecordInput, proofFile?: File | null) {
  const proofImageUrl = await saveOptionalProofImage(proofFile);
  return prisma.zakatRecord.create({
    data: {
      type: input.type,
      payerName: input.payerName,
      payerContact: input.payerContact ?? null,
      familyCount: input.familyCount,
      amountRice: input.amountRice ?? null,
      amountMoney: input.amountMoney ?? null,
      proofImageUrl,
    },
  });
}

export async function registerQurbanPublic(input: QurbanRecordInput, proofFile?: File | null) {
  const proofImageUrl = await saveOptionalProofImage(proofFile);
  return prisma.qurbanRecord.create({
    data: {
      animalType: input.animalType,
      qurbanFor: input.qurbanFor,
      contactPhone: input.contactPhone ?? null,
      sharesCount: input.sharesCount,
      amountPaid: input.amountPaid,
      year: input.year,
      proofImageUrl,
    },
  });
}

export async function createZakatRecord(actor: Actor, input: ZakatRecordInput) {
  assertCan(actor.role, "MANAGE_ZAKAT");
  const record = await prisma.zakatRecord.create({
    data: {
      type: input.type,
      payerName: input.payerName,
      payerContact: input.payerContact ?? null,
      familyCount: input.familyCount,
      amountRice: input.amountRice ?? null,
      amountMoney: input.amountMoney ?? null,
      distributedTo: input.distributedTo ?? null,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "ZAKAT_CREATE", entityType: "ZakatRecord", entityId: record.id });
  return record;
}

export async function markZakatDistributed(actor: Actor, id: string, distributedTo: string) {
  assertCan(actor.role, "MANAGE_ZAKAT");
  const record = await prisma.zakatRecord.update({
    where: { id },
    data: { status: "DISALURKAN", distributedTo },
  });
  await writeAuditLog({ actorId: actor.id, action: "ZAKAT_DISTRIBUTE", entityType: "ZakatRecord", entityId: id });
  return record;
}

export async function listQurbanRecords(year: number) {
  return prisma.qurbanRecord.findMany({ where: { year }, orderBy: { recordedAt: "desc" } });
}

export async function createQurbanRecord(actor: Actor, input: QurbanRecordInput) {
  assertCan(actor.role, "MANAGE_ZAKAT");
  const record = await prisma.qurbanRecord.create({
    data: {
      animalType: input.animalType,
      qurbanFor: input.qurbanFor,
      contactPhone: input.contactPhone ?? null,
      sharesCount: input.sharesCount,
      amountPaid: input.amountPaid,
      year: input.year,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "QURBAN_CREATE", entityType: "QurbanRecord", entityId: record.id });
  return record;
}

export async function updateQurbanStatus(actor: Actor, id: string, status: string) {
  assertCan(actor.role, "MANAGE_ZAKAT");
  const record = await prisma.qurbanRecord.update({ where: { id }, data: { status } });
  await writeAuditLog({ actorId: actor.id, action: "QURBAN_STATUS_UPDATE", entityType: "QurbanRecord", entityId: id, meta: { status } });
  return record;
}

// ---------- Laporan publik (dapat dilihat jamaah tanpa login) ----------

// Diekspor — juga dipakai src/app/(public)/zakat-kurban/actions.ts untuk
// membangun pratinjau bukti bayar (ReceiptPreview) tanpa menduplikasi
// pemetaan label ini.
export const ZAKAT_TYPE_LABEL: Record<string, string> = { FITRAH: "Zakat Fitrah", MAAL: "Zakat Maal" };
export const ANIMAL_TYPE_LABEL: Record<string, string> = { SAPI: "Sapi (patungan)", KAMBING: "Kambing", DOMBA: "Domba" };

/**
 * Total per jenis zakat (uang & beras terpisah, tidak dijumlahkan jadi satu
 * angka) — mencakup SELURUH catatan (bukan hanya yang sudah disalurkan),
 * lihat catatan yang sama di getDonationReportByCampaign()
 * (src/server/donations/service.ts) soal kenapa tidak difilter status.
 */
export async function getZakatReportByType() {
  const records = await prisma.zakatRecord.findMany({
    select: { type: true, amountMoney: true, amountRice: true, status: true, familyCount: true },
  });
  const byType = new Map<
    string,
    { payerCount: number; distributedCount: number; totalMoney: number; totalRice: number; totalFamilyCount: number }
  >();
  for (const r of records) {
    const entry = byType.get(r.type) ?? { payerCount: 0, distributedCount: 0, totalMoney: 0, totalRice: 0, totalFamilyCount: 0 };
    entry.payerCount += 1;
    if (r.status === "DISALURKAN") entry.distributedCount += 1;
    entry.totalMoney += r.amountMoney ?? 0;
    entry.totalRice += r.amountRice ?? 0;
    entry.totalFamilyCount += r.familyCount;
    byType.set(r.type, entry);
  }
  return Object.entries(ZAKAT_TYPE_LABEL).map(([type, label]) => ({
    type,
    label,
    ...(byType.get(type) ?? { payerCount: 0, distributedCount: 0, totalMoney: 0, totalRice: 0, totalFamilyCount: 0 }),
  }));
}

/** Total per jenis hewan kurban pada satu tahun — default tahun berjalan. */
export async function getQurbanReportByType(year: number = new Date().getFullYear()) {
  const records = await prisma.qurbanRecord.findMany({
    where: { year },
    select: { animalType: true, sharesCount: true, amountPaid: true, status: true },
  });
  const byType = new Map<string, { registrantCount: number; totalShares: number; totalAmount: number }>();
  for (const r of records) {
    const entry = byType.get(r.animalType) ?? { registrantCount: 0, totalShares: 0, totalAmount: 0 };
    entry.registrantCount += 1;
    entry.totalShares += r.sharesCount;
    entry.totalAmount += r.amountPaid;
    byType.set(r.animalType, entry);
  }
  return {
    year,
    rows: Object.entries(ANIMAL_TYPE_LABEL).map(([animalType, label]) => ({
      animalType,
      label,
      ...(byType.get(animalType) ?? { registrantCount: 0, totalShares: 0, totalAmount: 0 }),
    })),
  };
}

/**
 * Rincian zakat satu jenis pada satu bulan — dipakai halaman detail laporan
 * (/zakat/laporan/[type]) dan unduhan CSV/PDF-nya. Lihat catatan di
 * getDonationCampaignDetail() (src/server/donations/service.ts) soal
 * bedanya dari ringkasan getZakatReportByType().
 */
export async function getZakatTypeDetail(type: string, year: number, month: number) {
  const label = ZAKAT_TYPE_LABEL[type];
  if (!label) return null;

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);
  const records = await prisma.zakatRecord.findMany({
    where: { type, recordedAt: { gte: from, lt: to } },
    orderBy: { recordedAt: "desc" },
  });

  return {
    type,
    label,
    records,
    totalMoney: records.reduce((sum, r) => sum + (r.amountMoney ?? 0), 0),
    totalRice: records.reduce((sum, r) => sum + (r.amountRice ?? 0), 0),
    count: records.length,
  };
}

/** Rincian kurban satu jenis hewan pada satu tahun — lihat catatan di getZakatTypeDetail(). */
export async function getQurbanTypeDetail(animalType: string, year: number) {
  const label = ANIMAL_TYPE_LABEL[animalType];
  if (!label) return null;

  const records = await prisma.qurbanRecord.findMany({
    where: { animalType, year },
    orderBy: { recordedAt: "desc" },
  });

  return {
    animalType,
    label,
    year,
    records,
    totalAmount: records.reduce((sum, r) => sum + r.amountPaid, 0),
    totalShares: records.reduce((sum, r) => sum + r.sharesCount, 0),
    count: records.length,
  };
}
