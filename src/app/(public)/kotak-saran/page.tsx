import type { Metadata } from "next";
import Link from "next/link";
import { SuggestionForm } from "@/app/(public)/kotak-saran/SuggestionForm";
import { BismillahCalligraphy } from "@/components/brand/BismillahCalligraphy";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { MessageSquare, KeyRound, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Kotak Saran & Pengaduan" };

export default function KotakSaranPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-800 p-8 text-white shadow-lg border border-brand-gold-500/30">
        <IslamicPattern className="opacity-10 text-brand-gold-300" />
        <div className="relative space-y-3">
          <BismillahCalligraphy className="mb-2 max-w-xs" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-brand-gold-400" />
            Kotak Saran & Pengaduan
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-brand-cream-50/90">
            Sampaikan saran, aspirasi, atau pengaduan Anda langsung kepada Pengurus Yayasan Masjid ASABRI. Kerahasiaan identitas Anda dijamin dan Anda juga dapat mengirimkannya secara anonim.
          </p>
        </div>
      </div>

      <Link
        href="/kotak-saran/cek-status"
        className="flex items-center justify-between gap-3 rounded-2xl border border-brand-gold-500/40 bg-brand-gold-50/50 p-4 text-sm font-semibold text-brand-green-900 transition-colors hover:bg-brand-gold-50"
      >
        <span className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-brand-gold-600" />
          Sudah pernah kirim? Cek status pakai kode pelacakan — tanpa perlu akun.
        </span>
        <ArrowRight className="h-4 w-4 shrink-0" />
      </Link>

      <SuggestionForm />
    </div>
  );
}
