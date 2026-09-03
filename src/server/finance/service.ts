import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan, type Permission } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type {
  CreateTransactionInput,
  ReviseTransactionInput,
} from "@/server/finance/schema";

type Actor = { id: string; role: Role };

function requirePermission(actor: Actor, permission: Permission) {
  assertCan(actor.role, permission);
}

export async function listCategories() {
  return prisma.transactionCategory.findMany({ orderBy: [{ kind: "asc" }, { name: "asc" }] });
}

export async function createCategory(actor: Actor, input: { name: string; kind: "MASUK" | "KELUAR" }) {
  requirePermission(actor, "MANAGE_CATEGORIES");
  const category = await prisma.transactionCategory.create({
    data: { name: input.name, kind: input.kind },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "CATEGORY_CREATE",
    entityType: "TransactionCategory",
    entityId: category.id,
    meta: { name: category.name, kind: category.kind },
  });
  return category;
}

export async function createTransaction(actor: Actor, input: CreateTransactionInput) {
  requirePermission(actor, "RECORD_TRANSACTION");

  const category = await prisma.transactionCategory.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new Error("Kategori transaksi tidak ditemukan.");

  const transaction = await prisma.transaction.create({
    data: {
      date: input.date,
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      memberId: input.memberId || null,
      attachmentUrl: input.attachmentUrl || null,
      recordedById: actor.id,
      status: actor.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING",
      approvedById: actor.role === "SUPER_ADMIN" ? actor.id : null,
      approvedAt: actor.role === "SUPER_ADMIN" ? new Date() : null,
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "TRANSACTION_CREATE",
    entityType: "Transaction",
    entityId: transaction.id,
    meta: { amount: transaction.amount, categoryId: transaction.categoryId, kind: category.kind },
  });

  return transaction;
}

export async function approveTransaction(actor: Actor, transactionId: string) {
  requirePermission(actor, "APPROVE_TRANSACTION");

  const existing = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!existing) throw new Error("Transaksi tidak ditemukan.");
  if (existing.status !== "PENDING") {
    throw new Error("Hanya transaksi berstatus PENDING yang bisa disahkan.");
  }

  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "APPROVED", approvedById: actor.id, approvedAt: new Date() },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "TRANSACTION_APPROVE",
    entityType: "Transaction",
    entityId: transaction.id,
  });

  return transaction;
}

export async function voidTransaction(actor: Actor, transactionId: string, reason: string) {
  requirePermission(actor, "VOID_TRANSACTION");

  const existing = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!existing) throw new Error("Transaksi tidak ditemukan.");
  if (existing.status === "VOID") throw new Error("Transaksi sudah dibatalkan sebelumnya.");

  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "VOID", voidReason: reason },
  });

  await prisma.transactionRevision.create({
    data: {
      transactionId,
      changedById: actor.id,
      beforeJson: JSON.stringify(existing),
      afterJson: JSON.stringify(transaction),
      reason: `[PEMBATALAN] ${reason}`,
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "TRANSACTION_VOID",
    entityType: "Transaction",
    entityId: transaction.id,
    meta: { reason },
  });

  return transaction;
}

/**
 * Koreksi transaksi — tidak pernah menimpa data tanpa jejak. Setiap koreksi
 * menyimpan snapshot before/after di TransactionRevision, sehingga laporan
 * publik tetap bisa diaudit oleh jamaah.
 */
