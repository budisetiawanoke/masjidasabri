import type { Metadata } from "next";
import { ZakatCalculator } from "@/app/(public)/zakat-kurban/ZakatCalculator";
import { RegisterZakatForm, RegisterQurbanForm } from "@/app/(public)/zakat-kurban/RegisterForms";

export const metadata: Metadata = { title: "Zakat & Kurban" };

export default function ZakatKurbanPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-green-900">Zakat & Kurban</h1>
      <p className="mt-2 max-w-2xl text-foreground/70">
        Hitung kewajiban zakat Anda, lalu daftarkan pembayaran zakat atau qurban langsung dari
        halaman ini. Panitia akan menghubungi Anda untuk konfirmasi pembayaran.
      </p>

      <div className="mt-8">
        <ZakatCalculator />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <RegisterZakatForm />
        <RegisterQurbanForm />
      </div>
    </div>
  );
}
