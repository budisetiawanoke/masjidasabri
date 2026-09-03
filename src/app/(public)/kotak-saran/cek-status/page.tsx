import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getSuggestionByTrackingCode } from "@/server/suggestions/service";
import { formatDateTime } from "@/lib/format";
import { BismillahCalligraphy } from "@/components/brand/BismillahCalligraphy";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { KeyRound, ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Cek Status Saran/Pengaduan" };

const STATUS_TONE: Record<string, "gold" | "green" | "terracotta"> = {
  BARU: "terracotta",
  DITINDAKLANJUTI: "gold",
  SELESAI: "green",
};

const STATUS_LABEL: Record<string, string> = {
  BARU: "Baru diterima, menunggu ditinjau",
  DITINDAKLANJUTI: "Sedang ditindaklanjuti",
  SELESAI: "Selesai ditanggapi",
};

const CATEGORY_LABEL: Record<string, string> = {
  SARAN: "Saran",
  PENGADUAN: "Pengaduan",
};

export default async function CekStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  const { kode } = await searchParams;
  const ticket = kode ? await getSuggestionByTrackingCode(kode) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-800 p-8 text-white shadow-lg border border-brand-gold-500/30">
        <IslamicPattern className="opacity-10 text-brand-gold-300" />
        <div className="relative space-y-3">
          <BismillahCalligraphy className="mb-2 max-w-xs" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-brand-gold-400" />
            Cek Status
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-brand-cream-50/90">
            Masukkan kode pelacakan yang Anda terima saat mengirim saran/pengaduan — tidak perlu akun
            atau login.
          </p>
        </div>
      </div>

      <Card>
        <CardBody className="p-6">
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="kode"
              defaultValue={kode ?? ""}
              placeholder="Contoh: AB3D-9F2K"
              required
              autoCapitalize="characters"
              className="flex-1 rounded-xl border border-border-subtle px-4 py-2.5 text-center font-display text-lg font-bold tracking-widest uppercase text-brand-green-900 focus:outline-none focus:ring-2 focus:ring-brand-gold-500"
            />
            <Button type="submit" className="sm:w-auto">
              Cek Status
            </Button>
          </form>
        </CardBody>
      </Card>

      {kode && !ticket && (
        <div className="flex items-center gap-3 rounded-xl bg-brand-terracotta-100 p-4 text-sm font-semibold text-brand-terracotta-700 border border-brand-terracotta-500/30">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>Kode pelacakan tidak ditemukan. Periksa kembali kode yang Anda masukkan.</span>
        </div>
      )}

      {ticket && (
        <Card className="border-t-4 border-t-brand-green-700 shadow-md">
          <CardBody className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={ticket.category === "PENGADUAN" ? "terracotta" : "green"}>
                {CATEGORY_LABEL[ticket.category] ?? ticket.category}
              </Badge>
              <Badge tone={STATUS_TONE[ticket.status] ?? "gold"}>{STATUS_LABEL[ticket.status] ?? ticket.status}</Badge>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-brand-green-900">{ticket.subject}</p>
              <p className="mt-1 text-sm text-foreground/80 whitespace-pre-line">{ticket.message}</p>
              <p className="mt-2 text-xs text-foreground/60">Dikirim {formatDateTime(ticket.createdAt)}</p>
            </div>
            {ticket.response && (
              <div className="rounded-xl bg-brand-green-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-green-700">
                  Tanggapan Pengurus
                </p>
                <p className="mt-1 text-sm text-brand-green-900 whitespace-pre-line">{ticket.response}</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <p className="text-center text-sm text-foreground/70">
        <Link href="/kotak-saran" className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-brand-green-900">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Kotak Saran
        </Link>
      </p>
    </div>
  );
}
