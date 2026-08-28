"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle text-brand-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open && (
        <div
          id="mobile-nav-menu"
          className="absolute inset-x-0 top-full border-b border-border-subtle bg-brand-cream-50 px-4 pb-4 shadow-md"
        >
          <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-green-900 hover:bg-brand-green-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-brand-gold-500 px-3 py-2.5 text-center text-sm font-semibold text-brand-green-900"
            >
              Masuk
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
