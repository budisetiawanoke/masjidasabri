import { PrismaClient } from "@prisma/client";

// Singleton Prisma client — mencegah terlalu banyak koneksi saat hot-reload
// di development (Next.js me-reload modul server tiap perubahan file).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
