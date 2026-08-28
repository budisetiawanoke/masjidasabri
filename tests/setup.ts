import { userInfo } from "node:os";

// Arahkan Prisma ke database Postgres TERPISAH khusus pengujian — harus
// dieksekusi SEBELUM modul manapun (termasuk @/lib/prisma) diimpor oleh file
// test, karena PrismaClient membaca DATABASE_URL saat konstruksi. Skema
// disinkronkan ke database ini oleh script "pretest" (lihat package.json)
// sebelum Vitest berjalan.
process.env.DATABASE_URL = `postgresql://${userInfo().username}@localhost:5432/masjid_asabri_test`;

import "@testing-library/jest-dom/vitest";
