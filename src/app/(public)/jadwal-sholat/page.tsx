import type { Metadata } from "next";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BismillahCalligraphy } from "@/components/brand/BismillahCalligraphy";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { getFoundationProfile } from "@/server/foundation/service";
import { getTodayPrayerSchedule } from "@/server/prayer-times/service";
import { listUpcomingEvents } from "@/server/events/service";
import { formatDate, formatDateTime } from "@/lib/format";
import { Clock, MapPin, Compass, UserCheck } from "lucide-react";

export const metadata: Metadata = { title: "Jadwal Sholat" };
export const revalidate = 3600;

const ORDER: { key: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"; label: string; icon: string }[] = [
  { key: "fajr", label: "Subuh", icon: "🌅" },
  { key: "sunrise", label: "Terbit", icon: "☀️" },
  { key: "dhuhr", label: "Dzuhur", icon: "🌤️" },
  { key: "asr", label: "Ashar", icon: "🌤️" },
  { key: "maghrib", label: "Maghrib", icon: "🌇" },
  { key: "isha", label: "Isya", icon: "🌙" },
];

export default async function JadwalSholatPage() {
  const profile = await getFoundationProfile();
  const { schedule, source } = await getTodayPrayerSchedule(profile.latitude, profile.longitude);
  const fridayEvents = (await listUpcomingEvents(50)).filter((e) => e.category === "KAJIAN" || e.speaker);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green-950 via-brand-green-900 to-brand-green-800 p-8 text-white shadow-lg border border-brand-gold-500/30">
        <IslamicPattern className="opacity-10 text-brand-gold-300" />
        <div className="relative space-y-3 text-center sm:text-left">
          <BismillahCalligraphy className="mb-2 max-w-xs mx-auto sm:mx-0" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Jadwal Sholat</h1>
          <p className="text-sm text-brand-cream-50/90 flex items-center justify-center sm:justify-start gap-2">
            <MapPin className="h-4 w-4 text-brand-gold-400" />
            <span>{formatDate(new Date())}</span> · <span>{profile.city}</span>
          </p>
          <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Badge tone={source === "aladhan" ? "gold" : "terracotta"} className="px-3 py-1 text-xs font-semibold shadow-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {source === "aladhan" ? "Sumber: Aladhan API (Live Kemenag RI)" : "Mode Luring — Dihitung dari Hisab Lokal"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Grid 6 Waktu Sholat */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {ORDER.map(({ key, label, icon }) => (
          <Card key={key} className="text-center hover:border-brand-gold-500 transition-all duration-200">
            <CardBody className="p-4 flex flex-col items-center">
              <span className="text-xl mb-1">{icon}</span>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">{label}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-brand-green-900">
                {schedule[key]}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Info Koordinat & Arah Qibla */}
      <Card className="bg-gradient-to-r from-brand-gold-50/60 via-white to-brand-gold-50/40 border border-brand-gold-500/30">
        <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-green-900 text-brand-gold-400 shadow-sm">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-brand-green-900">Koordinat Masjid ASABRI</p>
              <p className="text-xs text-foreground/70">
                Lat: {profile.latitude} · Long: {profile.longitude} (Zona Waktu: WIB UTC+7)
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-brand-green-800 bg-brand-green-100 px-3 py-1.5 rounded-full border border-brand-green-700/20">
            Arah Kiblat: ~295.2° NW (Makkah)
          </span>
        </CardBody>
      </Card>

      {/* Khatib / Imam & Kajian */}
      {fridayEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-brand-green-700" />
              Jadwal Khatib / Imam & Kajian
            </CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-border-subtle/80">
            {fridayEvents.map((e) => (
              <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 text-sm hover:bg-brand-green-50/40 rounded-xl px-2 transition-colors">
                <div>
                  <p className="font-bold text-brand-green-900">{e.title}</p>
                  <p className="text-xs text-foreground/70">{formatDateTime(e.startAt)}</p>
                </div>
                {e.speaker && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-xs text-brand-green-800 bg-brand-green-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                    Penceramah: {e.speaker}
                  </span>
                )}
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
