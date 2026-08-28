import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type { MemberInput } from "@/server/membership/schema";

type Actor = { id: string; role: Role };

export async function listMembers(query?: string) {
  return prisma.member.findMany({
    where: query
      ? {
          OR: [
            { fullName: { contains: query } },
            { domicile: { contains: query } },
            { phone: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { fullName: "asc" },
  });
}

export async function getMember(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: { transactions: { include: { category: true }, orderBy: { date: "desc" }, take: 20 } },
  });
}

export async function createMember(actor: Actor, input: MemberInput) {
  assertCan(actor.role, "MANAGE_MEMBERS");
  const member = await prisma.member.create({
    data: {
      fullName: input.fullName,
      gender: input.gender ?? null,
      birthDate: input.birthDate ?? null,
      address: input.address ?? null,
      domicile: input.domicile ?? null,
      phone: input.phone ?? null,
      email: input.email || null,
      isVolunteer: input.isVolunteer ?? false,
      notes: input.notes ?? null,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "MEMBER_CREATE", entityType: "Member", entityId: member.id });
  return member;
}

export async function updateMember(actor: Actor, id: string, input: MemberInput) {
  assertCan(actor.role, "MANAGE_MEMBERS");
  const member = await prisma.member.update({
    where: { id },
    data: {
      fullName: input.fullName,
      gender: input.gender ?? null,
      birthDate: input.birthDate ?? null,
      address: input.address ?? null,
      domicile: input.domicile ?? null,
      phone: input.phone ?? null,
      email: input.email || null,
      isVolunteer: input.isVolunteer ?? false,
      notes: input.notes ?? null,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "MEMBER_UPDATE", entityType: "Member", entityId: member.id });
  return member;
}

export async function deleteMember(actor: Actor, id: string) {
  assertCan(actor.role, "MANAGE_MEMBERS");
  await prisma.member.delete({ where: { id } });
  await writeAuditLog({ actorId: actor.id, action: "MEMBER_DELETE", entityType: "Member", entityId: id });
}

export async function listBoardMembers() {
  return prisma.boardMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
}
