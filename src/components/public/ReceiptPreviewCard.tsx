import { QURAN_VERSES, GIVING_LABEL } from "@/lib/quran-verses";
import type { ReceiptPreview } from "@/lib/action-state";

/**
 * Pratinjau bukti bayar DI DALAM APLIKASI — ditampilkan dalam modal
 * (src/components/public/DownloadLink.tsx) begitu jamaah menekan "Unduh
 * Bukti Bayar", SEBELUM berkas PDF sungguhan diunduh.
 *
 * Sengaja dirender sebagai HTML biasa, BUKAN dengan menampilkan berkas PDF
 * lewat <iframe> — WebView Android (dites di Samsung S24 Ultra) tidak
 * punya renderer PDF bawaan untuk konten ter-embed seperti itu (beda dari
 * Chrome desktop), jadi iframe PDF tampil kosong. HTML biasa bekerja di
 * semua platform tanpa perlu renderer PDF sama sekali. Isinya sengaja
 * sama persis dengan src/server/pdf/ReceiptDocument.tsx supaya pratinjau
 * & berkas yang diunduh selalu cocok. Font Arab pakai --font-arabic
 * (Amiri, sudah dimuat di root layout — lihat
 * src/components/brand/BismillahCalligraphy.tsx untuk pola yang sama).
 */
export function ReceiptPreviewCard({ preview }: { preview: ReceiptPreview }) {
  const verse = QURAN_VERSES[preview.kind];
  const label = GIVING_LABEL[preview.kind];

  return (
    <div className="space-y-4 p-4 text-sm">
      <div className="rounded-xl border border-border-subtle p-4">
        <div className="flex items-center justify-between border-b border-border-subtle/60 py-1.5">
          <span className="text-foreground/60">Nama</span>
          <span className="font-bold text-brand-green-900">{preview.donorName}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border-subtle/60 py-1.5">
          <span className="text-foreground/60">{preview.detailLabel}</span>
          <span className="font-bold text-brand-green-900">{preview.detailValue}</span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-foreground/60">Nominal</span>
          <span className="font-bold text-brand-green-900">{preview.amountLabel ?? "Tidak dicantumkan"}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-brand-cream-50/70 p-4">
        <p className="mb-1.5 font-bold text-brand-green-900">Jazakumullahu Khairan Katsiran</p>
        <p className="leading-relaxed text-foreground/80">
          Atas nama pengurus, kami mengucapkan terima kasih dan penghargaan setinggi-tingginya atas {label}{" "}
          yang telah Bapak/Ibu/Saudara/i berikan. Semoga Allah Subhanahu wa Ta&apos;ala membalas kebaikan
          Anda dengan pahala yang berlipat ganda dan menjadikannya sebagai amal jariyah yang terus mengalir
          manfaatnya.
        </p>
      </div>

      <div className="rounded-xl border border-brand-gold-500 p-4">
        <p
          dir="rtl"
          className="text-right text-lg leading-loose text-brand-green-900"
          style={{ fontFamily: "var(--font-arabic), 'Traditional Arabic', 'Scheherazade New', serif" }}
        >
          {verse.arabic}
        </p>
        <p className="mt-2 italic leading-relaxed text-foreground/80">&ldquo;{verse.translation}&rdquo;</p>
        <p className="mt-1 text-right text-xs font-bold text-brand-gold-700">{verse.reference}</p>
      </div>

      <p className="rounded-xl border-y border-border-subtle py-3 text-center font-bold text-brand-green-900">
        Pengurus akan melakukan konfirmasi atas {label} yang Anda berikan.
      </p>
    </div>
  );
}
