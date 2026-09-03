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
        name: "Masjid ASABRI",
        shortName: "Masjid ASABRI",
        periodLabel: "2026 – 2030",
        address: "Jl. Asabri, Jatiasih, Jawa Barat",
        city: "Jatiasih",
        latitude: -6.2734,
        longitude: 106.9925,
        phone: "021-0000000",
        email: "sekretariat@masjidasabri.org",
        bankName: "Bank Syariah Indonesia",
        bankAccountNo: "7000000000",
        bankAccountName: "Masjid ASABRI",
        aboutText:
          "Masjid ASABRI adalah lembaga pengelola masjid yang mengelola ibadah, pendidikan, sosial, dan kemakmuran umat. Pengurus berkomitmen pada transparansi pengelolaan dana umat.",
      },
    });
  } else {
    await prisma.foundationProfile.update({
      where: { id: existingProfile.id },
      data: {
        name: "Masjid ASABRI",
        shortName: "Masjid ASABRI",
        bankAccountName: "Masjid ASABRI",
        aboutText:
          "Masjid ASABRI adalah lembaga pengelola masjid yang mengelola ibadah, pendidikan, sosial, dan kemakmuran umat. Pengurus berkomitmen pada transparansi pengelolaan dana umat.",
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

  // --- Akun pengguna ---
  const passwordHash = await bcrypt.hash("AsabriAdmin#2026", 10);
  const users = [
    { email: "admin@masjidasabri.org", name: "Super Admin", role: "SUPER_ADMIN" as const, pass: "AsabriAdmin#2026" },
    { email: "bendahara@masjidasabri.org", name: "Bendahara Masjid", role: "BENDAHARA" as const, pass: "AsabriBendahara#2026" },
    { email: "pengurus@masjidasabri.org", name: "Pengurus Masjid", role: "ADMIN" as const, pass: "AsabriPengurus#2026" },
    { email: "jamaah@masjidasabri.org", name: "Jamaah Contoh", role: "JAMAAH" as const, pass: "AsabriJamaah#2026" },
  ];

  const userRecords: Record<string, string> = {};
  for (const u of users) {
    const hash = u.pass === "AsabriAdmin#2026" ? passwordHash : await bcrypt.hash(u.pass, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, passwordHash: hash },
      create: { email: u.email, name: u.name, role: u.role, passwordHash: hash, isActive: true },
    });
    userRecords[u.role] = user.id;
  }

  console.log("Selesai. Akun awal:");
  console.log("  Super Admin : admin@masjidasabri.org / AsabriAdmin#2026");
  console.log("  Bendahara   : bendahara@masjidasabri.org / AsabriBendahara#2026");
  console.log("  Pengurus    : pengurus@masjidasabri.org / AsabriPengurus#2026");
  console.log("  Jamaah      : jamaah@masjidasabri.org / AsabriJamaah#2026");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
