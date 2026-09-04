import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";

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
  page: { padding: 40, fontSize: 9.5, color: BRAND.ink, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  orgName: { fontSize: 16, fontWeight: 700, color: BRAND.green900 },
  orgSubtitle: { fontSize: 9, color: "#555", marginTop: 2 },
  divider: { borderBottomWidth: 2, borderBottomColor: BRAND.gold500, marginTop: 10, marginBottom: 16 },
  title: { fontSize: 13, fontWeight: 700, color: BRAND.green900, marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#555", marginBottom: 16 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 18, flexWrap: "wrap" },
  summaryBox: { flexGrow: 1, minWidth: 110, borderWidth: 1, borderColor: BRAND.border, borderRadius: 4, padding: 10 },
  summaryLabel: { fontSize: 8, color: "#777", marginBottom: 4, textTransform: "uppercase" },
  summaryValue: { fontSize: 12, fontWeight: 700, color: BRAND.green900 },
  table: { borderWidth: 1, borderColor: BRAND.border, borderRadius: 4 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: BRAND.green900, paddingVertical: 6, paddingHorizontal: 6 },
  // paddingRight WAJIB ada di tiap sel (bukan cuma di container baris) —
  // react-pdf tidak punya gap/margin otomatis antar Text bersebelahan dalam
  // satu flexDirection:row seperti flexbox CSS biasa, jadi tanpa ini kolom
  // seperti "Nominal" dan "Status" nempel jadi satu ("Rp 100.000Menunggu
  // Konfirmasi") — bug nyata yang ditemukan & diperbaiki di sini.
  tableHeaderCell: { fontSize: 8, color: "#fff", fontWeight: 700, paddingRight: 8 },
  tableCell: { paddingRight: 8 },
  tableRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderTopWidth: 1, borderTopColor: BRAND.border },
  tableRowAlt: { backgroundColor: "#FAF8F1" },
  emptyRow: { padding: 16, textAlign: "center", fontSize: 9.5, color: "#777" },
  disclaimer: {
    marginTop: 18,
    padding: 10,
    backgroundColor: "#FAF1D8",
    borderRadius: 4,
    fontSize: 8,
    color: BRAND.ink,
    lineHeight: 1.5,
  },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#888" },
});

function Emblem() {
  return (
    <Svg width={32} height={32} viewBox="0 0 100 100" style={{ marginRight: 10 }}>
      <Circle cx={50} cy={50} r={47} fill={BRAND.cream} stroke={BRAND.gold500} strokeWidth={4} />
      <Path d="M20 68 L50 60 L80 68 L80 62 L50 54 L20 62 Z" fill={BRAND.green900} />
      <Path d="M32 60 C32 40 68 40 68 60 Z" stroke={BRAND.green900} strokeWidth={4} fill="none" />
      <Path d="M46 18 L54 18 L54 60 L46 60 Z" fill={BRAND.green900} />
    </Svg>
  );
}

export type DetailReportColumn = {
  key: string;
  header: string;
  /** Lebar relatif (flex) — kolom nominal biasanya diberi align kanan lewat `align`. */
  flex?: number;
  align?: "left" | "right";
};

export type DetailReportData = {
  title: string;
  periodLabel: string;
  foundationName: string;
  generatedAt: Date;
  summary: { label: string; value: string }[];
  columns: DetailReportColumn[];
  rows: Record<string, string>[];
  emptyMessage: string;
  disclaimer: string;
};

/**
 * Dokumen PDF generik untuk laporan detail per kampanye/peruntukan/jenis
 * (donasi, infaq, zakat, kurban) — satu komponen dipakai bersama oleh
 * keempatnya lewat src/app/api/laporan-detail/[kind]/[id]/pdf, supaya
 * tampilan konsisten dan tidak menduplikasi kode 4x. Beda dari
 * FinancialReportDocument.tsx (laporan kas resmi, agregat per kategori) —
 * ini menampilkan BARIS PER BARIS data individual (nama, nominal, tanggal,
 * status), bukan ringkasan.
 */
export function DetailReportDocument({ data }: { data: DetailReportData }) {
  return (
    <Document title={`${data.title} — ${data.periodLabel}`}>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.headerRow}>
          <Emblem />
          <View>
            <Text style={styles.orgName}>{data.foundationName}</Text>
            <Text style={styles.orgSubtitle}>{data.title} — Dokumen Transparansi Publik</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>
          Periode: {data.periodLabel} · Dicetak{" "}
          {data.generatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </Text>

        <View style={styles.summaryRow}>
          {data.summary.map((s) => (
            <View style={styles.summaryBox} key={s.label}>
              <Text style={styles.summaryLabel}>{s.label}</Text>
              <Text style={styles.summaryValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            {data.columns.map((col) => (
              <Text
                key={col.key}
                style={[styles.tableHeaderCell, { flex: col.flex ?? 1, textAlign: col.align ?? "left" }]}
              >
                {col.header}
              </Text>
            ))}
          </View>
          {data.rows.length === 0 && <Text style={styles.emptyRow}>{data.emptyMessage}</Text>}
          {data.rows.map((row, i) => (
            <View style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowAlt] : [])]} key={i}>
              {data.columns.map((col) => (
                <Text key={col.key} style={[styles.tableCell, { flex: col.flex ?? 1, textAlign: col.align ?? "left" }]}>
                  {row[col.key] ?? ""}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>{data.disclaimer}</Text>

        <Text style={styles.footer} fixed>
          {data.foundationName} · Dokumen dibuat otomatis oleh sistem — bukan dokumen bertanda tangan basah
        </Text>
      </Page>
    </Document>
  );
}
