import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFoundationProfile } from "@/server/foundation/service";
import { getTodayPrayerSchedule } from "@/server/prayer-times/service";
import { listUpcomingEvents } from "@/server/events/service";
import { formatDate, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Jadwal Sholat" };
export const revalidate = 3600;

const ORDER: { key: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"; label: string }[] = [
  { key: "fajr", label: "Subuh" },
  { key: "sunrise", label: "Terbit" },
  { key: "dhuhr", label: "Dzuhur" },
  { key: "asr", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isya" },
];

export default async function JadwalSholatPage() {
  const profile = await getFoundationProfile();
  const { schedule, source } = await getTodayPrayerSchedule(profile.latitude, profile.longitude);
  const fridayEvents = (await listUpcomingEvents(50)).filter((e) => e.category === "KAJIAN" || e.speaker);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-green-900">Jadwal Sholat</h1>
      <p className="mt-2 text-foreground/70">
        {formatDate(new Date())} · {profile.city}
      </p>
      <Badge tone={source === "aladhan" ? "green" : "terracotta"} className="mt-3">
        {source === "aladhan" ? "Sumber: Aladhan API (live)" : "Mode luring — dihitung dari hisab lokal"}
      </Badge>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {ORDER.map(({ key, label }) => (
          <Card key={key} className="text-center">
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/70">{label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-brand-green-900">
                {schedule[key]}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {fridayEvents.length > 0 && (
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Jadwal Khatib / Imam & Kajian</CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-border-subtle">
            {fridayEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-brand-green-900">{e.title}</p>
                  <p className="text-foreground/70">{formatDateTime(e.startAt)}</p>
                </div>
                {e.speaker && <span className="text-foreground/70">{e.speaker}</span>}
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
