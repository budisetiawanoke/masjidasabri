import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";
import { formatRupiah, monthLabel } from "@/lib/format";

const BRAND = {
  green900: "#0F3D2E",
  green700: "#1D5C42",
  gold500: "#D4A72C",
  terracotta700: "#96391B",
  cream: "#FBF7EE",
  ink: "#14231B",
  border: "#E4DCC8",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: BRAND.ink, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  orgName: { fontSize: 16, fontWeight: 700, color: BRAND.green900 },
  orgSubtitle: { fontSize: 9, color: "#555", marginTop: 2 },
  divider: { borderBottomWidth: 2, borderBottomColor: BRAND.gold500, marginTop: 10, marginBottom: 16 },
  title: { fontSize: 13, fontWeight: 700, color: BRAND.green900, marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#555", marginBottom: 16 },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  summaryBox: { flex: 1, borderWidth: 1, borderColor: BRAND.border, borderRadius: 4, padding: 10 },
  summaryLabel: { fontSize: 8, color: "#777", marginBottom: 4, textTransform: "uppercase" },
  summaryValue: { fontSize: 13, fontWeight: 700 },
  table: { borderWidth: 1, borderColor: BRAND.border, borderRadius: 4 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: BRAND.green900, paddingVertical: 6, paddingHorizontal: 8 },
  tableHeaderCell: { fontSize: 9, color: "#fff", fontWeight: 700 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
  },
  cellCategory: { flex: 3 },
  cellKind: { flex: 2 },
  cellCount: { flex: 1.5, textAlign: "right" },
  cellTotal: { flex: 2, textAlign: "right" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#888" },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FAF1D8",
    borderRadius: 4,
    fontSize: 8.5,
    color: BRAND.ink,
    lineHeight: 1.5,
  },
});

function Emblem() {
  // Versi sederhana lambang yayasan (lingkaran + siluet kubah/menara) untuk
  // kop surat PDF — primitif @react-pdf/renderer, bukan komponen SVG React
  // biasa, jadi digambar ulang secara ringkas di sini.
  return (
    <Svg width={32} height={32} viewBox="0 0 100 100" style={{ marginRight: 10 }}>
      <Circle cx={50} cy={50} r={47} fill={BRAND.cream} stroke={BRAND.gold500} strokeWidth={4} />
      <Path d="M20 68 L50 60 L80 68 L80 62 L50 54 L20 62 Z" fill={BRAND.green900} />
      <Path d="M32 60 C32 40 68 40 68 60 Z" stroke={BRAND.green900} strokeWidth={4} fill="none" />
      <Path d="M46 18 L54 18 L54 60 L46 60 Z" fill={BRAND.green900} />
    </Svg>
  );
}

export type MonthlyReportData = {
  year: number;
  month: number;
  categories: { name: string; kind: string; total: number; count: number }[];
  totalMasuk: number;
  totalKeluar: number;
  net: number;
  transactionCount: number;
};

export function FinancialReportDocument({
  report,
  saldo,
  foundationName,
  generatedAt,
}: {
  report: MonthlyReportData;
  saldo: number;
  foundationName: string;
  generatedAt: Date;
}) {
  return (
    <Document title={`Laporan Keuangan ${monthLabel(report.year, report.month)} — ${foundationName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Emblem />
          <View>
            <Text style={styles.orgName}>{foundationName}</Text>
            <Text style={styles.orgSubtitle}>Laporan Keuangan Bulanan — Dokumen Transparansi Publik</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <Text style={styles.title}>Rincian {monthLabel(report.year, report.month)}</Text>
        <Text style={styles.subtitle}>
          Dicetak {generatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} ·
          Hanya mencakup transaksi berstatus disahkan (approved)
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Pemasukan</Text>
            <Text style={[styles.summaryValue, { color: BRAND.green700 }]}>{formatRupiah(report.totalMasuk)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={[styles.summaryValue, { color: BRAND.terracotta700 }]}>{formatRupiah(report.totalKeluar)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Selisih Bersih</Text>
            <Text style={[styles.summaryValue, { color: BRAND.green900 }]}>{formatRupiah(report.net)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Saldo Kas Saat Ini</Text>
            <Text style={[styles.summaryValue, { color: BRAND.green900 }]}>{formatRupiah(saldo)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.cellCategory]}>Kategori</Text>
            <Text style={[styles.tableHeaderCell, styles.cellKind]}>Jenis</Text>
            <Text style={[styles.tableHeaderCell, styles.cellCount]}>Jml. Transaksi</Text>
            <Text style={[styles.tableHeaderCell, styles.cellTotal]}>Total</Text>
          </View>
          {report.categories.length === 0 && (
            <View style={styles.tableRow}>
              <Text>Belum ada transaksi disahkan pada periode ini.</Text>
            </View>
          )}
          {report.categories.map((c) => (
            <View style={styles.tableRow} key={c.name}>
              <Text style={styles.cellCategory}>{c.name}</Text>
              <Text style={[styles.cellKind, { color: c.kind === "MASUK" ? BRAND.green700 : BRAND.terracotta700 }]}>
                {c.kind === "MASUK" ? "Pemasukan" : "Pengeluaran"}
              </Text>
              <Text style={styles.cellCount}>{c.count}</Text>
              <Text style={styles.cellTotal}>{formatRupiah(c.total)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Dokumen ini dibuat otomatis dari sistem pengelolaan {foundationName} dan mencerminkan transaksi yang
          telah dicatat oleh bendahara serta disahkan oleh pengurus per tanggal cetak di atas. Setiap koreksi
          transaksi tercatat pada jejak audit internal (tidak menimpa data tanpa riwayat). Untuk rincian per
          transaksi atau riwayat koreksi, hubungi bendahara yayasan.
        </Text>

        <Text style={styles.footer} fixed>
          {foundationName} · Dokumen dibuat otomatis oleh sistem — bukan dokumen bertanda tangan basah
        </Text>
      </Page>
    </Document>
  );
}
