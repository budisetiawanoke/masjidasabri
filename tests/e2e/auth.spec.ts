import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Autentikasi", () => {
  test("mengunjungi /dashboard tanpa sesi mengarahkan ke halaman login dengan callbackUrl", async ({ page }) => {
    await page.goto("/dashboard/keuangan");
    await page.waitForURL(/\/login\?callbackUrl=/);
    await expect(page.getByRole("heading", { name: /Masuk ke Sistem/ })).toBeVisible();
  });

  test("kata sandi salah menampilkan pesan error dan tidak meloloskan sesi", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(ACCOUNTS.superAdmin.email);
    await page.getByLabel("Kata Sandi").fill("kata-sandi-salah-sekali");
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(/salah|dinonaktifkan/);
    await expect(page).toHaveURL(/\/login/);
  });

  test("login sukses sebagai Super Admin mengarah ke dashboard dengan nama pengguna tampil", async ({ page }) => {
    await login(page, ACCOUNTS.superAdmin);
    await expect(page.getByRole("heading", { name: "Ringkasan Dashboard" })).toBeVisible();
  });

  test("tombol Keluar mengakhiri sesi dan mengembalikan proteksi rute", async ({ page }) => {
    await login(page, ACCOUNTS.superAdmin);
    await page.getByRole("button", { name: "Keluar" }).click();
    await page.waitForURL("http://localhost:3000/");
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
  });
});
