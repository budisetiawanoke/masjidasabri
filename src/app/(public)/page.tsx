import Link from "next/link";
import Image from "next/image";
import { Card, CardBody } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getFoundationProfile } from "@/server/foundation/service";
import { getTodayPrayerSchedule } from "@/server/prayer-times/service";
import { listAnnouncements, listUpcomingEvents } from "@/server/events/service";
import { getBalanceSummary } from "@/server/finance/service";
import { formatRupiah, formatDateTime } from "@/lib/format";
import {
  Pin,
  TrendingUp,
  Coins,
  HeartHandshake,
  HandCoins,
  HandHeart,
  Calendar,
  MessageSquareWarning,
} from "lucide-react";

export const revalidate = 300;

export default async function HomePage() {
  const profile = await getFoundationProfile();
  const [{ schedule }, announcements, events, balance] = await Promise.all([
    getTodayPrayerSchedule(profile.latitude, profile.longitude),
    listAnnouncements(3),
    listUpcomingEvents(3),
    getBalanceSummary(),
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Section with Real Mosque Photo Background */}
      <section className="relative overflow-hidden bg-[#122019] text-white shadow-md">
        <div className="relative h-48 sm:h-64 w-full">
          <Image
            src="/assets/masjid-foto-hero.png"
            alt="Masjid ASABRI"
            fill
            unoptimized
            priority
            className="object-cover object-center filter sepia-[0.08] saturate-[0.95] contrast-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#122019]/30 via-[#122019]/70 to-[#122019]" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 space-y-1">
            <p className="font-serif text-base sm:text-lg text-brand-gold-300 tracking-wider">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white">
              Masjid ASABRI
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 pt-2 space-y-4">
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
            Mengelola dana jamaah secara transparan, amanah, dan dapat diaudit terbuka.
          </p>
        </div>
      </section>

      {/* 2. Compact Today Prayer Times Card */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="border border-border-subtle shadow-sm">
          <CardBody className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-brand-green-900 border-b border-border-subtle pb-2">
              <span className="uppercase tracking-wider">Jadwal Sholat Hari Ini</span>
              <Link href="/jadwal-sholat" className="text-brand-green-700 hover:underline">
                Bulanan →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-xl bg-brand-cream-50 border border-border-subtle/60">
                <p className="text-xs uppercase font-bold text-foreground/60">Subuh</p>
                <p className="font-display font-semibold text-lg text-brand-green-900 mt-0.5">
                  {schedule.fajr}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-brand-cream-50 border border-border-subtle/60">
                <p className="text-xs uppercase font-bold text-foreground/60">Dzuhur</p>
                <p className="font-display font-semibold text-lg text-brand-green-900 mt-0.5">
                  {schedule.dhuhr}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-brand-cream-50 border border-border-subtle/60">
                <p className="text-xs uppercase font-bold text-foreground/60">Maghrib</p>
                <p className="font-display font-semibold text-lg text-brand-green-900 mt-0.5">
                  {schedule.maghrib}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-brand-cream-50 border border-border-subtle/60">
                <p className="text-xs uppercase font-bold text-foreground/60">Terbit</p>
                <p className="font-display font-semibold text-lg text-brand-green-900 mt-0.5">
                  {schedule.sunrise}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-brand-cream-50 border border-border-subtle/60">
                <p className="text-xs uppercase font-bold text-foreground/60">Ashar</p>
                <p className="font-display font-semibold text-lg text-brand-green-900 mt-0.5">
                  {schedule.asr}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-brand-cream-50 border border-border-subtle/60">
                <p className="text-xs uppercase font-bold text-foreground/60">Isya</p>
                <p className="font-display font-semibold text-lg text-brand-green-900 mt-0.5">
                  {schedule.isha}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 3. Feature Shortcuts Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/pengumuman"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <Pin className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Pengumuman
            </span>
          </Link>

          <Link
            href="/laporan-keuangan"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Laporan Keuangan
            </span>
          </Link>

          <Link
            href="/zakat"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <Coins className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Zakat
            </span>
          </Link>

          <Link
            href="/kurban"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Kurban
            </span>
          </Link>

          <Link
            href="/infaq-sadaqah"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <HandCoins className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Infaq &amp; Sadaqah
            </span>
          </Link>

          <Link
            href="/donasi"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <HandHeart className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Donasi
            </span>
          </Link>

          <Link
            href="/kegiatan"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Kegiatan Masjid
            </span>
          </Link>

          <Link
            href="/kotak-saran"
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-brand-gold-500 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-cream-50 text-brand-green-700">
              <MessageSquareWarning className="h-6 w-6" />
            </div>
            <span className="font-display text-sm font-bold text-brand-green-900">
              Kotak Saran
            </span>
          </Link>
        </div>
      </section>

      {/* 4. Pengumuman & Kegiatan Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        {announcements.length > 0 && (
          <Card>
            <CardBody className="p-4 space-y-2">
              <span className="text-sm font-bold uppercase tracking-wider text-brand-green-900 block border-b border-border-subtle pb-2">
                Pengumuman Terbaru
              </span>
              {announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="pt-1">
                  <p className="text-sm font-bold text-brand-green-900">{a.title}</p>
                  <p className="text-xs text-foreground/70 line-clamp-2 mt-0.5">{a.body}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {events.length > 0 && (
          <Card>
            <CardBody className="p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-sm font-bold uppercase tracking-wider text-brand-green-900">
                  Kegiatan Mendatang
                </span>
                <Link href="/kegiatan" className="text-sm font-medium text-brand-green-700 hover:underline">
                  Semua →
                </Link>
              </div>
              {events.map((e) => (
                <div key={e.id} className="flex items-center gap-3 pt-1">
                  <div className="rounded-lg bg-brand-cream-50 p-2 text-brand-green-700 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-green-900">{e.title}</p>
                    <p className="text-xs text-foreground/70 mt-0.5">{formatDateTime(e.startAt)}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </section>

      {/* 5. Transparansi Kas Card */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="border border-border-subtle border-t-2 border-t-brand-green-700 shadow-sm">
          <CardBody className="p-4 space-y-3">
            <span className="text-sm font-bold uppercase tracking-wider text-brand-green-900 block border-b border-border-subtle pb-2">
              Transparansi Kas
            </span>
            <div className="flex justify-between items-center text-sm py-1 border-b border-border-subtle/60">
              <span className="text-foreground/70">Pemasukan</span>
              <span className="font-bold text-brand-green-900">{formatRupiah(balance.totalMasuk)}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1 border-b border-border-subtle/60">
              <span className="text-foreground/70">Pengeluaran</span>
              <span className="font-bold text-brand-terracotta-700">{formatRupiah(balance.totalKeluar)}</span>
            </div>
            <div className="flex justify-between items-center text-base pt-1">
              <span className="font-bold text-foreground">Saldo Kas</span>
              <span className="font-display text-lg font-extrabold text-brand-green-900">
                {formatRupiah(balance.saldo)}
              </span>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 6. Infaq & Donasi Dark Card */}
      {profile.bankAccountNo && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <Card className="bg-[#122019] text-white border-0 shadow-lg">
            <CardBody className="p-5 space-y-3">
              <Badge tone="gold" className="text-xs font-bold uppercase px-2.5 py-0.5">
                Infaq &amp; Donasi
              </Badge>
              <p className="text-sm text-white/80 leading-relaxed">
                Transfer ke rekening resmi yayasan lalu konfirmasi ke bendahara.
              </p>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/20 bg-white/5">
                {profile.qrisImageUrl && (
                  <Image
                    src={profile.qrisImageUrl}
                    alt="QRIS Masjid ASABRI"
                    width={72}
                    height={72}
                    unoptimized
                    className="h-18 w-18 shrink-0 rounded-lg border border-white/20 bg-white object-contain p-1"
                  />
                )}
                <div className="space-y-1">
                  <p className="text-xs uppercase text-white/60 font-medium">
                    {profile.bankName} · a.n. {profile.bankAccountName}
                  </p>
                  <p className="font-display text-lg font-bold text-brand-gold-300 tracking-wider">
                    {profile.bankAccountNo}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <LinkButton
                  href="/infaq-sadaqah"
                  variant="gold"
                  className="flex-1 text-sm py-2.5"
                >
                  Infaq &amp; Sadaqah
                </LinkButton>
                <LinkButton
                  href="/donasi"
                  variant="outline"
                  className="flex-1 text-sm py-2.5 border-brand-gold-300 text-brand-gold-300 hover:bg-white/10"
                >
                  Donasi
                </LinkButton>
              </div>
            </CardBody>
          </Card>
        </section>
      )}
    </div>
  );
}
