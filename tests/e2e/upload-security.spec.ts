import { test, expect } from "@playwright/test";
import { ACCOUNTS, login } from "./helpers";

test.describe("Keamanan endpoint unggah berkas", () => {
  test("POST /api/upload tanpa sesi ditolak 403, tidak menyimpan berkas apa pun", async ({ request }) => {
    const res = await request.post("/api/upload", {
      multipart: {
        category: "board",
        file: {
          name: "evil.png",
          mimeType: "image/png",
          buffer: Buffer.from("not-a-real-image"),
        },
      },
    });
    expect(res.status()).toBe(403);
  });

  test("Jamaah (tanpa hak kelola konten) ditolak mengunggah berkas", async ({ page, context }) => {
    await login(page, ACCOUNTS.jamaah);

    const res = await context.request.post("/api/upload", {
      multipart: {
        category: "board",
        file: {
          name: "evil.png",
          mimeType: "image/png",
          buffer: Buffer.from("not-a-real-image"),
        },
      },
    });
    expect(res.status()).toBe(403);
  });

  test("Bendahara (peran staf sah) ditolak mengunggah tipe berkas di luar daftar putih", async ({ page, context }) => {
    await login(page, ACCOUNTS.bendahara);

    const res = await context.request.post("/api/upload", {
      multipart: {
        category: "board",
        file: {
          name: "script.html",
          mimeType: "text/html",
          buffer: Buffer.from("<script>alert(1)</script>"),
        },
      },
    });
    expect(res.status()).toBe(400);
  });

  test("Super Admin dengan kategori tidak valid ditolak (bukan salah satu dari daftar kategori yang diizinkan)", async ({
    page,
    context,
  }) => {
    await login(page, ACCOUNTS.superAdmin);

    const res = await context.request.post("/api/upload", {
      multipart: {
        category: "../../etc",
        file: {
          name: "test.png",
          mimeType: "image/png",
          buffer: Buffer.from("fake-png-bytes"),
        },
      },
    });
    expect(res.status()).toBe(400);
  });
});
