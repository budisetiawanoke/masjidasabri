import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Isolasi akses berbasis peran", () => {
  test("Jamaah diblokir dari modul Keuangan, Pengguna, dan Jamaah walau mengetik URL langsung", async ({ page }) => {
    await login(page, ACCOUNTS.jamaah);

    await page.goto("/dashboard/keuangan");
    await expect(page.getByText("Akses Ditolak")).toBeVisible();

    await page.goto("/dashboard/pengguna");
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard/jamaah");
    await expect(page.getByText("Akses Ditolak")).toBeVisible();
  });

  test("Jamaah hanya melihat menu Ringkasan di sidebar", async ({ page }) => {
    await login(page, ACCOUNTS.jamaah);
    // Pada viewport lebar, sidebar desktop tampil langsung tanpa tombol hamburger.
    const nav = page.getByRole("navigation", { name: "Navigasi dashboard" });
    await expect(nav.getByRole("link")).toHaveCount(1);
    await expect(nav.getByRole("link", { name: "Ringkasan" })).toBeVisible();
  });

  test("Bendahara dapat membuka Keuangan tapi tetap diblokir dari Pengaturan Yayasan", async ({ page }) => {
    await login(page, ACCOUNTS.bendahara);

    await page.goto("/dashboard/keuangan");
    await expect(page.getByRole("heading", { name: "Keuangan" })).toBeVisible();

    await page.goto("/dashboard/pengaturan");
    await page.waitForURL("**/dashboard");
  });

  test("Pengurus (ADMIN) dapat mengesahkan transaksi tapi tombol Batalkan tidak tersedia untuknya", async ({ page }) => {
    await login(page, ACCOUNTS.pengurus);
    await page.goto("/dashboard/keuangan");
    await expect(page.getByRole("heading", { name: "Keuangan" })).toBeVisible();
    // ADMIN tidak punya izin VOID_TRANSACTION — tombol "Batalkan" tidak boleh muncul.
    await expect(page.getByRole("button", { name: "Batalkan" })).toHaveCount(0);
  });
});
