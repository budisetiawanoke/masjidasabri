import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";
import type { GuideDoc } from "@/lib/faq-content";

const BRAND = {
  green900: "#0F3D2E",
  gold500: "#D4A72C",
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
  title: { fontSize: 15, fontWeight: 700, color: BRAND.green900, marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#555", marginBottom: 18 },
  section: { marginBottom: 14 },
  heading: { fontSize: 11, fontWeight: 700, color: BRAND.green900, marginBottom: 4 },
  paragraph: { fontSize: 9.5, lineHeight: 1.5, marginBottom: 4 },
  stepRow: { flexDirection: "row", marginBottom: 3 },
  stepNumber: { width: 16, fontSize: 9.5, fontWeight: 700, color: BRAND.green900 },
  stepText: { flex: 1, fontSize: 9.5, lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#888" },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: "#888",
  },
});

function Emblem() {
  // Versi sederhana lambang yayasan untuk kop surat PDF — primitif
  // @react-pdf/renderer, sama seperti di FinancialReportDocument.tsx.
  return (
    <Svg width={32} height={32} viewBox="0 0 100 100" style={{ marginRight: 10 }}>
      <Circle cx={50} cy={50} r={47} fill={BRAND.cream} stroke={BRAND.gold500} strokeWidth={4} />
      <Path d="M20 68 L50 60 L80 68 L80 62 L50 54 L20 62 Z" fill={BRAND.green900} />
      <Path d="M32 60 C32 40 68 40 68 60 Z" stroke={BRAND.green900} strokeWidth={4} fill="none" />
      <Path d="M46 18 L54 18 L54 60 L46 60 Z" fill={BRAND.green900} />
    </Svg>
  );
}

/**
 * Dokumen PDF generik dari sebuah GuideDoc (src/lib/faq-content.ts) — dipakai
 * untuk Buku Panduan Penggunaan MAUPUN Playbook Pengurus & Jamaah, supaya
 * kedua berkas konsisten tanpa dua implementasi terpisah (pola sama seperti
 * DetailReportDocument.tsx yang generik lintas donasi/infaq/zakat/kurban).
 */
export function GuideDocument({
  doc,
  foundationName,
  generatedAt,
}: {
  doc: GuideDoc;
  foundationName: string;
  generatedAt: Date;
}) {
  return (
    <Document title={`${doc.title} — ${foundationName}`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow} fixed>
          <Emblem />
          <View>
            <Text style={styles.orgName}>{foundationName}</Text>
            <Text style={styles.orgSubtitle}>{doc.subtitle}</Text>
          </View>
        </View>
        <View style={styles.divider} fixed />

        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.subtitle}>
          Dicetak {generatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </Text>

        {doc.sections.map((section) => (
          <View style={styles.section} key={section.heading} wrap={false}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.paragraphs?.map((p, i) => (
              <Text style={styles.paragraph} key={i}>
                {p}
              </Text>
            ))}
            {section.steps?.map((step, i) => (
              <View style={styles.stepRow} key={i}>
                <Text style={styles.stepNumber}>{i + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.footer} fixed>
          {foundationName} · Dokumen dibuat otomatis oleh sistem
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
