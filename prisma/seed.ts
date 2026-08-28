import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data awal Masjid ASABRI...");

  // --- Profil yayasan ---
  const existingProfile = await prisma.foundationProfile.findFirst();
  if (!existingProfile) {
    await prisma.foundationProfile.create({
      data: {
        name: "Yayasan Masjid ASABRI Jatiasih",
        shortName: "Masjid ASABRI",
        periodLabel: "2026 – 2030",
        address: "Jl. Asabri, Jatiasih, Kota Bekasi, Jawa Barat",
        city: "Bekasi",
        latitude: -6.2734,
        longitude: 106.9925,
        phone: "021-0000000",
        email: "sekretariat@masjidasabri.org",
        bankName: "Bank Syariah Indonesia",
        bankAccountNo: "7000000000",
        bankAccountName: "Yayasan Masjid ASABRI Jatiasih",
        aboutText:
          "Yayasan Masjid ASABRI Jatiasih adalah lembaga pengelola masjid yang mengelola ibadah, pendidikan, sosial, dan kemakmuran umat di lingkungan Jatiasih. Pengurus periode 2026–2030 berkomitmen pada transparansi pengelolaan dana umat.",
      },
    });
  }

  // --- Kategori transaksi ---
  const categories = [
    { name: "Infaq Jumat", kind: "MASUK" },
    { name: "Sedekah", kind: "MASUK" },
    { name: "Zakat", kind: "MASUK" },
    { name: "Wakaf", kind: "MASUK" },
    { name: "Donasi Pembangunan", kind: "MASUK" },
    { name: "Operasional Masjid", kind: "KELUAR" },
    { name: "Pemeliharaan & Perbaikan", kind: "KELUAR" },
    { name: "Kegiatan & Dakwah", kind: "KELUAR" },
    { name: "Santunan Sosial", kind: "KELUAR" },
  ] as const;

  const categoryIds: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.transactionCategory.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, kind: c.kind, isSystem: true },
    });
    categoryIds[c.name] = cat.id;
  }

  // --- Pengguna awal ---
  async function upsertUser(email: string, name: string, role: "SUPER_ADMIN" | "ADMIN" | "BENDAHARA" | "JAMAAH", password: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, role, passwordHash },
    });
  }

  const superAdmin = await upsertUser("admin@masjidasabri.org", "Admin Yayasan", "SUPER_ADMIN", "AsabriAdmin#2026");
  const bendahara = await upsertUser("bendahara@masjidasabri.org", "Bendahara Yayasan", "BENDAHARA", "AsabriBendahara#2026");
  await upsertUser("pengurus@masjidasabri.org", "Pengurus Kegiatan", "ADMIN", "AsabriPengurus#2026");
  await upsertUser("jamaah@masjidasabri.org", "Jamaah Contoh", "JAMAAH", "AsabriJamaah#2026");

  // --- Struktur pengurus ---
  const boardCount = await prisma.boardMember.count();
  if (boardCount === 0) {
    await prisma.boardMember.createMany({
      data: [
        { name: "H. Ahmad Sujarwo", position: "Ketua Yayasan", order: 0 },
        { name: "Hj. Siti Rahayu", position: "Wakil Ketua", order: 1 },
        { name: "Budi Santoso", position: "Sekretaris", order: 2 },
        { name: "Bendahara Yayasan", position: "Bendahara", order: 3 },
        { name: "Dedi Kurniawan", position: "Koordinator Kegiatan & Dakwah", order: 4 },
        { name: "Rina Marlina", position: "Koordinator Sosial & Zakat", order: 5 },
      ],
    });
  }

  // --- Contoh transaksi (agar dashboard & laporan tidak kosong saat demo) ---
  const txCount = await prisma.transaction.count();
  if (txCount === 0) {
    const now = new Date();
    const sample = [
      { cat: "Infaq Jumat", amount: 4250000, desc: "Infaq kotak Jumat berjalan", daysAgo: 3 },
      { cat: "Sedekah", amount: 1500000, desc: "Sedekah hamba Allah", daysAgo: 5 },
      { cat: "Donasi Pembangunan", amount: 10000000, desc: "Donasi renovasi tempat wudhu", daysAgo: 10 },
      { cat: "Operasional Masjid", amount: 2100000, desc: "Listrik & air bulan berjalan", daysAgo: 2 },
      { cat: "Pemeliharaan & Perbaikan", amount: 850000, desc: "Perbaikan sound system", daysAgo: 7 },
    ];
    for (const s of sample) {
      const date = new Date(now);
      date.setDate(date.getDate() - s.daysAgo);
      await prisma.transaction.create({
        data: {
          date,
          categoryId: categoryIds[s.cat],
          amount: s.amount,
          description: s.desc,
          recordedById: bendahara.id,
          status: "APPROVED",
          approvedById: superAdmin.id,
          approvedAt: date,
        },
      });
    }
  }

  console.log("Selesai. Akun awal:");
  console.log("  Super Admin : admin@masjidasabri.org / AsabriAdmin#2026");
  console.log("  Bendahara   : bendahara@masjidasabri.org / AsabriBendahara#2026");
  console.log("  Pengurus    : pengurus@masjidasabri.org / AsabriPengurus#2026");
  console.log("  Jamaah      : jamaah@masjidasabri.org / AsabriJamaah#2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
