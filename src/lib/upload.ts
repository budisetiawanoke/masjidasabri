import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Penyimpanan berkas lokal di `public/uploads/<kategori>/` — cocok untuk
 * deployment single-server tradisional (VPS) yang juga dipakai SQLite dev.db
 * aplikasi ini. TIDAK cocok untuk platform serverless (mis. Vercel) karena
 * filesystem-nya bersifat sementara/read-only — jika nanti pindah ke sana,
 * ganti implementasi ini dengan object storage (S3-compatible).
 */

export type UploadCategory = "events" | "board" | "foundation" | "transactions";

const ALLOWED_MIME: Record<UploadCategory, string[]> = {
  events: ["image/jpeg", "image/png", "image/webp"],
  board: ["image/jpeg", "image/png", "image/webp"],
  foundation: ["image/jpeg", "image/png", "image/webp"],
  transactions: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export class UploadError extends Error {
  status = 400;
}

export async function saveUploadedFile(category: UploadCategory, file: File): Promise<string> {
  if (!ALLOWED_MIME[category].includes(file.type)) {
    throw new UploadError(
      `Tipe berkas "${file.type || "tidak dikenal"}" tidak diizinkan untuk kategori ini. Format yang diterima: ${ALLOWED_MIME[
        category
      ].join(", ")}.`
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError(`Ukuran berkas maksimal ${MAX_SIZE_BYTES / 1024 / 1024}MB.`);
  }
  if (file.size === 0) {
    throw new UploadError("Berkas kosong.");
  }

  const ext = EXT_BY_MIME[file.type];
  // Nama berkas acak (bukan nama asli) — mencegah path traversal dan
  // tabrakan nama, sekaligus tidak membocorkan nama berkas asli pengguna.
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", category);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${category}/${filename}`;
}
