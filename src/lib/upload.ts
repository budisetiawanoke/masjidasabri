import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put as putBlob } from "@vercel/blob";
import { getFirebaseStorageBucket } from "@/lib/firebase-admin";

/**
 * Penyimpanan berkas unggahan — implementasi dipilih otomatis lewat env var,
 * dicek berurutan (yang pertama cocok dipakai):
 *
 * 1. `FIREBASE_STORAGE_BUCKET` diisi → Cloud Storage for Firebase. Dipakai
 *    saat deploy di Firebase App Hosting — WAJIB karena filesystem-nya
 *    sementara/read-only, sama seperti platform serverless lain.
 * 2. `BLOB_READ_WRITE_TOKEN` diisi → Vercel Blob (kalau suatu saat kembali
 *    deploy di Vercel).
 * 3. Tidak ada keduanya (dev lokal, atau VPS tradisional) → simpan ke
 *    `public/uploads/<kategori>/` di filesystem lokal.
 *
 * Ketiga jalur memakai aturan keamanan yang sama (whitelist MIME, batas
 * ukuran, nama berkas acak) — hanya tujuan penyimpanannya yang berbeda.
 */

export type UploadCategory = "events" | "board" | "foundation" | "transactions" | "announcements" | "public-proof";

const ALLOWED_MIME: Record<UploadCategory, string[]> = {
  events: ["image/jpeg", "image/png", "image/webp"],
  board: ["image/jpeg", "image/png", "image/webp"],
  foundation: ["image/jpeg", "image/png", "image/webp"],
  transactions: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  announcements: ["image/jpeg", "image/png", "image/webp"],
  // Bukti transfer infaq/donasi/zakat/kurban — diunggah publik TANPA login
  // langsung dari server action masing-masing (bukan lewat /api/upload,
  // yang mensyaratkan sesi staf). Gambar saja (bukan PDF) karena ini memang
  // dimaksudkan sebagai screenshot/foto bukti transfer, bukan dokumen resmi.
  "public-proof": ["image/jpeg", "image/png", "image/webp"],
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

  const bucket = getFirebaseStorageBucket();
  if (bucket) {
    const objectPath = `${category}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = bucket.file(objectPath);
    await blob.save(buffer, {
      contentType: file.type,
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });
    await blob.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${objectPath}`;
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await putBlob(`${category}/${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", category);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${category}/${filename}`;
}

/**
 * Bukti transfer (foto/screenshot) untuk infaq, donasi, zakat, dan kurban —
 * semuanya opsional dan diunggah TANPA login. File diproses langsung lewat
 * fungsi ini (bukan lewat /api/upload yang mensyaratkan sesi staf), karena
 * server action publik yang memanggilnya SUDAH menjadi batas kepercayaan
 * yang cukup (submission same-origin, tervalidasi Zod). Kosong/tidak ada
 * file = tidak masalah, bukti memang tidak wajib (tidak semua jamaah sempat
 * screenshot). Dipakai bersama oleh src/server/donations/service.ts dan
 * src/server/zakat/service.ts — jangan duplikasi logikanya di kedua tempat.
 */
export async function saveOptionalProofImage(file: File | null | undefined): Promise<string | null> {
  if (!file || file.size === 0) return null;
  return saveUploadedFile("public-proof", file);
}
