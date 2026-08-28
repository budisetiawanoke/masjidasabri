import { prisma } from "@/lib/prisma";

export async function writeAuditLog(params: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  meta?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metaJson: params.meta ? JSON.stringify(params.meta) : null,
    },
  });
}
