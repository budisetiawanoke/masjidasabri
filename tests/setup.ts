// Arahkan Prisma ke database SQLite terpisah khusus pengujian — harus
// dieksekusi SEBELUM modul manapun (termasuk @/lib/prisma) diimpor oleh file
// test, karena PrismaClient membaca DATABASE_URL saat konstruksi.
process.env.DATABASE_URL = "file:./test.db";

import "@testing-library/jest-dom/vitest";
