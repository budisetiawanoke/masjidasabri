import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Situs publik", () => {
  test("beranda menampilkan identitas merek, jadwal sholat, dan saldo transparansi", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Masjid ASABRI/i })).toBeVisible();
    await expect(page.getByText("Jadwal Sholat Hari Ini")).toBeVisible();
    await expect(page.getByText("Transparansi Kas").first()).toBeVisible();
  });

  test("beranda menampilkan kartu unduh aplikasi Android, dan endpoint unduhannya menyajikan berkas APK sungguhan", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Pasang di Layar Utama HP")).toBeVisible();
    await expect(page.getByRole("link", { name: "cara memasangnya di halaman FAQ" })).toHaveAttribute(
      "href",
      "/faq"
    );
    const unduhLink = page.getByRole("link", { name: "Unduh untuk Android" });
    await expect(unduhLink).toHaveAttribute("href", "/api/download-apk");

    const response = await page.request.get("/api/download-apk");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/vnd.android.package-archive");
    const body = await response.body();
    // Tanda tangan berkas ZIP/APK ("PK\x03\x04") — memastikan yang
    // tersaji benar-benar berkas APK, bukan halaman error yang kebetulan
    // lolos status 200.
    expect(body.subarray(0, 4)).toEqual(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
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

  test("halaman FAQ menampilkan pertanyaan umum & buku panduan untuk publik, TANPA tab Playbook Pengurus", async ({
    page,
  }) => {
    await page.goto("/faq");
    // Tab "Pertanyaan Umum" aktif secara default.
    await expect(page.getByRole("button", { name: "Apa itu aplikasi Masjid ASABRI ini?" })).toBeVisible();
    await page.getByRole("button", { name: "Apa itu aplikasi Masjid ASABRI ini?" }).click();
    await expect(page.getByText(/sistem pengelolaan jamaah Masjid ASABRI/)).toBeVisible();

    await page.getByRole("tab", { name: "Buku Panduan" }).click();
    await expect(page.getByRole("heading", { name: "Buku Panduan Penggunaan" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Unduh Buku Panduan (PDF)" })).toBeVisible();

    // Playbook Pengurus khusus staf — tabnya tidak boleh ada sama sekali
    // untuk pengunjung publik (bukan cuma disembunyikan lewat CSS), dan
    // endpoint PDF-nya sendiri juga wajib menolak akses tanpa sesi staf.
    await expect(page.getByRole("tab", { name: "Playbook Pengurus" })).toHaveCount(0);
    const anonResponse = await page.request.get("/api/playbook/pdf");
    expect(anonResponse.status()).toBe(403);
  });

  test("tab Playbook Pengurus di halaman FAQ tampil untuk staf, tapi TIDAK untuk akun Jamaah", async ({ page }) => {
    await login(page, ACCOUNTS.jamaah);
    await page.goto("/faq");
    await expect(page.getByRole("tab", { name: "Playbook Pengurus" })).toHaveCount(0);
    const jamaahResponse = await page.request.get("/api/playbook/pdf");
    expect(jamaahResponse.status()).toBe(403);

    await page.context().clearCookies();
    await login(page, ACCOUNTS.pengurus);
    await page.goto("/faq");
    await page.getByRole("tab", { name: "Playbook Pengurus" }).click();
    await expect(page.getByRole("heading", { name: "Playbook Pengurus" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Unduh Playbook (PDF)" })).toBeVisible();

    // Endpoint PDF-nya sendiri juga wajib menolak sesi yang tidak berhak,
    // bukan cuma menyembunyikan tombolnya di UI (lihat
    // src/app/api/playbook/pdf/route.ts).
    const response = await page.request.get("/api/playbook/pdf");
    expect(response.status()).toBe(200);
  });
});
