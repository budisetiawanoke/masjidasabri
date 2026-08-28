import { describe, expect, it } from "vitest";
import { calculateHisab, DEFAULT_METHOD } from "@/server/prayer-times/hisab";

function toMinutes(label: string): number {
  const [h, m] = label.split(":").map(Number);
  return h * 60 + m;
}

describe("calculateHisab", () => {
  const jakarta = { lat: -6.2734, lng: 106.9925, tz: 7 };

  it("orders the five daily prayer times correctly for Jakarta", () => {
    const schedule = calculateHisab(new Date(Date.UTC(2026, 2, 21)), jakarta.lat, jakarta.lng, jakarta.tz);

    expect(toMinutes(schedule.fajr)).toBeLessThan(toMinutes(schedule.sunrise));
    expect(toMinutes(schedule.sunrise)).toBeLessThan(toMinutes(schedule.dhuhr));
    expect(toMinutes(schedule.dhuhr)).toBeLessThan(toMinutes(schedule.asr));
    expect(toMinutes(schedule.asr)).toBeLessThan(toMinutes(schedule.maghrib));
    expect(toMinutes(schedule.maghrib)).toBeLessThan(toMinutes(schedule.isha));
  });

  it("keeps every prayer time within plausible clock bounds for near-equatorial Jakarta", () => {
    const schedule = calculateHisab(new Date(Date.UTC(2026, 5, 21)), jakarta.lat, jakarta.lng, jakarta.tz);

    // Jakarta is near the equator, so day length barely varies year-round —
    // Subuh should land in the early-morning hours and Isya in the evening,
    // never drifting into implausible values (a bug in the hour-angle math
    // would push these outside a normal 24h day or invert AM/PM).
    expect(toMinutes(schedule.fajr)).toBeGreaterThan(toMinutes("03:30"));
    expect(toMinutes(schedule.fajr)).toBeLessThan(toMinutes("05:30"));
    expect(toMinutes(schedule.dhuhr)).toBeGreaterThan(toMinutes("11:00"));
    expect(toMinutes(schedule.dhuhr)).toBeLessThan(toMinutes("13:00"));
    expect(toMinutes(schedule.isha)).toBeGreaterThan(toMinutes("18:00"));
    expect(toMinutes(schedule.isha)).toBeLessThan(toMinutes("20:30"));
  });

  it("produces stable output for the same input (deterministic, no reliance on wall-clock time)", () => {
    const date = new Date(Date.UTC(2026, 0, 15));
    const a = calculateHisab(date, jakarta.lat, jakarta.lng, jakarta.tz, DEFAULT_METHOD);
    const b = calculateHisab(date, jakarta.lat, jakarta.lng, jakarta.tz, DEFAULT_METHOD);
    expect(a).toEqual(b);
  });

  it("uses a larger shadow factor (Hanafi) to push Ashar later than the default Syafi'i factor", () => {
    const date = new Date(Date.UTC(2026, 2, 21));
    const syafii = calculateHisab(date, jakarta.lat, jakarta.lng, jakarta.tz, DEFAULT_METHOD);
    const hanafi = calculateHisab(date, jakarta.lat, jakarta.lng, jakarta.tz, {
      ...DEFAULT_METHOD,
      asrShadowFactor: 2,
    });
    expect(toMinutes(hanafi.asr)).toBeGreaterThanOrEqual(toMinutes(syafii.asr));
  });
});
