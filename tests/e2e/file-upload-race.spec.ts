import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

// PNG 1x1 valid sungguhan — sama seperti di donations-flow.spec.ts.
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

test.describe("Perlindungan race condition unggah berkas (FileUpload)", () => {
  test("tombol submit nonaktif selama poster masih diunggah, mencegah lampiran hilang diam-diam", async ({ page }) => {
    // <FileUpload> mengunggah berkas secara terpisah (fetch async) dari
    // submit form induk. Sebelum diperbaiki, form bisa disubmit sebelum
    // unggahan selesai, membuat posterUrl/attachmentUrl ikut kosong tanpa
    // pesan error apa pun. Perbaikan: tombol submit dinonaktifkan selama
    // FileUpload melaporkan status "uploading" lewat onUploadStateChange.
    await login(page, ACCOUNTS.superAdmin);
    await page.goto("/dashboard/kegiatan");

    const title = `Kegiatan Uji Race ${Date.now()}`;
    await page.getByLabel("Judul").fill(title);
    await page.getByLabel("Deskripsi").fill("Uji perlindungan race condition unggah poster.");
    await page.getByLabel("Mulai").fill("2027-01-01T08:00");

    const submitButton = page.getByRole("button", { name: /Tambah Kegiatan|Menunggu poster/ });
    await expect(submitButton).toBeEnabled();

    const uploadResponse = page.waitForResponse((res) => res.url().includes("/api/upload"));
    await page.locator('input[type="file"]').first().setInputFiles({
      name: "poster.png",
      mimeType: "image/png",
      buffer: TINY_PNG,
    });

    // Tepat setelah file dipilih (sebelum fetch upload selesai), tombol
    // HARUS sudah nonaktif — ini inti perbaikannya.
    await expect(submitButton).toBeDisabled();
    await expect(page.getByText("Menunggu poster selesai diunggah...")).toBeVisible();

    await uploadResponse;
    await expect(submitButton).toBeEnabled();

    await submitButton.click();
    await expect(page.getByText("Kegiatan ditambahkan.")).toBeVisible();

    await page.goto("/kegiatan");
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByRole("img", { name: title })).toBeVisible();
  });
});
