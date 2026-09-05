import type { GuideDoc } from "@/lib/faq-content";

/**
 * Render isi Buku Panduan Penggunaan / Playbook sebagai HTML biasa —
 * dipakai DUA tempat: langsung di badan halaman /faq, dan sebagai
 * `previewContent` modal DownloadLink.tsx sebelum PDF-nya diunduh (pola
 * sama seperti ReceiptPreviewCard.tsx & ReportSummaryAndTable — supaya
 * yang tampil di layar sama persis dengan isi berkas PDF, satu sumber
 * data di src/lib/faq-content.ts, bukan dua yang bisa berbeda-beda).
 */
export function GuideSections({ doc, compact = false }: { doc: GuideDoc; compact?: boolean }) {
  return (
    <div className={compact ? "space-y-5 p-4 text-sm" : "space-y-8"}>
      {!compact && (
        <div>
          <h2 className="font-display text-xl font-bold text-brand-green-900">{doc.title}</h2>
          <p className="mt-1 text-sm text-foreground/70">{doc.subtitle}</p>
        </div>
      )}
      {doc.sections.map((section) => (
        <div key={section.heading} className="space-y-2">
          <h3 className={compact ? "font-bold text-brand-green-900" : "font-display text-base font-bold text-brand-green-900"}>
            {section.heading}
          </h3>
          {section.paragraphs?.map((p, i) => (
            <p key={i} className="leading-relaxed text-foreground/80">
              {p}
            </p>
          ))}
          {section.steps && (
            <ol className="list-decimal space-y-1.5 pl-5 leading-relaxed text-foreground/80">
              {section.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}
