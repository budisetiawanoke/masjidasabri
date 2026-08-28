"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/Field";
import type { UploadCategory } from "@/lib/upload";

/**
 * Input unggah berkas — mengunggah segera saat file dipilih (fetch ke
 * /api/upload), lalu menyimpan URL hasilnya ke input tersembunyi bernama
 * `name` sehingga ikut terkirim saat form induk (server action) disubmit.
 * Form induk sendiri tetap form biasa (bukan multipart) — hanya field ini
 * yang melakukan permintaan terpisah untuk berkasnya.
 */
export function FileUpload({
  name,
  label,
  category,
  defaultValue,
  accept = "image/jpeg,image/png,image/webp",
  hint,
}: {
  name: string;
  label: string;
  category: UploadCategory;
  defaultValue?: string | null;
  accept?: string;
  hint?: string;
}) {
  const inputId = useId();
  const [url, setUrl] = useState<string | null>(defaultValue ?? null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Gagal mengunggah berkas.");
      }

      setUrl(data.url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Gagal mengunggah berkas.");
    }
  }

  const isPdf = url?.toLowerCase().endsWith(".pdf");

  return (
    <div>
      <Label htmlFor={inputId}>{label}</Label>
      <input type="hidden" name={name} value={url ?? ""} />

      {url && !isPdf && (
        <div className="mb-2 h-24 w-24 overflow-hidden rounded-lg border border-border-subtle bg-white">
          <Image src={url} alt="" width={96} height={96} className="h-full w-full object-cover" unoptimized />
        </div>
      )}
      {url && isPdf && (
        <a href={url} target="_blank" rel="noreferrer" className="mb-2 inline-block text-sm text-brand-green-700 underline">
          Lihat berkas PDF terlampir
        </a>
      )}

      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="block w-full text-sm text-foreground/80 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-green-900 hover:file:bg-brand-green-100/70"
      />
      {status === "uploading" && <p className="mt-1 text-xs text-foreground/70">Mengunggah...</p>}
      {status === "error" && <p className="mt-1 text-xs font-medium text-brand-terracotta-700">{error}</p>}
      {hint && status === "idle" && <p className="mt-1 text-xs text-foreground/70">{hint}</p>}
    </div>
  );
}
