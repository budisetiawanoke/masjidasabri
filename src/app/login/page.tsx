import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { BismillahCalligraphy } from "@/components/brand/BismillahCalligraphy";
import { IslamicPattern } from "@/components/brand/IslamicPattern";
import { Card, CardBody } from "@/components/ui/Card";
import { LoginForm } from "@/app/login/LoginForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-cream-50 via-white to-brand-cream-100 px-4 py-12 overflow-hidden">
      <IslamicPattern className="opacity-10 text-brand-gold-500" />
      
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <BismillahCalligraphy className="mb-2 max-w-xs" />
          <div className="p-3 rounded-full bg-brand-green-900 border-2 border-brand-gold-500 shadow-xl mb-3">
            <Emblem className="h-14 w-14" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-green-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-gold-600" />
            Masuk ke Sistem Masjid ASABRI
          </h1>
          <p className="mt-1 text-xs font-semibold text-foreground/70">
            Khusus Pengurus, Bendahara, Super Admin, dan relawan/panitia terdaftar
          </p>
        </div>

        <Card className="border-t-4 border-t-brand-green-900 shadow-xl border-brand-gold-500/30">
          <CardBody className="p-6">
            <LoginForm callbackUrl={callbackUrl} />
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-sm font-semibold text-foreground/70">
          <Link href="/" className="inline-flex items-center gap-1.5 text-brand-green-800 hover:text-brand-green-950 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda Publik
          </Link>
        </p>
      </div>
    </div>
  );
}
