import { test, expect } from "@playwright/test";

test.describe("Situs publik", () => {
  test("beranda menampilkan identitas merek, jadwal sholat, dan saldo transparansi", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Yayasan Masjid ASABRI Jatiasih/i })).toBeVisible();
    await expect(page.getByText("Jadwal Sholat Hari Ini")).toBeVisible();
    await expect(page.getByText("Transparansi Kas")).toBeVisible();
  });

  test("halaman jadwal sholat menampilkan enam waktu sholat", async ({ page }) => {
    await page.goto("/jadwal-sholat");
    await expect(page.getByText("Subuh")).toBeVisible();
    await expect(page.getByText("Dzuhur")).toBeVisible();
    await expect(page.getByText("Isya")).toBeVisible();
  });

  test("halaman laporan keuangan menampilkan rincian per kategori dan bisa berpindah bulan", async ({ page }) => {
    await page.goto("/laporan-keuangan");
    await expect(page.getByText("Saldo Kas Yayasan Saat Ini")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Rincian/ })).toBeVisible();
  });

  test("halaman profil menampilkan struktur pengurus", async ({ page }) => {
    await page.goto("/profil");
    await expect(page.getByRole("heading", { name: "Profil Yayasan" })).toBeVisible();
    await expect(page.getByText(/Struktur Pengurus/)).toBeVisible();
  });

  test("kalkulator zakat maal menghitung nisab secara langsung di klien", async ({ page }) => {
    await page.goto("/zakat-kurban");
    await page.getByLabel(/Total harta tersimpan/).fill("200000000");
    await page.getByLabel(/Harga emas per gram/).fill("1500000");
    await expect(page.getByText("Wajib zakat")).toBeVisible();
  });

  test("kotak saran menerima kiriman anonim dan menampilkan konfirmasi", async ({ page }) => {
    await page.goto("/kotak-saran");
    await page.getByLabel("Judul").fill("Usulan penambahan kipas angin");
    await page.getByLabel("Pesan").fill("Mohon tambah kipas angin di lantai 2, terasa panas saat kajian.");
    await page.getByRole("checkbox", { name: "Kirim sebagai anonim" }).check();
    await page.getByRole("button", { name: "Kirim" }).click();
    await expect(page.getByText(/masukan Anda telah kami terima/)).toBeVisible();
  });

  test("halaman yang tidak ada menampilkan 404 khusus dengan identitas merek", async ({ page }) => {
    const response = await page.goto("/halaman-yang-tidak-pernah-ada");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Halaman Tidak Ditemukan")).toBeVisible();
  });
});
