import "server-only";
import { prisma } from "@/lib/prisma";
import { getBalanceSummary } from "@/server/finance/service";

export async function getDashboardSummary() {
  const [balance, memberCount, upcomingEventCount, pendingTransactionCount, openSuggestionCount, inventoryCount] =
    await Promise.all([
      getBalanceSummary(),
      prisma.member.count(),
      prisma.event.count({ where: { startAt: { gte: new Date() } } }),
      prisma.transaction.count({ where: { status: "PENDING" } }),
      prisma.suggestionTicket.count({ where: { status: "BARU" } }),
      prisma.inventoryItem.count(),
    ]);

  return {
    balance,
    memberCount,
    upcomingEventCount,
    pendingTransactionCount,
    openSuggestionCount,
    inventoryCount,
  };
}
