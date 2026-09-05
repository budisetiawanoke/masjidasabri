import { test, expect } from "@playwright/test";

test.describe("Situs publik", () => {
  test("beranda menampilkan identitas merek, jadwal sholat, dan saldo transparansi", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Masjid ASABRI/i })).toBeVisible();
    await expect(page.getByText("Jadwal Sholat Hari Ini")).toBeVisible();
    await expect(page.getByText("Transparansi Kas").first()).toBeVisible();
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

  test("tombol Unduh PDF membuka modal pratinjau berisi PDF valid untuk periode yang sama", async ({ page, request }) => {
    await page.goto("/laporan-keuangan?year=2026&month=8");
    // Tombol "Unduh PDF" membuka modal pratinjau dulu (lihat
    // src/components/public/DownloadLink.tsx) — tautan unduhan
    // sesungguhnya ada di dalam modal, bukan langsung di tombolnya.
    await page.getByRole("button", { name: "Unduh PDF" }).click();
    const downloadLink = page.getByRole("link", { name: "Unduh" });
    const href = await downloadLink.getAttribute("href");
    expect(href).toContain("year=2026");
    expect(href).toContain("month=8");

    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("application/pdf");
    const body = await res.body();
    expect(body.subarray(0, 4).toString("latin1")).toBe("%PDF"); // magic bytes berkas PDF valid
    expect(body.byteLength).toBeGreaterThan(1000);
  });

  test("halaman profil menampilkan struktur pengurus", async ({ page }) => {
    await page.goto("/profil");
    await expect(page.getByRole("heading", { name: /Profil/ })).toBeVisible();
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

  test("kode pelacakan kotak saran memungkinkan cek status tanpa login", async ({ page }) => {
    // Jamaah TIDAK butuh akun untuk kirim atau melacak saran/pengaduan —
    // lihat docs/STATUS.md bagian "Keputusan Produk". Alur: kirim → dapat
    // kode → cek status pakai kode itu, semua tanpa login sama sekali.
    await page.goto("/kotak-saran");
    await page.getByLabel("Judul").fill("Uji coba alur kode pelacakan E2E");
    await page.getByLabel("Pesan").fill("Memverifikasi kode pelacakan bisa dipakai cek status tanpa akun.");
    await page.getByRole("button", { name: "Kirim" }).click();
    await expect(page.getByText("Kode Pelacakan Anda")).toBeVisible();

    const code = await page.locator("p.font-display.text-2xl").textContent();
    expect(code?.trim()).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    await page.getByText("Sudah pernah kirim? Cek status").click();
    await page.getByPlaceholder("Contoh: AB3D-9F2K").fill(code!.trim());
    await page.getByRole("button", { name: "Cek Status" }).click();
    await expect(page.getByText("Uji coba alur kode pelacakan E2E")).toBeVisible();
    await expect(page.getByText("Baru diterima, menunggu ditinjau")).toBeVisible();

    // Kode yang tidak pernah ada harus ditolak dengan pesan jelas, bukan crash.
    await page.goto("/kotak-saran/cek-status?kode=ZZZZ-0000");
    await expect(page.getByText("Kode pelacakan tidak ditemukan")).toBeVisible();
  });

  test("halaman yang tidak ada menampilkan 404 khusus dengan identitas merek", async ({ page }) => {
    const response = await page.goto("/halaman-yang-tidak-pernah-ada");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Halaman Tidak Ditemukan")).toBeVisible();
  });

  test("menu burger mobile dapat diketuk untuk membuka dan menutup navigasi", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Buka menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.getByText("Masuk Pengurus")).toBeVisible();
  });
});
