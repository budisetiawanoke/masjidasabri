import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getFoundationProfile } from "@/server/foundation/service";
import { ReceiptDocument, type ReceiptData } from "@/server/pdf/ReceiptDocument";
import { formatRupiah } from "@/lib/format";

// @react-pdf/renderer memakai API Node.js (Buffer, dsb.) — tidak jalan di
// Edge runtime, sama seperti /api/laporan-keuangan/pdf.
export const runtime = "nodejs";

const INFAQ_CATEGORY_LABEL: Record<string, string> = {
  OPERASIONAL: "Operasional Masjid",
  DHUAFA: "Dhuafa",
  ANAK_YATIM: "Anak Yatim",
};

const ZAKAT_TYPE_LABEL: Record<string, string> = {
  FITRAH: "Zakat Fitrah",
  MAAL: "Zakat Maal",
};

const ANIMAL_TYPE_LABEL: Record<string, string> = {
  SAPI: "Sapi (patungan)",
  KAMBING: "Kambing",
  DOMBA: "Domba",
};

/**
 * Nomor ID record (cuid) DIPAKAI LANGSUNG sebagai token akses bukti bayar —
 * tidak bisa ditebak (sama seperti pola nama-berkas-acak untuk foto bukti
 * transfer, lihat src/lib/upload.ts), jadi aman diakses publik tanpa login,
 * tanpa perlu kode pelacakan terpisah seperti kotak saran.
 */
async function loadReceiptData(type: string, id: string): Promise<ReceiptData | null> {
  switch (type) {
    case "donasi": {
      const record = await prisma.donationRecord.findUnique({
        where: { id },
        include: { campaign: { select: { title: true } } },
      });
      if (!record) return null;
      return {
        kind: "DONASI",
        receiptNo: `DON-${record.id}`,
        donorName: record.donorName,
        detailLabel: "Kampanye",
        detailValue: record.campaign.title,
        amountLabel: record.amount ? formatRupiah(record.amount) : null,
        recordedAt: record.recordedAt,
        foundationName: "",
      };
    }
    case "infaq": {
      const record = await prisma.infaqRecord.findUnique({ where: { id } });
      if (!record) return null;
      return {
        kind: "INFAQ",
        receiptNo: `INF-${record.id}`,
        donorName: record.donorName,
        detailLabel: "Peruntukan",
        detailValue: INFAQ_CATEGORY_LABEL[record.category] ?? record.category,
        amountLabel: record.amount ? formatRupiah(record.amount) : null,
        recordedAt: record.recordedAt,
        foundationName: "",
      };
    }
    case "zakat": {
      const record = await prisma.zakatRecord.findUnique({ where: { id } });
      if (!record) return null;
      const parts: string[] = [];
      if (record.amountMoney) parts.push(formatRupiah(record.amountMoney));
      if (record.amountRice) parts.push(`${record.amountRice} kg beras`);
      return {
        kind: "ZAKAT",
        receiptNo: `ZKT-${record.id}`,
        donorName: record.payerName,
        detailLabel: "Jenis Zakat",
        detailValue: `${ZAKAT_TYPE_LABEL[record.type] ?? record.type} · ${record.familyCount} jiwa`,
        amountLabel: parts.length > 0 ? parts.join(" + ") : null,
        recordedAt: record.recordedAt,
        foundationName: "",
      };
    }
    case "kurban": {
      const record = await prisma.qurbanRecord.findUnique({ where: { id } });
      if (!record) return null;
      return {
        kind: "KURBAN",
        receiptNo: `QRB-${record.id}`,
        donorName: record.qurbanFor,
        detailLabel: "Jenis Kurban",
        detailValue: `${ANIMAL_TYPE_LABEL[record.animalType] ?? record.animalType} · ${record.sharesCount} bagian · Tahun ${record.year}`,
        amountLabel: formatRupiah(record.amountPaid),
        recordedAt: record.recordedAt,
        foundationName: "",
      };
    }
    default:
      return null;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;

  const [receiptData, profile] = await Promise.all([loadReceiptData(type, id), getFoundationProfile()]);
  if (!receiptData) {
    return new Response("Bukti bayar tidak ditemukan.", { status: 404 });
  }
  receiptData.foundationName = profile.name;

  const buffer = await renderToBuffer(ReceiptDocument({ data: receiptData }));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bukti-bayar-${type}-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
