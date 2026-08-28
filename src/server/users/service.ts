import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type { CreateUserInput } from "@/server/users/schema";

type Actor = { id: string; role: Role };

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createUser(actor: Actor, input: CreateUserInput) {
  assertCan(actor.role, "MANAGE_USERS");
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email sudah terdaftar.");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: input.name, email, passwordHash, role: input.role },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "USER_CREATE",
    entityType: "User",
    entityId: user.id,
    meta: { role: user.role },
  });

  return user;
}

export async function updateUser(
  actor: Actor,
  input: { id: string; name: string; role: Role; isActive: boolean }
) {
  assertCan(actor.role, "MANAGE_USERS");

  // Cegah Super Admin mengunci dirinya sendiri: baik lewat penurunan peran
  // maupun menonaktifkan akunnya sendiri. Diperiksa di server (bukan hanya
  // menonaktifkan kontrol di UI) karena atribut `disabled` pada form bisa
  // dilewati dengan mengirim form secara langsung.
  if (actor.id === input.id && actor.role === "SUPER_ADMIN") {
    if (input.role !== "SUPER_ADMIN") {
      throw new Error("Super Admin tidak dapat menurunkan perannya sendiri (mencegah lockout).");
    }
    if (!input.isActive) {
      throw new Error("Super Admin tidak dapat menonaktifkan akunnya sendiri (mencegah lockout).");
    }
  }

  const user = await prisma.user.update({
    where: { id: input.id },
    data: { name: input.name, role: input.role, isActive: input.isActive },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "USER_UPDATE",
    entityType: "User",
    entityId: user.id,
    meta: { role: user.role, isActive: user.isActive },
  });

  return user;
}

export async function resetUserPassword(actor: Actor, id: string, newPassword: string) {
  assertCan(actor.role, "MANAGE_USERS");
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  await writeAuditLog({ actorId: actor.id, action: "USER_PASSWORD_RESET", entityType: "User", entityId: id });
}
