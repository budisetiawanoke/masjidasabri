// Kalkulator zakat — fungsi murni, dipakai baik di client (kalkulator publik)
// maupun server. Dipisah dari server/zakat/service.ts (yang bertanda
// "server-only") supaya bisa diimpor komponen client tanpa error build.

/** Kalkulator zakat maal — nisab 85gr emas. */
export function calculateZakatMaal(totalAssetRupiah: number, goldPricePerGram: number) {
  const nisab = goldPricePerGram * 85;
  const wajibZakat = totalAssetRupiah >= nisab;
  const zakatAmount = wajibZakat ? Math.round(totalAssetRupiah * 0.025) : 0;
  return { nisab, wajibZakat, zakatAmount };
}

/** Kalkulator zakat fitrah — default 2.5kg beras per jiwa, bisa diuangkan. */
export function calculateZakatFitrah(familyCount: number, ricePricePerKg: number) {
  const riceKg = familyCount * 2.5;
  const moneyEquivalent = Math.round(riceKg * ricePricePerKg);
  return { riceKg, moneyEquivalent };
}
