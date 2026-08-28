import type { Page } from "@playwright/test";

export const ACCOUNTS = {
  superAdmin: { email: "admin@masjidasabri.org", password: "AsabriAdmin#2026" },
  bendahara: { email: "bendahara@masjidasabri.org", password: "AsabriBendahara#2026" },
  pengurus: { email: "pengurus@masjidasabri.org", password: "AsabriPengurus#2026" },
  jamaah: { email: "jamaah@masjidasabri.org", password: "AsabriJamaah#2026" },
} as const;

export async function login(page: Page, account: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Kata Sandi").fill(account.password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await page.waitForURL("**/dashboard");
}
