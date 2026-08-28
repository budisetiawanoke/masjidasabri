import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type { SuggestionInput } from "@/server/suggestions/schema";

type Actor = { id: string; role: Role };

export async function createSuggestion(actor: Actor | null, input: SuggestionInput) {
  const ticket = await prisma.suggestionTicket.create({
    data: {
      subject: input.subject,
      message: input.message,
      category: input.category,
      isAnonymous: input.isAnonymous ?? !actor,
      authorId: input.isAnonymous ? null : actor?.id ?? null,
      contactInfo: input.contactInfo ?? null,
    },
  });
  return ticket;
}

export async function listSuggestions(actor: Actor, status?: string) {
  assertCan(actor.role, "HANDLE_SUGGESTIONS");
  return prisma.suggestionTicket.findMany({
    where: status ? { status } : undefined,
    include: { author: true, handledBy: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function respondToSuggestion(
  actor: Actor,
  input: { ticketId: string; response: string; status: "DITINDAKLANJUTI" | "SELESAI" }
) {
  assertCan(actor.role, "HANDLE_SUGGESTIONS");
  const ticket = await prisma.suggestionTicket.update({
    where: { id: input.ticketId },
    data: { response: input.response, status: input.status, handledById: actor.id },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "SUGGESTION_RESPOND",
    entityType: "SuggestionTicket",
    entityId: ticket.id,
    meta: { status: input.status },
  });
  return ticket;
}

/** Jamaah hanya boleh melihat tiket miliknya sendiri — isolasi data antar jamaah. */
export async function listOwnSuggestions(actor: Actor) {
  return prisma.suggestionTicket.findMany({
    where: { authorId: actor.id },
    orderBy: { createdAt: "desc" },
  });
}
