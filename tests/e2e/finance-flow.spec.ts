import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Alur kerja pencatatan → pengesahan transaksi", () => {
  test("transaksi yang dicatat Bendahara menunggu pengesahan, lalu tampak disahkan setelah Super Admin menyetujui", async ({
    page,
  }) => {
    const uniqueNote = `Uji e2e ${Date.now()}`;

    await login(page, ACCOUNTS.bendahara);
    await page.goto("/dashboard/keuangan");

    await page.getByLabel("Nominal (Rp)").fill("123000");
    await page.getByLabel("Kategori", { exact: true }).selectOption({ label: "Infaq Jumat" });
    await page.getByLabel("Keterangan").fill(uniqueNote);
    await page.getByRole("button", { name: "Catat Transaksi" }).click();

    await expect(page.getByText("Transaksi berhasil dicatat.")).toBeVisible();
    const row = page.locator("div.rounded-xl.border", { hasText: uniqueNote });
    await expect(row.getByText("PENDING", { exact: true })).toBeVisible();

    // Bendahara tidak boleh melihat tombol "Sahkan" pada transaksinya sendiri.
    await expect(page.getByRole("button", { name: "Sahkan" })).toHaveCount(0);

    await page.getByRole("button", { name: "Keluar" }).click();
    await page.waitForURL("http://localhost:3000/");

    await login(page, ACCOUNTS.superAdmin);
    await page.goto("/dashboard/keuangan");

    const pendingRow = page.locator("div.rounded-xl.border", { hasText: uniqueNote });
    await pendingRow.getByRole("button", { name: "Sahkan" }).click();
    await expect(page.locator("div.rounded-xl.border", { hasText: uniqueNote }).getByText("APPROVED", { exact: true })).toBeVisible();
  });
});
