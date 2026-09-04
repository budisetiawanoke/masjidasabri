/**
 * Bangun CSV dari baris-baris sel — dipakai bersama oleh semua route unduhan
 * CSV (laporan keuangan, laporan detail donasi/infaq/zakat/kurban). Sel yang
 * mengandung koma/tanda kutip/baris baru otomatis dibungkus tanda kutip
 * ganda sesuai aturan CSV standar (RFC 4180) — tanpa ini, nama donatur yang
 * kebetulan mengandung koma akan merusak kolom-kolom sesudahnya.
 *
 * `﻿` (BOM) di depan WAJIB ada supaya Excel di Windows membaca file
 * sebagai UTF-8, bukan salah tebak encoding lokal (karakter "Rp", huruf
 * miring, dsb. jadi karakter aneh tanpa BOM ini).
 */
export function buildCsv(rows: (string | number | null | undefined)[][]): string {
  const escapeCell = (cell: string | number | null | undefined): string => {
    const value = cell === null || cell === undefined ? "" : String(cell);
    if (/[",\r\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const body = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  return "﻿" + body;
}
