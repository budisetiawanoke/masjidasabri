import "server-only";
import { calculateHisab, type PrayerSchedule } from "@/server/prayer-times/hisab";

type AladhanResponse = {
  data: {
    timings: Record<string, string>;
  };
};

/**
 * Jadwal sholat hari ini untuk koordinat masjid. Mencoba API publik Aladhan
 * dulu (lebih presisi, dipakai jutaan masjid), lalu jatuh ke perhitungan
 * hisab lokal bila API tidak terjangkau — fitur tetap berfungsi tanpa
 * ketergantungan penuh pada layanan eksternal.
 */
export async function getTodayPrayerSchedule(
  latitude: number,
  longitude: number
): Promise<{ schedule: PrayerSchedule; source: "aladhan" | "hisab-lokal" }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const url = new URL("https://api.aladhan.com/v1/timings");
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("method", "11"); // Kemenag-like (Egyptian General Authority mendekati; disesuaikan Indonesia)
    url.searchParams.set("school", "0"); // Syafi'i untuk Ashar

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Aladhan API status ${res.status}`);
    const json = (await res.json()) as AladhanResponse;
    const t = json.data.timings;

    return {
      schedule: {
        fajr: t.Fajr,
        sunrise: t.Sunrise,
        dhuhr: t.Dhuhr,
        asr: t.Asr,
        maghrib: t.Maghrib,
        isha: t.Isha,
      },
      source: "aladhan",
    };
  } catch {
    const timezoneOffsetHours = 7; // WIB
    const schedule = calculateHisab(new Date(), latitude, longitude, timezoneOffsetHours);
    return { schedule, source: "hisab-lokal" };
  }
}
