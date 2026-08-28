/**
 * Perhitungan waktu sholat lokal (hisab) — dipakai sebagai fallback ketika
 * API publik (Aladhan) tidak dapat diakses, agar fitur jadwal sholat tidak
 * rusak total tanpa koneksi internet.
 *
 * Menggunakan pendekatan posisi matahari standar NOAA (deklinasi & equation
 * of time, rumus Cooper — domain publik, dipakai luas dalam kalkulator
 * astronomi) untuk menurunkan waktu Subuh/Terbit/Dzuhur/Ashar/Maghrib/Isya
 * dari sudut matahari di bawah ufuk. Akurasi ±1–2 menit, sepadan dengan
 * margin ikhtiyati yang lazim dipakai jadwal sholat cetak.
 */

export type HisabMethod = {
  fajrAngle: number; // derajat di bawah ufuk saat masuk Subuh
  ishaAngle: number; // derajat di bawah ufuk saat masuk Isya
  asrShadowFactor: number; // 1 = madzhab Syafi'i/Maliki/Hambali, 2 = Hanafi
};

// Mendekati parameter Kemenag RI / metode umum yang dipakai di Indonesia.
export const DEFAULT_METHOD: HisabMethod = {
  fajrAngle: 20,
  ishaAngle: 18,
  asrShadowFactor: 1,
};

export type PrayerSchedule = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

function dayOfYearUTC(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / 86400000) + 1;
}

/** Deklinasi matahari (derajat) & equation of time (menit) — rumus Cooper/NOAA. */
function solarPosition(date: Date) {
  const n = dayOfYearUTC(date);
  const gamma = ((2 * Math.PI) / 365) * (n - 1 + (12 - 12) / 24);

  const declRad =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const eqTimeMinutes =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  return { declination: toDeg(declRad), eqTimeMinutes };
}

/** Sudut jam (derajat) matahari mencapai `zenith` derajat dari titik puncak. */
function hourAngle(lat: number, decl: number, zenith: number): number | null {
  const num = Math.cos(toRad(zenith)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl));
  const den = Math.cos(toRad(lat)) * Math.cos(toRad(decl));
  const cosHa = num / den;
  if (cosHa > 1 || cosHa < -1) return null; // matahari tidak mencapai sudut ini (lintang ekstrem)
  return toDeg(Math.acos(cosHa));
}

function hoursToLabel(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  const carry = m === 60;
  const hh = carry ? (h + 1) % 24 : h;
  const mm = carry ? 0 : m;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function calculateHisab(
  date: Date,
  latitude: number,
  longitude: number,
  timezoneOffsetHours: number,
  method: HisabMethod = DEFAULT_METHOD
): PrayerSchedule {
  const { declination, eqTimeMinutes } = solarPosition(date);

  const solarNoonHours = (720 - eqTimeMinutes - 4 * longitude + 60 * timezoneOffsetHours) / 60;

  const haFor = (zenith: number) => hourAngle(latitude, declination, zenith);

  const sunriseHa = haFor(90.833);
  const fajrHa = haFor(90 + method.fajrAngle);
  const ishaHa = haFor(90 + method.ishaAngle);

  // Sudut ketinggian Ashar: cot(altitude) = factor + tan(|lat - decl|)
  const asrAltitudeRad = Math.atan(
    1 / (method.asrShadowFactor + Math.tan(toRad(Math.abs(latitude - declination))))
  );
  const asrZenith = 90 - toDeg(asrAltitudeRad);
  const asrHa = haFor(asrZenith);

  const offsetHours = (ha: number | null) => (ha === null ? 0 : (ha * 4) / 60);

  return {
    fajr: hoursToLabel(solarNoonHours - offsetHours(fajrHa)),
    sunrise: hoursToLabel(solarNoonHours - offsetHours(sunriseHa)),
    dhuhr: hoursToLabel(solarNoonHours + 2 / 60), // +2 menit ikhtiyati standar
    asr: hoursToLabel(solarNoonHours + offsetHours(asrHa)),
    maghrib: hoursToLabel(solarNoonHours + offsetHours(sunriseHa) + 2 / 60),
    isha: hoursToLabel(solarNoonHours + offsetHours(ishaHa)),
  };
}
