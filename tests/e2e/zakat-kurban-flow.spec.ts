import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Alur pendaftaran Zakat & Kurban", () => {
  test("pendaftaran zakat publik langsung muncul di dashboard admin dan bisa ditandai disalurkan", async ({
    page,
  }) => {
    const uniqueName = `Muzakki Uji ${Date.now()}`;

    await page.goto("/zakat-kurban");
    await page.getByLabel("Nama Muzakki").fill(uniqueName);
    await page.getByLabel("No. HP / Kontak").fill("081234567890");
    await page.getByLabel("Jumlah Jiwa").fill("4");
    await page.getByRole("button", { name: "Daftar", exact: true }).click();
    await expect(page.getByText(/Pendaftaran zakat berhasil dicatat/)).toBeVisible();

    await login(page, ACCOUNTS.superAdmin);
    await page.goto("/dashboard/zakat-kurban");
    const row = page.locator("div.rounded-xl.border", { hasText: uniqueName });
    await expect(row).toBeVisible();

    await row.getByPlaceholder("Disalurkan kepada...").fill("Mustahik RT 04");
    await row.getByRole("button", { name: "Tandai Disalurkan" }).click();
    await expect(page.locator("div.rounded-xl.border", { hasText: uniqueName }).getByText("DISALURKAN")).toBeVisible();
  });

  test("pendaftaran qurban publik muncul di dashboard admin dan status bisa diperbarui", async ({ page }) => {
    const uniqueName = `Shohibul Qurban Uji ${Date.now()}`;

    await page.goto("/zakat-kurban");
    await page.getByLabel("Atas Nama").fill(uniqueName);
    await page.getByLabel("No. HP", { exact: true }).fill("081298765432");
    await page.getByLabel("Nominal Dibayar (Rp)").fill("2500000");
    await page.getByRole("button", { name: "Daftar Qurban" }).click();
    await expect(page.getByText(/Pendaftaran qurban berhasil dicatat/)).toBeVisible();

    await login(page, ACCOUNTS.superAdmin);
    await page.goto("/dashboard/zakat-kurban");
    const row = page.locator("div.rounded-xl.border", { hasText: uniqueName });
    await expect(row).toBeVisible();

    await row.locator("select").selectOption("LUNAS");
    await page.waitForTimeout(500); // beri waktu server action + revalidation selesai
    await page.reload();
    const updatedRow = page.locator("div.rounded-xl.border", { hasText: uniqueName });
    await expect(updatedRow.locator("select")).toHaveValue("LUNAS");
  });
});
