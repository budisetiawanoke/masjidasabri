import { Emblem } from "@/components/brand/Emblem";
import { MapPin, Phone, Mail } from "lucide-react";
import packageJson from "../../../package.json";

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
    <footer className="mt-12 border-t border-border-subtle bg-brand-green-950 text-brand-cream-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <Emblem className="h-9 w-9 shrink-0" />
          <span className="font-display text-sm font-bold text-white">Masjid ASABRI</span>
        </div>

        <ul className="flex flex-col gap-1.5 text-xs text-brand-cream-50/80 sm:flex-row sm:items-center sm:gap-4">
          {address && (
            <li className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-gold-400 shrink-0" />
              <span>{address}</span>
            </li>
          )}
          {phone && (
            <li className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-gold-400 shrink-0" />
              <span>{phone}</span>
            </li>
          )}
          {email && (
            <li className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-gold-400 shrink-0" />
              <span>{email}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-[11px] text-brand-cream-50/60">
        © Masjid ASABRI, {new Date().getFullYear()} · v{packageJson.version}
      </div>
    </footer>
  );
}
