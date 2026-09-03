import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { ZakatCalculator } from "@/app/(public)/zakat-kurban/ZakatCalculator";
import { RegisterZakatForm } from "@/app/(public)/zakat-kurban/RegisterForms";
import { Coins } from "lucide-react";

export const metadata: Metadata = { title: "Zakat" };

export default function ZakatPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-green-700 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <Coins className="h-5 w-5 text-brand-green-700" />
            Zakat
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Hitung kewajiban zakat Maal & Fitrah, lalu daftarkan pembayaran zakat Anda secara mandiri.
            Panitia amil yayasan siap melayani dan mengonfirmasi penyerahan Anda.
          </p>
        </CardBody>
      </Card>

      <ZakatCalculator />
      <RegisterZakatForm />
    </div>
  );
}
