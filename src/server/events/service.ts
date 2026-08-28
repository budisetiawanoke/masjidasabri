import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type { EventInput, AnnouncementInput } from "@/server/events/schema";

type Actor = { id: string; role: Role };

export async function listUpcomingEvents(take = 20) {
  return prisma.event.findMany({
    where: { startAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    orderBy: { startAt: "asc" },
    take,
  });
}

export async function listPastEvents(take = 20) {
  return prisma.event.findMany({
    where: { startAt: { lt: new Date() } },
    orderBy: { startAt: "desc" },
    take,
  });
}

export async function createEvent(actor: Actor, input: EventInput) {
  assertCan(actor.role, "MANAGE_EVENTS");
  const event = await prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      startAt: input.startAt,
      endAt: input.endAt ?? null,
      location: input.location ?? null,
      speaker: input.speaker ?? null,
      posterUrl: input.posterUrl || null,
      createdById: actor.id,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "EVENT_CREATE", entityType: "Event", entityId: event.id });
  return event;
}

export async function updateEvent(actor: Actor, id: string, input: EventInput) {
  assertCan(actor.role, "MANAGE_EVENTS");
  const event = await prisma.event.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      startAt: input.startAt,
      endAt: input.endAt ?? null,
      location: input.location ?? null,
      speaker: input.speaker ?? null,
      posterUrl: input.posterUrl || null,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "EVENT_UPDATE", entityType: "Event", entityId: event.id });
  return event;
}

export async function deleteEvent(actor: Actor, id: string) {
  assertCan(actor.role, "MANAGE_EVENTS");
  await prisma.event.delete({ where: { id } });
  await writeAuditLog({ actorId: actor.id, action: "EVENT_DELETE", entityType: "Event", entityId: id });
}

export async function listAnnouncements(take = 20) {
  return prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    take,
    include: { author: true },
  });
}

export async function createAnnouncement(actor: Actor, input: AnnouncementInput) {
  assertCan(actor.role, "MANAGE_ANNOUNCEMENTS");
  const announcement = await prisma.announcement.create({
    data: {
      title: input.title,
      body: input.body,
      isPinned: input.isPinned ?? false,
      authorId: actor.id,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "ANNOUNCEMENT_CREATE", entityType: "Announcement", entityId: announcement.id });
  return announcement;
}

export async function deleteAnnouncement(actor: Actor, id: string) {
  assertCan(actor.role, "MANAGE_ANNOUNCEMENTS");
  await prisma.announcement.delete({ where: { id } });
  await writeAuditLog({ actorId: actor.id, action: "ANNOUNCEMENT_DELETE", entityType: "Announcement", entityId: id });
}
