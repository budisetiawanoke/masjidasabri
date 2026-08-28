import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getFoundationProfile } from "@/server/foundation/service";
import { getTodayPrayerSchedule } from "@/server/prayer-times/service";
import { listAnnouncements } from "@/server/events/service";
import { listUpcomingEvents } from "@/server/events/service";
import { getBalanceSummary } from "@/server/finance/service";
import { formatRupiah, formatDateTime } from "@/lib/format";

export const revalidate = 300;

const PRAYER_LABEL: Record<string, string> = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export default async function HomePage() {
  const profile = await getFoundationProfile();
  const [{ schedule, source }, announcements, events, balance] = await Promise.all([
    getTodayPrayerSchedule(profile.latitude, profile.longitude),
    listAnnouncements(3),
    listUpcomingEvents(3),
    getBalanceSummary(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-green-900 text-brand-cream-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <Badge tone="gold" className="mb-4">
              Pengurus Periode {profile.periodLabel}
            </Badge>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-lg text-brand-cream-50/80">
              Melayani ibadah, dakwah, pendidikan, dan kemakmuran umat di Jatiasih dengan
              pengelolaan dana yang transparan dan dapat diaudit oleh jamaah.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/laporan-keuangan" variant="gold">
                Lihat Laporan Keuangan
              </LinkButton>
              <LinkButton href="/kegiatan" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Jadwal Kegiatan
              </LinkButton>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Emblem className="h-48 w-48 drop-shadow-xl sm:h-64 sm:w-64" />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <Card className="bg-brand-gold-100/60">
          <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-green-900">Jadwal Sholat Hari Ini</p>
              <p className="text-xs text-foreground/70">
                {profile.city} · sumber: {source === "aladhan" ? "Aladhan API" : "hisab lokal (mode luring)"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {Object.entries(PRAYER_LABEL).map(([key, label]) => (
                <div key={key} className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-foreground/70">
                    {label}
                  </p>
                  <p className="font-display text-base font-semibold text-brand-green-900">
                    {schedule[key as keyof typeof schedule]}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Transparansi Kas</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Total Pemasukan</span>
              <span className="font-semibold text-brand-green-900">{formatRupiah(balance.totalMasuk)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Total Pengeluaran</span>
              <span className="font-semibold text-brand-terracotta-700">{formatRupiah(balance.totalKeluar)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border-subtle pt-2 text-sm">
              <span className="font-semibold text-foreground">Saldo Kas</span>
              <span className="font-display text-lg font-semibold text-brand-green-900">
                {formatRupiah(balance.saldo)}
              </span>
            </div>
            <Link href="/laporan-keuangan" className="mt-2 inline-block text-sm font-medium text-brand-green-700 underline underline-offset-2">
              Lihat rincian per kategori →
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengumuman Terbaru</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {announcements.length === 0 && <p className="text-sm text-foreground/70">Belum ada pengumuman.</p>}
            {announcements.map((a) => (
              <div key={a.id}>
                <p className="text-sm font-semibold text-brand-green-900">{a.title}</p>
                <p className="line-clamp-2 text-xs text-foreground/70">{a.body}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kegiatan Mendatang</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {events.length === 0 && <p className="text-sm text-foreground/70">Belum ada kegiatan terjadwal.</p>}
            {events.map((e) => (
              <div key={e.id}>
                <p className="text-sm font-semibold text-brand-green-900">{e.title}</p>
                <p className="text-xs text-foreground/70">{formatDateTime(e.startAt)}</p>
              </div>
            ))}
            <Link href="/kegiatan" className="inline-block text-sm font-medium text-brand-green-700 underline underline-offset-2">
              Lihat semua kegiatan →
            </Link>
          </CardBody>
        </Card>
      </section>

      {profile.bankAccountNo && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Card>
            <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-brand-green-900">Salurkan Infaq & Donasi</p>
                <p className="mt-1 text-sm text-foreground/70">
                  Transfer ke rekening resmi yayasan, lalu konfirmasikan ke bendahara agar tercatat
                  dalam laporan keuangan.
                </p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold text-brand-green-900">{profile.bankName}</span>{" "}
                  — {profile.bankAccountNo} a.n. {profile.bankAccountName}
                </p>
              </div>
              <LinkButton href="/kotak-saran" variant="outline">
                Butuh bantuan konfirmasi?
              </LinkButton>
            </CardBody>
          </Card>
        </section>
      )}
    </div>
  );
}
