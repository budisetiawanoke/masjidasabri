import { z } from "zod";

/**
 * Validator untuk field URL gambar/berkas yang bisa diisi lewat dua jalur:
 * (1) diunggah lewat komponen <FileUpload> — hasilnya path relatif seperti
 * "/uploads/events/xxx.jpg", bukan URL absolut; atau (2) ditempel manual
 * sebagai URL eksternal absolut (mis. tautan gambar yang sudah di-hosting
 * di tempat lain). `z.string().url()` bawaan Zod MENOLAK path relatif,
 * jadi field semacam ini harus memakai validator ini, bukan `.url()` biasa.
 */
export const looseUrlOrPath = z
  .string()
  .trim()
  .refine((val) => val === "" || val.startsWith("/") || /^https?:\/\//.test(val), {
    message: "Harus berupa URL yang valid atau berkas yang diunggah.",
  })
  .optional()
  .nullable();
