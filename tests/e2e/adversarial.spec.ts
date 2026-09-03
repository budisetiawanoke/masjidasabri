import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Uji ketahanan (adversarial)", () => {
  test("Payload XSS pada Kotak Saran disimpan sebagai teks apa adanya, tidak pernah dieksekusi", async ({ page }) => {
    const payload = `<img src=x onerror="window.__xssFired = true">`;

    await page.goto("/kotak-saran");
    await page.getByLabel("Judul").fill("Uji XSS");
    await page.getByLabel("Pesan").fill(payload);
    await page.getByRole("checkbox", { name: "Kirim sebagai anonim" }).check();
    await page.getByRole("button", { name: "Kirim" }).click();
    await expect(page.getByText(/masukan Anda telah kami terima/)).toBeVisible();

    // Payload seharusnya TIDAK pernah tereksekusi di halaman manapun yang
    // merender teks tersebut (React meng-escape teks by default).
    const fired = await page.evaluate(() => (window as unknown as { __xssFired?: boolean }).__xssFired);
    expect(fired).toBeUndefined();

    // Pengurus melihat tiket ini — pastikan payload tetap teks mentah di
    // dashboard (bukan ter-render sebagai elemen <img> sungguhan).
    await login(page, ACCOUNTS.superAdmin);
    await page.goto("/dashboard/kotak-saran");
    await expect(page.getByText("Uji XSS").first()).toBeVisible();
    const injectedImgCount = await page.locator('img[src="x"]').count();
    expect(injectedImgCount).toBe(0);
    const firedAfterAdminView = await page.evaluate(() => (window as unknown as { __xssFired?: boolean }).__xssFired);
    expect(firedAfterAdminView).toBeUndefined();
  });

  test("Payload SQL-injection-like pada pencarian jamaah tidak merusak query atau membocorkan data", async ({
    page,
  }) => {
    await login(page, ACCOUNTS.superAdmin);
    // Data uji agar ada sesuatu untuk "dibocorkan" jika query rusak.
    await page.goto("/dashboard/jamaah");
    await page.getByLabel("Nama Lengkap").fill("Target Rahasia Uji Injection");
    await page.getByRole("button", { name: "Tambah Jamaah" }).click();
    await expect(page.getByText("Jamaah ditambahkan.")).toBeVisible();

    const payload = `' OR '1'='1`;
    await page.goto(`/dashboard/jamaah?q=${encodeURIComponent(payload)}`);
    // Prisma memakai query berparameter — payload diperlakukan sebagai
    // string literal biasa untuk dicari, bukan diselipkan ke SQL. Hasil
    // pencarian harus kosong (tidak ada nama yang benar-benar memuat
    // string itu), bukan membocorkan seluruh tabel jamaah.
    await expect(page.getByText("Target Rahasia Uji Injection")).toHaveCount(0);
    await expect(page.getByText("Tidak ada data.")).toBeVisible();
  });

  test("Pengguna tidak bisa menaikkan perannya sendiri lewat manipulasi request langsung ke rute pengguna", async ({
    page,
    context,
  }) => {
    await login(page, ACCOUNTS.jamaah);

    // Coba kirim POST langsung ke rute /dashboard/pengguna (tanpa header
    // protokol Server Action asli Next.js) dengan role SUPER_ADMIN
    // disisipkan manual di body — mensimulasikan penyerang yang mencoba
    // memalsukan permintaan tanpa lewat form yang sebenarnya.
    await context.request.post("/dashboard/pengguna", {
      form: { id: "any-id", name: "Hacked", role: "SUPER_ADMIN", isActive: "on" },
      failOnStatusCode: false,
    });

    // Yang menentukan bukan status HTTP mentah (Next.js bisa saja
    // mengembalikan 200 berisi halaman biasa untuk request yang tidak
    // dikenalinya sebagai Server Action valid) — yang menentukan adalah
    // EFEK SUNGGUHAN: apakah peran jamaah benar-benar berubah. Verifikasi
    // dengan me-reload sesi jamaah dan memastikan tetap diblokir dari
    // modul yang seharusnya hanya bisa diakses Super Admin.
    await page.goto("/dashboard/pengguna");
    await expect(page.getByText("Akses Ditolak")).toBeVisible(); // tetap ditolak, bukan menampilkan halaman kelola pengguna
    await expect(page.getByRole("heading", { name: "Manajemen Pengguna" })).toHaveCount(0);
  });
});
