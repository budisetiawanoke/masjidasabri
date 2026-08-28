import { Emblem } from "@/components/brand/Emblem";

export async function PublicFooter({
  address,
  phone,
  email,
}: {
  address?: string;
  phone?: string | null;
  email?: string | null;
}) {
  return (
    <footer className="mt-16 border-t border-border-subtle bg-brand-green-900 text-brand-cream-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Emblem className="h-12 w-12 shrink-0" />
          <div>
            <p className="font-display text-lg font-semibold">Masjid ASABRI</p>
            <p className="mt-1 text-sm text-brand-cream-50/70">
              Yayasan Masjid ASABRI Jatiasih — Pengurus periode 2026–2030.
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-gold-300">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-brand-cream-50/80">
            {address && <li>{address}</li>}
            {phone && <li>Telp: {phone}</li>}
            {email && <li>Email: {email}</li>}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-gold-300">Transparansi</p>
          <p className="mt-2 text-sm text-brand-cream-50/80">
            Seluruh dana infaq, sedekah, zakat, dan wakaf dicatat dan dilaporkan secara terbuka
            di halaman{" "}
            <a href="/laporan-keuangan" className="underline underline-offset-2 hover:text-brand-gold-300">
              Laporan Keuangan
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-cream-50/60">
        © {new Date().getFullYear()} Yayasan Masjid ASABRI Jatiasih. Sistem manajemen internal.
      </div>
    </footer>
  );
}
