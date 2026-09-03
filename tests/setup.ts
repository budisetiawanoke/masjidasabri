// Satu database Supabase dipakai untuk semua lingkungan (dev, test, produksi)
// — lihat catatan di .env. Karena itu, PrismaClient di sini memakai
// DATABASE_URL dari .env apa adanya (tidak ada lagi override ke database
// lokal terpisah). Setiap test yang membuat data (mis.
// tests/unit/finance-service.test.ts) WAJIB membersihkan barisnya sendiri
// di `afterAll` supaya database bersama ini tidak menumpuk sampah dari
// setiap kali test dijalankan.

import "@testing-library/jest-dom/vitest";
