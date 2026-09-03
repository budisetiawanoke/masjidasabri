import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createTransaction,
  approveTransaction,
  voidTransaction,
  reviseTransaction,
  getTransactionRevisions,
  getBalanceSummary,
} from "@/server/finance/service";
import { ForbiddenError } from "@/lib/rbac";

let superAdmin: { id: string; role: "SUPER_ADMIN" };
let bendahara: { id: string; role: "BENDAHARA" };
let jamaah: { id: string; role: "JAMAAH" };
let incomeCategoryId: string;

beforeAll(async () => {
  const suffix = Date.now();
  const admin = await prisma.user.create({
    data: {
      name: "Test Super Admin",
      email: `super-${suffix}@test.local`,
      passwordHash: "x",
      role: "SUPER_ADMIN",
    },
  });
  const treasurer = await prisma.user.create({
    data: {
      name: "Test Bendahara",
      email: `bendahara-${suffix}@test.local`,
      passwordHash: "x",
      role: "BENDAHARA",
    },
  });
  const member = await prisma.user.create({
    data: {
      name: "Test Jamaah",
      email: `jamaah-${suffix}@test.local`,
      passwordHash: "x",
      role: "JAMAAH",
    },
  });
  const category = await prisma.transactionCategory.create({
    data: { name: `Infaq Test ${suffix}`, kind: "MASUK" },
  });

  superAdmin = { id: admin.id, role: "SUPER_ADMIN" };
  bendahara = { id: treasurer.id, role: "BENDAHARA" };
  jamaah = { id: member.id, role: "JAMAAH" };
  incomeCategoryId = category.id;
});

afterAll(async () => {
  // Database ini dipakai bersama untuk dev/test/produksi (satu Supabase,
  // lihat .env) — WAJIB membersihkan semua baris yang dibuat test ini,
  // urut sesuai foreign key (anak dulu, baru induk).
  const userIds = [superAdmin.id, bendahara.id, jamaah.id];
  await prisma.auditLog.deleteMany({ where: { actorId: { in: userIds } } });
  await prisma.transactionRevision.deleteMany({ where: { changedById: { in: userIds } } });
  await prisma.transaction.deleteMany({ where: { categoryId: incomeCategoryId } });
  await prisma.transactionCategory.delete({ where: { id: incomeCategoryId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe("createTransaction", () => {
  it("rejects a JAMAAH actor (financial recording is staff-only)", async () => {
    await expect(
      createTransaction(jamaah, {
        date: new Date(),
        categoryId: incomeCategoryId,
        amount: 10_000,
        description: "Percobaan tidak sah",
      })
    ).rejects.toThrow(ForbiddenError);
  });

  it("BENDAHARA-recorded transactions start as PENDING, not auto-approved", async () => {
    const tx = await createTransaction(bendahara, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 100_000,
      description: "Infaq dari Bendahara",
    });
    expect(tx.status).toBe("PENDING");
    expect(tx.approvedById).toBeNull();
  });

  it("SUPER_ADMIN-recorded transactions auto-approve (single trusted authority)", async () => {
    const tx = await createTransaction(superAdmin, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 50_000,
      description: "Infaq langsung oleh Super Admin",
    });
    expect(tx.status).toBe("APPROVED");
  });
});

describe("approveTransaction", () => {
  it("moves a PENDING transaction to APPROVED and only then counts toward balance", async () => {
    const before = await getBalanceSummary();

    const tx = await createTransaction(bendahara, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 250_000,
      description: "Menunggu pengesahan",
    });

    const afterCreate = await getBalanceSummary();
    expect(afterCreate.totalMasuk).toBe(before.totalMasuk); // belum masuk saldo

    await approveTransaction(superAdmin, tx.id);

    const afterApprove = await getBalanceSummary();
    expect(afterApprove.totalMasuk).toBe(before.totalMasuk + 250_000);
  });

  it("cannot approve a transaction twice", async () => {
    const tx = await createTransaction(bendahara, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 10_000,
      description: "Sekali sah saja",
    });
    await approveTransaction(superAdmin, tx.id);
    await expect(approveTransaction(superAdmin, tx.id)).rejects.toThrow();
  });

  it("BENDAHARA cannot self-approve (separation of duties)", async () => {
    const tx = await createTransaction(bendahara, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 10_000,
      description: "Coba sahkan sendiri",
    });
    await expect(approveTransaction(bendahara, tx.id)).rejects.toThrow(ForbiddenError);
  });
});

describe("voidTransaction", () => {
  it("only SUPER_ADMIN may void, and voiding removes the amount from the balance", async () => {
    const tx = await createTransaction(superAdmin, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 75_000,
      description: "Akan dibatalkan",
    });
    const beforeVoid = await getBalanceSummary();

    await expect(voidTransaction(bendahara, tx.id, "Bendahara mencoba membatalkan")).rejects.toThrow(
      ForbiddenError
    );

    await voidTransaction(superAdmin, tx.id, "Salah catat kategori");
    const afterVoid = await getBalanceSummary();
    expect(afterVoid.totalMasuk).toBe(beforeVoid.totalMasuk - 75_000);

    const revisions = await getTransactionRevisions(tx.id);
    expect(revisions.some((r) => r.reason.includes("Salah catat kategori"))).toBe(true);
  });
});

describe("reviseTransaction — audit trail integrity", () => {
  it("never overwrites silently: every correction leaves a before/after snapshot", async () => {
    const tx = await createTransaction(bendahara, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 100_000,
      description: "Nominal awal salah ketik",
    });

    const revised = await reviseTransaction(bendahara, {
      transactionId: tx.id,
      date: tx.date,
      categoryId: incomeCategoryId,
      amount: 150_000,
      description: "Nominal awal salah ketik",
      reason: "Koreksi nominal, kurang satu angka nol saat entri",
    });

    expect(revised.amount).toBe(150_000);

    const revisions = await getTransactionRevisions(tx.id);
    expect(revisions.length).toBeGreaterThanOrEqual(1);
    const [latest] = revisions;
    const before = JSON.parse(latest.beforeJson);
    const after = JSON.parse(latest.afterJson);
    expect(before.amount).toBe(100_000);
    expect(after.amount).toBe(150_000);
    expect(latest.reason).toContain("Koreksi nominal");
  });

  it("an APPROVED transaction cannot be revised by BENDAHARA, only by SUPER_ADMIN", async () => {
    const tx = await createTransaction(superAdmin, {
      date: new Date(),
      categoryId: incomeCategoryId,
      amount: 200_000,
      description: "Sudah disahkan",
    });
    expect(tx.status).toBe("APPROVED");

    await expect(
      reviseTransaction(bendahara, {
        transactionId: tx.id,
        date: tx.date,
        categoryId: incomeCategoryId,
        amount: 999_000,
        description: "Coba ubah setelah disahkan",
        reason: "Percobaan tidak sah oleh bendahara",
      })
    ).rejects.toThrow();

    const revised = await reviseTransaction(superAdmin, {
      transactionId: tx.id,
      date: tx.date,
      categoryId: incomeCategoryId,
      amount: 210_000,
      description: "Sudah disahkan, dikoreksi Super Admin",
      reason: "Salah input nominal saat disahkan",
    });
    expect(revised.amount).toBe(210_000);
    expect(revised.status).toBe("APPROVED");
  });
});
