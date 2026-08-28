import type { Metadata } from "next";
import { SuggestionForm } from "@/app/(public)/kotak-saran/SuggestionForm";

export const metadata: Metadata = { title: "Kotak Saran & Pengaduan" };

export default function KotakSaranPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-green-900">Kotak Saran & Pengaduan</h1>
      <p className="mt-2 text-foreground/70">
        Sampaikan saran, kritik, atau pengaduan Anda kepada pengurus yayasan. Anda dapat mengirim
        secara anonim.
      </p>
      <div className="mt-8">
        <SuggestionForm />
      </div>
    </div>
  );
}
