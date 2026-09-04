/**
 * 12 bulan terakhir (termasuk bulan berjalan) — dipakai sebagai pilihan
 * periode di semua halaman laporan publik yang berbasis bulan (laporan
 * keuangan, dan laporan detail donasi/infaq/zakat per periode).
 */
export function monthOptions(): { year: number; month: number }[] {
  const now = new Date();
  const options: { year: number; month: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }
  return options;
}

/** Beberapa tahun terakhir (termasuk tahun berjalan) — dipakai laporan kurban, yang per-tahun bukan per-bulan. */
export function yearOptions(count = 5): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
}
