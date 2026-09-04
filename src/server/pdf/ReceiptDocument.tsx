import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle, Font } from "@react-pdf/renderer";
import { formatDateTime } from "@/lib/format";
import { QURAN_VERSES, GIVING_LABEL, type GivingKind } from "@/lib/quran-verses";

const BRAND = {
  green900: "#0F3D2E",
  green700: "#1D5C42",
  gold500: "#D4A72C",
  cream: "#FBF7EE",
  ink: "#14231B",
  border: "#E4DCC8",
};

// Font Arab (Amiri) untuk ayat Al-Qur'an — Helvetica bawaan @react-pdf/renderer
// tidak punya glyph Arab sama sekali. Didaftarkan lewat data: URL (base64)
// hasil readFileSync dengan PATH LITERAL, bukan path dinamis atau string
// dioper ke Font.register langsung — pola ini WAJIB supaya Next.js ikut
// men-trace & membundel berkas fontnya ke server produksi (ditemukan lewat
// bug nyata: berkas yang cuma direferensikan sebagai path/URL string, tanpa
// readFileSync eksplisit di kode kita sendiri, tidak ter-bundle di Firebase
// App Hosting — lihat docs/DEPLOYMENT.md).
let fontsRegistered = false;
function ensureFontsRegistered() {
  if (fontsRegistered) return;
  try {
    const toDataUrl = (filename: string) => {
      const buffer = readFileSync(join(process.cwd(), "src", "server", "pdf", "fonts", filename));
      return `data:font/ttf;base64,${buffer.toString("base64")}`;
    };
    Font.register({
      family: "Amiri",
      fonts: [
        { src: toDataUrl("Amiri-Regular.ttf"), fontWeight: 400 },
        { src: toDataUrl("Amiri-Bold.ttf"), fontWeight: 700 },
      ],
    });
  } catch {
    // Kalau pendaftaran font gagal (mis. berkas tidak ditemukan di suatu
    // lingkungan), biarkan saja — ayat tetap tampil lewat terjemahan &
    // rujukan surah/ayat, cuma teks Arabnya yang tidak akan tercetak rapi.
    // Bukti bayar tetap harus bisa diunduh walau ini gagal.
  }
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: BRAND.ink, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  orgName: { fontSize: 16, fontWeight: 700, color: BRAND.green900 },
  orgSubtitle: { fontSize: 9, color: "#555", marginTop: 2 },
  divider: { borderBottomWidth: 2, borderBottomColor: BRAND.gold500, marginTop: 10, marginBottom: 18 },
  title: { fontSize: 14, fontWeight: 700, color: BRAND.green900, textAlign: "center", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#777", textAlign: "center", marginBottom: 20 },
  infoBox: { borderWidth: 1, borderColor: BRAND.border, borderRadius: 4, padding: 14, marginBottom: 16 },
  infoRow: { flexDirection: "row", paddingVertical: 3 },
  infoLabel: { width: 130, fontSize: 9.5, color: "#666" },
  infoValue: { flex: 1, fontSize: 10.5, fontWeight: 700, color: BRAND.ink },
  thanksBox: {
    backgroundColor: BRAND.cream,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  thanksTitle: { fontSize: 10.5, fontWeight: 700, color: BRAND.green900, marginBottom: 5 },
  thanksText: { fontSize: 9.5, lineHeight: 1.6, color: BRAND.ink },
  verseBox: {
    borderWidth: 1,
    borderColor: BRAND.gold500,
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  verseArabic: {
    fontFamily: "Amiri",
    fontSize: 15,
    lineHeight: 1.9,
    textAlign: "right",
    color: BRAND.green900,
    marginBottom: 8,
  },
  verseTranslation: { fontSize: 9.5, lineHeight: 1.6, color: BRAND.ink, fontStyle: "italic" },
  verseReference: { fontSize: 9, color: BRAND.gold500, marginTop: 6, textAlign: "right", fontWeight: 700 },
  confirmNote: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: BRAND.green900,
    fontWeight: 700,
    textAlign: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    marginBottom: 16,
  },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#888", textAlign: "center" },
});

function Emblem() {
  // Versi sederhana lambang yayasan — primitif @react-pdf/renderer, sama
  // seperti dipakai di FinancialReportDocument.tsx.
  return (
    <Svg width={32} height={32} viewBox="0 0 100 100" style={{ marginRight: 10 }}>
      <Circle cx={50} cy={50} r={47} fill={BRAND.cream} stroke={BRAND.gold500} strokeWidth={4} />
      <Path d="M20 68 L50 60 L80 68 L80 62 L50 54 L20 62 Z" fill={BRAND.green900} />
      <Path d="M32 60 C32 40 68 40 68 60 Z" stroke={BRAND.green900} strokeWidth={4} fill="none" />
      <Path d="M46 18 L54 18 L54 60 L46 60 Z" fill={BRAND.green900} />
    </Svg>
  );
}

const TITLE_BY_KIND: Record<GivingKind, string> = {
  DONASI: "Bukti Penerimaan Donasi",
  INFAQ: "Bukti Penerimaan Infaq & Sadaqah",
  ZAKAT: "Bukti Penerimaan Zakat",
  KURBAN: "Bukti Penerimaan Kurban",
};

export type ReceiptData = {
  kind: GivingKind;
  receiptNo: string;
  donorName: string;
  /** Label baris detail — mis. "Kampanye", "Peruntukan", "Jenis Zakat", "Jenis Kurban". */
  detailLabel: string;
  detailValue: string;
  /** Baris nominal sudah diformat (Rupiah dan/atau beras) — null kalau donatur tidak mencantumkan nominal. */
  amountLabel: string | null;
  recordedAt: Date;
  foundationName: string;
};

export function ReceiptDocument({ data }: { data: ReceiptData }) {
  ensureFontsRegistered();
  const verse = QURAN_VERSES[data.kind];

  return (
    <Document title={`${TITLE_BY_KIND[data.kind]} — ${data.receiptNo}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Emblem />
          <View>
            <Text style={styles.orgName}>{data.foundationName}</Text>
            <Text style={styles.orgSubtitle}>Bukti Bayar Resmi — Dicetak Otomatis oleh Sistem</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <Text style={styles.title}>{TITLE_BY_KIND[data.kind]}</Text>
        <Text style={styles.subtitle}>No. Bukti: {data.receiptNo}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama</Text>
            <Text style={styles.infoValue}>{data.donorName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{data.detailLabel}</Text>
            <Text style={styles.infoValue}>{data.detailValue}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nominal</Text>
            <Text style={styles.infoValue}>{data.amountLabel ?? "Tidak dicantumkan"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal &amp; Waktu</Text>
            <Text style={[styles.infoValue, { fontWeight: 400 }]}>{formatDateTime(data.recordedAt)}</Text>
          </View>
        </View>

        <View style={styles.thanksBox}>
          <Text style={styles.thanksTitle}>Jazakumullahu Khairan Katsiran</Text>
          <Text style={styles.thanksText}>
            Atas nama pengurus {data.foundationName}, kami mengucapkan terima kasih dan penghargaan
            setinggi-tingginya atas {GIVING_LABEL[data.kind]} yang telah Bapak/Ibu/Saudara/i berikan. Semoga
            Allah Subhanahu wa Ta&apos;ala membalas kebaikan Anda dengan pahala yang berlipat ganda dan
            menjadikannya sebagai amal jariyah yang terus mengalir manfaatnya.
          </Text>
        </View>

        <View style={styles.verseBox}>
          <Text style={styles.verseArabic}>{verse.arabic}</Text>
          <Text style={styles.verseTranslation}>&ldquo;{verse.translation}&rdquo;</Text>
          <Text style={styles.verseReference}>{verse.reference}</Text>
        </View>

        <Text style={styles.confirmNote}>
          Pengurus akan melakukan konfirmasi atas {GIVING_LABEL[data.kind]} yang Anda berikan.
        </Text>

        <Text style={styles.footer} fixed>
          {data.foundationName} · Dokumen dibuat otomatis oleh sistem — bukan dokumen bertanda tangan basah ·
          Simpan bukti ini sebagai referensi Anda
        </Text>
      </Page>
    </Document>
  );
}
