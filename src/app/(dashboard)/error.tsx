"use client";

import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export default function DashboardError({ error }: { error: Error & { digest?: string } }) {
  const isForbidden = error.message.includes("izin") || error.message.includes("Sesi tidak ditemukan");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="max-w-md">
        <CardBody className="text-center">
          <h1 className="font-display text-xl font-semibold text-brand-green-900">
            {isForbidden ? "Akses Ditolak" : "Terjadi Kesalahan"}
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {isForbidden
              ? "Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi Super Admin jika ini keliru."
              : "Terjadi kesalahan saat memuat halaman. Silakan coba lagi."}
          </p>
          <LinkButton href="/dashboard" className="mt-4">
            Kembali ke Ringkasan
          </LinkButton>
          <p className="mt-4 text-xs text-foreground/70">
            <Link href="/" className="underline underline-offset-2">
              Kembali ke situs publik
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
