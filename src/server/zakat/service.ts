import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
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

/** Pendaftaran mandiri oleh jamaah lewat halaman publik — tanpa perlu login. */
export async function registerZakatPublic(input: ZakatRecordInput) {
  return prisma.zakatRecord.create({
    data: {
      type: input.type,
      payerName: input.payerName,
      payerContact: input.payerContact ?? null,
      familyCount: input.familyCount,
      amountRice: input.amountRice ?? null,
      amountMoney: input.amountMoney ?? null,
    },
  });
}

export async function registerQurbanPublic(input: QurbanRecordInput) {
  return prisma.qurbanRecord.create({
    data: {
      animalType: input.animalType,
      qurbanFor: input.qurbanFor,
      contactPhone: input.contactPhone ?? null,
      sharesCount: input.sharesCount,
      amountPaid: input.amountPaid,
      year: input.year,
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
