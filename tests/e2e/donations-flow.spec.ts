import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

// PNG 1x1 valid sungguhan — dipakai untuk menguji jalur unggah bukti
// transfer (harus lolos whitelist MIME image/png, beda dari
// upload-security.spec.ts yang sengaja memakai byte palsu untuk uji tolak).
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

test.describe("Alur Infaq/Sadaqah & Donasi", () => {
  test("Jamaah publik bisa mengirim infaq/sadaqah dengan bukti transfer, tanpa perlu akun", async ({ page }) => {
    await page.goto("/infaq-sadaqah");
    await page.getByLabel("Peruntukan").selectOption("DHUAFA");
    await page.getByLabel("Nama").fill("Donatur Uji E2E");
    await page.getByLabel("Nominal (Rp, opsional)").fill("100000");
    await page.locator('input[name="proofImage"]').setInputFiles({
      name: "bukti.png",
      mimeType: "image/png",
      buffer: TINY_PNG,
    });
    await page.getByRole("button", { name: "Kirim Infaq/Sadaqah" }).click();
    await expect(page.getByText(/telah kami catat/)).toBeVisible();
  });

  test("Super Admin membuat kampanye donasi, lalu publik bisa berdonasi ke kampanye itu dan pengurus bisa mengonfirmasi", async ({
    page,
  }) => {
    const campaignTitle = `Kampanye Uji E2E ${Date.now()}`;

    await login(page, ACCOUNTS.superAdmin);
    await page.goto("/dashboard/infaq-donasi");
    await page.getByLabel("Judul Kampanye Baru").fill(campaignTitle);
    await page.getByRole("button", { name: "Tambah Kampanye" }).click();
    await expect(page.getByText("Kampanye donasi ditambahkan.")).toBeVisible();
    await expect(page.getByText(campaignTitle)).toBeVisible();

    // Publik (tanpa sesi) melihat kampanye yang baru dibuat & berdonasi.
    const publicPage = await page.context().browser()!.newPage();
    await publicPage.goto("/donasi");
    await expect(publicPage.getByText(campaignTitle).first()).toBeVisible();
    await publicPage.getByLabel("Kampanye Donasi").selectOption({ label: campaignTitle });
    await publicPage.getByLabel("Nama").fill("Donatur Kampanye Uji");
    await publicPage.locator('input[name="proofImage"]').setInputFiles({
      name: "bukti-donasi.png",
      mimeType: "image/png",
      buffer: TINY_PNG,
    });
    await publicPage.getByRole("button", { name: "Kirim Donasi" }).click();
    await expect(publicPage.getByText(/telah kami catat/)).toBeVisible();
    await publicPage.close();

    // Pengurus melihat donasi masuk dan bisa mengonfirmasinya.
    await page.reload();
    await expect(page.getByText("Donatur Kampanye Uji").first()).toBeVisible();
    const donationRow = page.locator(".rounded-xl", { hasText: "Donatur Kampanye Uji" }).first();
    await donationRow.getByRole("button", { name: "Konfirmasi" }).click();
    await expect(page.getByText("DIKONFIRMASI").first()).toBeVisible();
  });
});

test.describe("Zakat & Kurban dipisah", () => {
  test("Zakat dan Kurban jadi dua halaman terpisah, /zakat-kurban lama dialihkan ke /zakat", async ({ page }) => {
    await page.goto("/zakat");
    await expect(page.getByRole("heading", { name: "Kalkulator Zakat Maal" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Daftar Qurban" })).toHaveCount(0);

    await page.goto("/kurban");
    await expect(page.getByRole("button", { name: "Daftar Qurban" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Kalkulator Zakat Maal" })).toHaveCount(0);

    await page.goto("/zakat-kurban");
    await expect(page).toHaveURL(/\/zakat$/);
  });
});

test.describe("Banner pengumuman & kegiatan", () => {
  test("Pengumuman dengan gambar dan kegiatan dengan poster tampil dengan banner di halaman publik", async ({ page }) => {
    await login(page, ACCOUNTS.superAdmin);

    const title = `Pengumuman Banner Uji ${Date.now()}`;
    await page.goto("/dashboard/pengumuman");
    await page.getByLabel("Judul").fill(title);
    await page.getByLabel("Isi Pengumuman").fill("Uji tampilan banner pengumuman.");
    const uploadResponse = page.waitForResponse((res) => res.url().includes("/api/upload"));
    await page.locator('input[type="file"]').first().setInputFiles({
      name: "banner.png",
      mimeType: "image/png",
      buffer: TINY_PNG,
    });
    // FileUpload mengunggah segera saat file dipilih (fetch terpisah ke
    // /api/upload) dan baru mengisi input tersembunyi setelah itu selesai —
    // kalau form disubmit sebelum ini beres, imageUrl ikut terkirim kosong.
    await uploadResponse;
    await page.getByRole("button", { name: "Publikasikan" }).click();
    await expect(page.getByText("Pengumuman dipublikasikan.")).toBeVisible();

    await page.goto("/pengumuman");
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByRole("img", { name: title })).toBeVisible();
  });
});
