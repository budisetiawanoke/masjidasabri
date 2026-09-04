import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listAnnouncements } from "@/server/events/service";
import { Pin } from "lucide-react";

export const metadata: Metadata = { title: "Pengumuman" };
// Render dinamis (bukan pre-render statis) — lihat penjelasan lengkap di
// src/app/(public)/page.tsx.
export const dynamic = "force-dynamic";

export default async function PengumumanPage() {
  const announcements = await listAnnouncements(20);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Card className="border border-border-subtle border-t-2 border-t-brand-gold-500 shadow-sm">
        <CardBody className="p-4 space-y-1">
          <span className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-bold uppercase tracking-wider text-brand-green-900">
            <Pin className="h-5 w-5 text-brand-gold-600" />
            Pengumuman
          </span>

          {announcements.length === 0 && (
            <p className="py-3 text-base text-foreground/70">Belum ada pengumuman.</p>
          )}
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`border-b border-border-subtle/60 py-2.5 last:border-0 ${
                a.isPinned ? "-mx-4 rounded-lg bg-brand-gold-50/40 px-4" : ""
              }`}
            >
              {a.isPinned && (
                <Badge tone="gold" className="mb-1 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                  <Pin className="h-3.5 w-3.5 mr-1" /> Disematkan
                </Badge>
              )}
              {a.imageUrl && (
                <Image
                  src={a.imageUrl}
                  alt={a.title}
                  width={640}
                  height={360}
                  unoptimized
                  className="mb-2 h-40 w-full rounded-lg border border-border-subtle object-cover"
                />
              )}
              <p className="text-base font-bold text-brand-green-900">{a.title}</p>
              <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-foreground/70">{a.body}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
