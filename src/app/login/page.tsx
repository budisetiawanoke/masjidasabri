import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { Card, CardBody } from "@/components/ui/Card";
import { LoginForm } from "@/app/login/LoginForm";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Emblem className="h-16 w-16" />
          <h1 className="mt-4 font-display text-xl font-semibold text-brand-green-900">
            Masuk ke Sistem Masjid ASABRI
          </h1>
          <p className="mt-1 text-sm text-foreground/70">Khusus pengurus, bendahara, dan jamaah terdaftar.</p>
        </div>
        <Card>
          <CardBody>
            <LoginForm callbackUrl={callbackUrl} />
          </CardBody>
        </Card>
        <p className="mt-6 text-center text-sm text-foreground/70">
          <Link href="/" className="underline underline-offset-2 hover:text-brand-green-900">
            ← Kembali ke situs publik
          </Link>
        </p>
      </div>
    </div>
  );
}
