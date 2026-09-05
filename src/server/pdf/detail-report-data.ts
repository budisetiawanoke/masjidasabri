import "server-only";
import {
  getDonationCampaignDetail,
  getInfaqCategoryDetail,
} from "@/server/donations/service";
import { getZakatTypeDetail, getQurbanTypeDetail } from "@/server/zakat/service";
import { formatRupiah, formatDateTime, monthLabel } from "@/lib/format";
import type { DetailReportColumn } from "@/server/pdf/DetailReportDocument";

export type LoadedDetailReport = {
  title: string;
  periodLabel: string;
  summary: { label: string; value: string }[];
  columns: DetailReportColumn[];
  rows: Record<string, string>[];
  emptyMessage: string;
  disclaimer: string;
  /**
   * Nama berkas unduhan LENGKAP tanpa ekstensi (sudah termasuk periode —
   * beda-beda per jenis: donasi/infaq/zakat pakai tahun-bulan, kurban cuma
   * tahun) — route CSV/PDF tinggal menambah ".csv"/".pdf".
   */
  filenameSlug: string;
};

const STATUS_LABEL: Record<string, string> = {
  DITERIMA: "Menunggu Konfirmasi",
  DIKONFIRMASI: "Dikonfirmasi",
  DISALURKAN: "Sudah Disalurkan",
  TERDAFTAR: "Terdaftar",
  LUNAS: "Lunas",
  DISEMBELIH: "Disembelih",
  DIDISTRIBUSI: "Didistribusikan",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

/**
 * Memuat & memformat data laporan detail (per kampanye/peruntukan/jenis)
 * jadi bentuk siap-tampil generik — dipakai bersama oleh route CSV
 * (src/app/api/laporan-detail/[kind]/[id]/csv) dan PDF (.../pdf), dan oleh
 * keempat halaman detailnya sendiri (mis. src/app/(public)/donasi/laporan/[campaignId]/page.tsx),
 * supaya tabel yang tampil di layar SAMA PERSIS dengan isi berkas unduhan
 * (satu sumber kebenaran, bukan tiga implementasi terpisah yang bisa
 * berbeda-beda kalau salah satu diubah tanpa mengubah yang lain).
 */
export async function loadDetailReport(
  kind: string,
  id: string,
  year: number,
  month: number
): Promise<LoadedDetailReport | null> {
  switch (kind) {
    case "donasi": {
      const detail = await getDonationCampaignDetail(id, year, month);
      if (!detail) return null;
      const rekening =
        detail.campaign.bankName || detail.campaign.bankAccountNo
          ? `${detail.campaign.bankName ?? "-"} ${detail.campaign.bankAccountNo ?? "-"} a.n. ${detail.campaign.bankAccountName ?? "-"}`
          : "rekening yayasan umum";
      return {
        title: `Laporan Donasi — ${detail.campaign.title}`,
        periodLabel: monthLabel(year, month),
        summary: [
          { label: "Status Kampanye", value: detail.campaign.isActive ? "Aktif" : "Berakhir" },
          { label: "Total Donasi", value: formatRupiah(detail.total) },
          { label: "Jumlah Donatur", value: String(detail.count) },
        ],
        columns: [
          { key: "donorName", header: "Nama Donatur", flex: 3 },
          { key: "contactInfo", header: "Kontak", flex: 2 },
          { key: "amount", header: "Nominal", flex: 2, align: "right" },
          { key: "status", header: "Status", flex: 2 },
          { key: "recordedAt", header: "Tanggal", flex: 2 },
        ],
        rows: detail.records.map((r) => ({
          donorName: r.donorName,
          contactInfo: r.contactInfo ?? "-",
          amount: r.amount ? formatRupiah(r.amount) : "Tidak dicantumkan",
          status: STATUS_LABEL[r.status] ?? r.status,
          recordedAt: formatDateTime(r.recordedAt),
        })),
        emptyMessage: `Belum ada donasi untuk kampanye ini pada periode ${monthLabel(year, month)}.`,
        disclaimer: [
          `Laporan ini mencakup seluruh donasi yang tercatat untuk kampanye ini pada periode tersebut, termasuk yang masih menunggu konfirmasi pengurus. Nominal diisi sendiri oleh donatur saat mendaftar, belum tentu sama dengan Laporan Keuangan resmi yang hanya menghitung transaksi kas yang sudah disahkan. Rekening tujuan: ${rekening}.`,
          !detail.campaign.isActive && detail.campaign.closingNote
            ? `Keterangan penutupan kampanye dari pengurus: ${detail.campaign.closingNote}`
            : null,
        ]
          .filter(Boolean)
          .join(" "),
        filenameSlug: `donasi-${slugify(detail.campaign.title)}-${year}-${String(month).padStart(2, "0")}`,
      };
    }
    case "infaq": {
      const detail = await getInfaqCategoryDetail(id, year, month);
      if (!detail) return null;
      return {
        title: `Laporan Infaq & Sadaqah — ${detail.label}`,
        periodLabel: monthLabel(year, month),
        summary: [
          { label: "Total Infaq/Sadaqah", value: formatRupiah(detail.total) },
          { label: "Jumlah Penginfak", value: String(detail.count) },
        ],
        columns: [
          { key: "donorName", header: "Nama Penginfak", flex: 3 },
          { key: "contactInfo", header: "Kontak", flex: 2 },
          { key: "amount", header: "Nominal", flex: 2, align: "right" },
          { key: "status", header: "Status", flex: 2 },
          { key: "recordedAt", header: "Tanggal", flex: 2 },
        ],
        rows: detail.records.map((r) => ({
          donorName: r.donorName,
          contactInfo: r.contactInfo ?? "-",
          amount: r.amount ? formatRupiah(r.amount) : "Tidak dicantumkan",
          status: STATUS_LABEL[r.status] ?? r.status,
          recordedAt: formatDateTime(r.recordedAt),
        })),
        emptyMessage: `Belum ada infaq/sadaqah untuk peruntukan ini pada periode ${monthLabel(year, month)}.`,
        disclaimer:
          "Laporan ini mencakup seluruh infaq/sadaqah yang tercatat untuk peruntukan ini pada periode tersebut, termasuk yang masih menunggu konfirmasi pengurus. Peruntukan Operasional Masjid otomatis tercatat sebagai pemasukan kas — lihat Laporan Keuangan untuk status pengesahannya.",
        filenameSlug: `infaq-${slugify(detail.label)}-${year}-${String(month).padStart(2, "0")}`,
      };
    }
    case "zakat": {
      const detail = await getZakatTypeDetail(id, year, month);
      if (!detail) return null;
      return {
        title: `Laporan Zakat — ${detail.label}`,
        periodLabel: monthLabel(year, month),
        summary: [
          { label: "Total Uang", value: formatRupiah(detail.totalMoney) },
          { label: "Total Beras", value: `${detail.totalRice} kg` },
          { label: "Jumlah Muzakki", value: String(detail.count) },
        ],
        columns: [
          { key: "payerName", header: "Nama Muzakki", flex: 3 },
          { key: "payerContact", header: "Kontak", flex: 2 },
          { key: "familyCount", header: "Jiwa", flex: 1, align: "right" },
          { key: "amount", header: "Nominal", flex: 2, align: "right" },
          { key: "status", header: "Status", flex: 2 },
          { key: "recordedAt", header: "Tanggal", flex: 2 },
        ],
        rows: detail.records.map((r) => {
          const parts: string[] = [];
          if (r.amountMoney) parts.push(formatRupiah(r.amountMoney));
          if (r.amountRice) parts.push(`${r.amountRice} kg beras`);
          return {
            payerName: r.payerName,
            payerContact: r.payerContact ?? "-",
            familyCount: String(r.familyCount),
            amount: parts.length > 0 ? parts.join(" + ") : "-",
            status: STATUS_LABEL[r.status] ?? r.status,
            recordedAt: formatDateTime(r.recordedAt),
          };
        }),
        emptyMessage: `Belum ada pendaftaran zakat jenis ini pada periode ${monthLabel(year, month)}.`,
        disclaimer:
          "Laporan ini mencakup seluruh pendaftaran zakat yang tercatat untuk jenis ini pada periode tersebut, termasuk yang belum disalurkan.",
        filenameSlug: `zakat-${slugify(detail.label)}-${year}-${String(month).padStart(2, "0")}`,
      };
    }
    case "kurban": {
      const detail = await getQurbanTypeDetail(id, year);
      if (!detail) return null;
      return {
        title: `Laporan Kurban — ${detail.label}`,
        periodLabel: `Tahun ${detail.year}`,
        summary: [
          { label: "Total Nominal", value: formatRupiah(detail.totalAmount) },
          { label: "Total Bagian", value: String(detail.totalShares) },
          { label: "Jumlah Pendaftar", value: String(detail.count) },
        ],
        columns: [
          { key: "qurbanFor", header: "Atas Nama", flex: 3 },
          { key: "contactPhone", header: "No. HP", flex: 2 },
          { key: "sharesCount", header: "Bagian", flex: 1, align: "right" },
          { key: "amount", header: "Nominal", flex: 2, align: "right" },
          { key: "status", header: "Status", flex: 2 },
          { key: "recordedAt", header: "Tanggal", flex: 2 },
        ],
        rows: detail.records.map((r) => ({
          qurbanFor: r.qurbanFor,
          contactPhone: r.contactPhone ?? "-",
          sharesCount: String(r.sharesCount),
          amount: formatRupiah(r.amountPaid),
          status: STATUS_LABEL[r.status] ?? r.status,
          recordedAt: formatDateTime(r.recordedAt),
        })),
        emptyMessage: `Belum ada pendaftaran kurban jenis ini pada tahun ${detail.year}.`,
        disclaimer:
          "Laporan ini mencakup seluruh pendaftaran kurban yang tercatat untuk jenis hewan ini pada tahun tersebut, termasuk yang belum disembelih.",
        filenameSlug: `kurban-${slugify(detail.label)}-${detail.year}`,
      };
    }
    default:
      return null;
  }
}