export async function reviseTransaction(actor: Actor, input: ReviseTransactionInput) {
  requirePermission(actor, "RECORD_TRANSACTION");

  const existing = await prisma.transaction.findUnique({ where: { id: input.transactionId } });
  if (!existing) throw new Error("Transaksi tidak ditemukan.");
  if (existing.status === "VOID") throw new Error("Transaksi yang dibatalkan tidak bisa dikoreksi.");
  if (existing.status === "APPROVED" && actor.role !== "SUPER_ADMIN") {
    throw new Error("Transaksi yang sudah disahkan hanya bisa dikoreksi oleh Super Admin.");
  }

  const updated = await prisma.transaction.update({
    where: { id: input.transactionId },
    data: {
      date: input.date,
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      // koreksi pada transaksi yang sudah APPROVED mengembalikannya ke PENDING
      // agar disahkan ulang, kecuali dilakukan Super Admin.
      status: existing.status === "APPROVED" && actor.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING",
    },
  });

  await prisma.transactionRevision.create({
    data: {
      transactionId: input.transactionId,
      changedById: actor.id,
      beforeJson: JSON.stringify(existing),
      afterJson: JSON.stringify(updated),
      reason: input.reason,
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "TRANSACTION_REVISE",
    entityType: "Transaction",
    entityId: updated.id,
    meta: { reason: input.reason },
  });

  return updated;
}

export async function listTransactions(filters: {
  status?: "PENDING" | "APPROVED" | "VOID";
  categoryId?: string;
  from?: Date;
  to?: Date;
  take?: number;
  skip?: number;
}) {
  return prisma.transaction.findMany({
    where: {
      status: filters.status,
      categoryId: filters.categoryId,
      date: filters.from || filters.to ? { gte: filters.from, lte: filters.to } : undefined,
    },
    // recordedBy/approvedBy WAJIB pakai `select` (bukan `true` polos) — hasil
    // findMany ini diteruskan langsung ke <TransactionList> (Client
    // Component), jadi field apa pun yang ikut ter-include (termasuk
    // `passwordHash` milik staf yang mencatat/mengesahkan) akan tersemat di
    // payload RSC yang dikirim ke browser. Ditemukan & diperbaiki saat audit
    // halaman per peran.
    include: {
      category: true,
      recordedBy: { select: { id: true, name: true } },
      approvedBy: { select: { id: true, name: true } },
      member: true,
    },
    orderBy: { date: "desc" },
    take: filters.take ?? 50,
    skip: filters.skip ?? 0,
  });
}

export async function getTransactionRevisions(transactionId: string) {
  return prisma.transactionRevision.findMany({
    where: { transactionId },
    // Lihat catatan di listTransactions() di atas — pola yang sama.
    include: { changedBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/** Saldo saat ini per kategori — hanya menghitung transaksi APPROVED. */
export async function getBalanceSummary() {
  const categories = await prisma.transactionCategory.findMany();
  const approved = await prisma.transaction.findMany({
    where: { status: "APPROVED" },
    select: { categoryId: true, amount: true },
  });

  const byCategory = new Map<string, number>();
  for (const t of approved) {
    byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) + t.amount);
  }

  let totalMasuk = 0;
  let totalKeluar = 0;
  const rows = categories.map((c) => {
    const total = byCategory.get(c.id) ?? 0;
    if (c.kind === "MASUK") totalMasuk += total;
    else totalKeluar += total;
    return { category: c, total };
  });

  return { rows, totalMasuk, totalKeluar, saldo: totalMasuk - totalKeluar };
}

/** Laporan publik teragregasi untuk satu bulan — dipakai halaman transparansi. */
export async function getMonthlyPublicReport(year: number, month: number) {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);

  const transactions = await prisma.transaction.findMany({
    where: { status: "APPROVED", date: { gte: from, lt: to } },
    include: { category: true },
    orderBy: { date: "asc" },
  });

  const byCategory = new Map<string, { name: string; kind: string; total: number; count: number }>();
  let totalMasuk = 0;
  let totalKeluar = 0;
  for (const t of transactions) {
    const key = t.categoryId;
    const entry = byCategory.get(key) ?? { name: t.category.name, kind: t.category.kind, total: 0, count: 0 };
    entry.total += t.amount;
    entry.count += 1;
    byCategory.set(key, entry);
    if (t.category.kind === "MASUK") totalMasuk += t.amount;
    else totalKeluar += t.amount;
  }

  return {
    year,
    month,
    categories: Array.from(byCategory.values()),
    totalMasuk,
    totalKeluar,
    net: totalMasuk - totalKeluar,
    transactionCount: transactions.length,
  };
}
