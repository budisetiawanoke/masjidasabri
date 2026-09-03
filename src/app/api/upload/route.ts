import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedFile, UploadError, type UploadCategory } from "@/lib/upload";

// "public-proof" sengaja TIDAK termasuk di sini — bukti transfer
// infaq/donasi/zakat/kurban diunggah publik tanpa sesi, langsung dari
// server action masing-masing (lihat saveOptionalProofImage di
// src/lib/upload.ts), bukan lewat endpoint ini yang mensyaratkan sesi staf.
const VALID_CATEGORIES: UploadCategory[] = ["events", "board", "foundation", "transactions", "announcements"];

// Peran staf yang boleh mengunggah berkas — sama seperti peran yang boleh
// mengelola modul terkait (kegiatan/pengurus/yayasan/keuangan). JAMAAH tidak
// pernah diizinkan mengunggah lewat endpoint ini.
const UPLOADER_ROLES = ["SUPER_ADMIN", "ADMIN", "BENDAHARA"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !UPLOADER_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const category = formData.get("category");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
  }
  if (typeof category !== "string" || !VALID_CATEGORIES.includes(category as UploadCategory)) {
    return NextResponse.json({ error: "Kategori berkas tidak valid." }, { status: 400 });
  }

  try {
    const url = await saveUploadedFile(category as UploadCategory, file);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Upload gagal:", error);
    return NextResponse.json({ error: "Gagal mengunggah berkas." }, { status: 500 });
  }
}
