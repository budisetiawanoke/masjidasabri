import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type { InventoryItemInput } from "@/server/inventory/schema";

type Actor = { id: string; role: Role };

export async function listInventoryItems() {
  return prisma.inventoryItem.findMany({
    orderBy: { name: "asc" },
    // `responsible` di-select eksplisit (bukan `true` polos) — hasil ini
    // diteruskan ke <InventoryList> (Client Component); tanpa select, field
    // `passwordHash` staf yang tercatat sebagai penanggung jawab ikut
    // tersemat di payload RSC ke browser (pola yang sama ditemukan &
    // diperbaiki di finance, suggestions, & events service).
    include: {
      responsible: { select: { id: true, name: true } },
      maintenanceLogs: { orderBy: { performedAt: "desc" }, take: 3 },
    },
  });
}

export async function createInventoryItem(actor: Actor, input: InventoryItemInput) {
  assertCan(actor.role, "MANAGE_INVENTORY");
  const item = await prisma.inventoryItem.create({
    data: {
      name: input.name,
      category: input.category,
      condition: input.condition,
      quantity: input.quantity,
      location: input.location ?? null,
      acquiredAt: input.acquiredAt ?? null,
      notes: input.notes ?? null,
      responsibleId: input.responsibleId || null,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "INVENTORY_CREATE", entityType: "InventoryItem", entityId: item.id });
  return item;
}

export async function updateInventoryItem(actor: Actor, id: string, input: InventoryItemInput) {
  assertCan(actor.role, "MANAGE_INVENTORY");
  const item = await prisma.inventoryItem.update({
    where: { id },
    data: {
      name: input.name,
      category: input.category,
      condition: input.condition,
      quantity: input.quantity,
      location: input.location ?? null,
      acquiredAt: input.acquiredAt ?? null,
      notes: input.notes ?? null,
      responsibleId: input.responsibleId || null,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "INVENTORY_UPDATE", entityType: "InventoryItem", entityId: item.id });
  return item;
}

export async function deleteInventoryItem(actor: Actor, id: string) {
  assertCan(actor.role, "MANAGE_INVENTORY");
  await prisma.inventoryItem.delete({ where: { id } });
  await writeAuditLog({ actorId: actor.id, action: "INVENTORY_DELETE", entityType: "InventoryItem", entityId: id });
}

export async function addMaintenanceLog(
  actor: Actor,
  input: { itemId: string; description: string; cost?: number | null; performedAt: Date }
) {
  assertCan(actor.role, "MANAGE_INVENTORY");
  const log = await prisma.maintenanceLog.create({
    data: {
      itemId: input.itemId,
      description: input.description,
      cost: input.cost ?? null,
      performedAt: input.performedAt,
      loggedById: actor.id,
    },
  });
  await writeAuditLog({ actorId: actor.id, action: "MAINTENANCE_LOG_CREATE", entityType: "InventoryItem", entityId: input.itemId });
  return log;
}
