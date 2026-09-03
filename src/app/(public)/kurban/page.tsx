import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/Card";
import { RegisterQurbanForm } from "@/app/(public)/zakat-kurban/RegisterForms";
import { HeartHandshake } from "lucide-react";

export const metadata: Metadata = { title: "Kurban" };

export default function KurbanPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-4">
      <Card className="border border-border-subtle border-t-2 border-t-brand-gold-500 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <HeartHandshake className="h-5 w-5 text-brand-gold-600" />
            Kurban
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground/70">
            Daftarkan ibadah qurban Anda secara mandiri. Panitia amil yayasan siap melayani dan
            mengonfirmasi penyerahan Anda.
          </p>
        </CardBody>
      </Card>

      <RegisterQurbanForm />
    </div>
  );
}
