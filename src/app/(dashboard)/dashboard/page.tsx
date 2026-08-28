import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDashboardSummary } from "@/server/dashboard/summary";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { can } from "@/lib/rbac";
import { listOwnSuggestions } from "@/server/suggestions/service";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function DashboardHomePage() {
  const session = await auth();
  const role = session!.user.role;
  const summary = await getDashboardSummary();
  const ownSuggestions = role === "JAMAAH" ? await listOwnSuggestions({ id: session!.user.id, role }) : [];

  const stats = [
    { label: "Saldo Kas", value: formatRupiah(summary.balance.saldo), tone: "gold" as const },
    { label: "Jamaah Terdaftar", value: summary.memberCount.toString(), tone: "green" as const },
    { label: "Kegiatan Mendatang", value: summary.upcomingEventCount.toString(), tone: "green" as const },
    { label: "Aset Inventaris", value: summary.inventoryCount.toString(), tone: "neutral" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-green-900">Ringkasan Dashboard</h1>
        <p className="mt-1 text-sm text-foreground/70">Kondisi terkini pengelolaan Masjid ASABRI.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/70">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-brand-green-900">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {can(role, "APPROVE_TRANSACTION") && (
          <Card>
            <CardHeader>
              <CardTitle>Perlu Perhatian</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Transaksi menunggu pengesahan</span>
                <Badge tone={summary.pendingTransactionCount > 0 ? "terracotta" : "green"}>
                  {summary.pendingTransactionCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Saran/pengaduan belum ditindaklanjuti</span>
                <Badge tone={summary.openSuggestionCount > 0 ? "terracotta" : "green"}>
                  {summary.openSuggestionCount}
                </Badge>
              </div>
              {summary.pendingTransactionCount > 0 && (
                <Link href="/dashboard/keuangan" className="inline-block text-brand-green-700 underline underline-offset-2">
                  Tinjau transaksi →
                </Link>
              )}
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Rincian Saldo per Kategori</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2 text-sm">
              {summary.balance.rows
                .filter((r) => r.total !== 0)
                .map((r) => (
                  <li key={r.category.id} className="flex items-center justify-between">
                    <span>{r.category.name}</span>
                    <span className={r.category.kind === "MASUK" ? "font-medium text-brand-green-700" : "font-medium text-brand-terracotta-700"}>
                      {formatRupiah(r.total)}
                    </span>
                  </li>
                ))}
              {summary.balance.rows.every((r) => r.total === 0) && (
                <p className="text-foreground/70">Belum ada transaksi disahkan.</p>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>

      {role === "JAMAAH" && (
        <Card>
          <CardHeader>
            <CardTitle>Saran/Pengaduan Saya</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-foreground/70">
              Isolasi data: hanya Anda yang dapat melihat riwayat saran/pengaduan yang Anda kirim
              dengan identitas Anda. <Link href="/kotak-saran" className="text-brand-green-700 underline underline-offset-2">Kirim saran baru →</Link>
            </p>
            {ownSuggestions.length === 0 && <p className="text-sm text-foreground/70">Belum ada riwayat.</p>}
            {ownSuggestions.map((t) => (
              <div key={t.id} className="rounded-lg border border-border-subtle p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-brand-green-900">{t.subject}</p>
                  <Badge tone={t.status === "SELESAI" ? "green" : "gold"}>{t.status}</Badge>
                </div>
                <p className="mt-1 text-foreground/70">{t.message}</p>
                <p className="mt-1 text-xs text-foreground/70">{formatDateTime(t.createdAt)}</p>
                {t.response && <p className="mt-2 rounded bg-brand-green-100 p-2 text-xs text-brand-green-900">{t.response}</p>}
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
